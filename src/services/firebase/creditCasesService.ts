import {
  collection,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "@/src/firebase/config";
import { saveFormFileToIndexedDB } from "../fileStore";
import { CreditCase, CreditDocumentItem, CreditContractData, CreditStudyPayment, CreditCaseStatus } from "@/src/types/credit";

const COLLECTION_NAME = "credit_cases";

/**
 * Iniciar sesión o registrarse con Google
 * Si el administrador precargó previamente los datos del cliente (C.C., teléfono, etc.)
 * con este mismo correo, se fusionan automáticamente al perfil de Google.
 */
export async function loginWithGoogle(): Promise<FirebaseUser> {
  if (!auth || !db) throw new Error("Firebase Auth no inicializado");
  const provider = new GoogleAuthProvider();
  const cred = await signInWithPopup(auth, provider);
  const user = cred.user;
  const email = user.email ? user.email.trim().toLowerCase() : "";

  const userRef = doc(db, "users", user.uid);

  // Buscar si existía una ficha precargada por el administrador con este correo
  let preloadedData: any = null;
  let preloadedDocId: string | null = null;

  if (email) {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        if (d.id !== user.uid) {
          preloadedData = d.data();
          preloadedDocId = d.id;
          break;
        }
      }
    } catch (err) {
      console.warn("[LOGIN WITH GOOGLE] Error buscando ficha precargada:", err);
    }
  }

  const documentNumber =
    preloadedData?.documentNumber ||
    preloadedData?.cedula ||
    preloadedData?.documento ||
    preloadedData?.contactProfile?.documentNumber ||
    null;
  const documentType =
    preloadedData?.documentType ||
    preloadedData?.contactProfile?.documentType ||
    "CC";
  const phone =
    preloadedData?.phone ||
    preloadedData?.telefono ||
    preloadedData?.celular ||
    preloadedData?.contactProfile?.phone ||
    null;
  const clientName =
    preloadedData?.displayName ||
    preloadedData?.clientName ||
    preloadedData?.contactProfile?.clientName ||
    user.displayName ||
    "";

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: email,
      displayName: clientName,
      photoURL: user.photoURL || "",
      role: preloadedData?.role || "client",
      isAdmin: preloadedData?.isAdmin || false,
      ...(documentNumber && {
        documentNumber,
        cedula: documentNumber,
        documento: documentNumber,
      }),
      ...(documentType && { documentType }),
      ...(phone && {
        phone,
        telefono: phone,
        celular: phone,
      }),
      contactProfile: {
        ...(preloadedData?.contactProfile || {}),
        documentType: documentType,
        ...(documentNumber && { documentNumber }),
        ...(phone && { phone }),
        clientName: clientName,
        email: email,
        updatedAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Si había un documento temporal previo (creado por el admin), transferir sus casos y citas al nuevo user.uid
  if (preloadedDocId && preloadedDocId !== user.uid) {
    try {
      const casesQ = query(collection(db, "credit_cases"), where("userId", "==", preloadedDocId));
      const casesSnap = await getDocs(casesQ);
      for (const cDoc of casesSnap.docs) {
        await updateDoc(cDoc.ref, { userId: user.uid, updatedAt: serverTimestamp() });
      }

      const apptQ = query(collection(db, "appointments"), where("userId", "==", preloadedDocId));
      const apptSnap = await getDocs(apptQ);
      for (const aDoc of apptSnap.docs) {
        await updateDoc(aDoc.ref, { userId: user.uid, updatedAt: serverTimestamp() });
      }

      // Eliminar el documento temporal duplicado para que no quede duplicado en next-admin
      await deleteDoc(doc(db, "users", preloadedDocId));
    } catch (e) {
      console.warn("[LOGIN WITH GOOGLE] Error migrando casos/citas:", e);
    }
  }

  // Vincular también cualquier caso o cita que coincida con este email
  if (email) {
    try {
      const casesByEmailQ = query(collection(db, "credit_cases"), where("email", "==", email));
      const casesByEmailSnap = await getDocs(casesByEmailQ);
      for (const cDoc of casesByEmailSnap.docs) {
        if (!cDoc.data().userId || cDoc.data().userId !== user.uid) {
          await updateDoc(cDoc.ref, { userId: user.uid, updatedAt: serverTimestamp() });
        }
      }
    } catch (e) {
      console.warn("[LOGIN WITH GOOGLE] Error vinculando por email:", e);
    }
  }

  return user;
}

/**
 * Recuperación de contraseña por correo electrónico
 */
export async function resetPassword(email: string): Promise<void> {
  if (!auth) throw new Error("Firebase Auth no inicializado");
  await sendPasswordResetEmail(auth, email.trim());
}

/**
 * Actualizar perfil de usuario
 */
export async function updateUserProfile(fullName: string, phone: string = ""): Promise<void> {
  if (!auth || !auth.currentUser || !db) throw new Error("No hay usuario autenticado");
  const currentUser = auth.currentUser;

  await updateProfile(currentUser, { displayName: fullName });

  const userRef = doc(db, "users", currentUser.uid);
  await setDoc(
    userRef,
    {
      displayName: fullName,
      phone: phone,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Iniciar sesión de cliente
 */
export async function loginClient(email: string, pass: string): Promise<FirebaseUser> {
  if (!auth) throw new Error("Firebase Auth no inicializado");
  const cred = await signInWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

/**
 * Registrar nuevo cliente en Firebase Auth y crear perfil en Firestore
 */
export async function registerClient(email: string, pass: string, fullName: string, phone: string = ""): Promise<FirebaseUser> {
  if (!auth || !db) throw new Error("Firebase Auth o Firestore no inicializado");
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  if (fullName && cred.user) {
    await updateProfile(cred.user, { displayName: fullName });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Buscar si existía una ficha precargada por el administrador con este correo
  let preloadedData: any = null;
  let preloadedDocId: string | null = null;
  try {
    const q = query(collection(db, "users"), where("email", "==", cleanEmail));
    const snap = await getDocs(q);
    for (const d of snap.docs) {
      if (d.id !== cred.user.uid) {
        preloadedData = d.data();
        preloadedDocId = d.id;
        break;
      }
    }
  } catch (err) {
    console.warn("[REGISTER CLIENT] Error buscando ficha precargada:", err);
  }

  const documentNumber =
    preloadedData?.documentNumber ||
    preloadedData?.cedula ||
    preloadedData?.documento ||
    preloadedData?.contactProfile?.documentNumber ||
    null;
  const documentType =
    preloadedData?.documentType ||
    preloadedData?.contactProfile?.documentType ||
    "CC";
  const userPhone =
    phone ||
    preloadedData?.phone ||
    preloadedData?.telefono ||
    preloadedData?.celular ||
    null;
  const clientName =
    fullName ||
    preloadedData?.displayName ||
    preloadedData?.clientName ||
    "";

  const userRef = doc(db, "users", cred.user.uid);
  await setDoc(userRef, {
    uid: cred.user.uid,
    email: cleanEmail,
    displayName: clientName,
    phone: userPhone,
    role: preloadedData?.role || "client",
    ...(documentNumber && {
      documentNumber,
      cedula: documentNumber,
      documento: documentNumber,
    }),
    ...(documentType && { documentType }),
    contactProfile: {
      ...(preloadedData?.contactProfile || {}),
      documentType: documentType,
      ...(documentNumber && { documentNumber }),
      ...(userPhone && { phone: userPhone }),
      clientName: clientName,
      email: cleanEmail,
      updatedAt: serverTimestamp(),
    },
    createdAt: serverTimestamp(),
  }, { merge: true });

  if (preloadedDocId && preloadedDocId !== cred.user.uid) {
    try {
      const casesQ = query(collection(db, "credit_cases"), where("userId", "==", preloadedDocId));
      const casesSnap = await getDocs(casesQ);
      for (const cDoc of casesSnap.docs) {
        await updateDoc(cDoc.ref, { userId: cred.user.uid, updatedAt: serverTimestamp() });
      }
      await deleteDoc(doc(db, "users", preloadedDocId));
    } catch (e) {
      console.warn("[REGISTER CLIENT] Error migrando casos:", e);
    }
  }

  return cred.user;
}

/**
 * Cerrar sesión de cliente
 */
export async function logoutClient(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Suscripción al estado de autenticación del cliente
 */
export function subscribeClientAuth(
  callback: (user: FirebaseUser | null) => void
): Unsubscribe {
  if (!auth) {
    callback(null);
    return () => { };
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Escuchar en tiempo real el expediente de crédito del usuario autenticado
 */
export function subscribeUserCreditCase(
  userId: string,
  onUpdate: (creditCase: CreditCase | null) => void
): Unsubscribe {
  if (!db) {
    onUpdate(null);
    return () => { };
  }

  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(null);
      } else {
        const docSnap = snapshot.docs[0];
        const data = {
          id: docSnap.id,
          ...docSnap.data(),
        } as CreditCase;
        onUpdate(data);
      }
    },
    (err) => {
      console.error("Error subscribing to user credit case:", err);
      onUpdate(null);
    }
  );
}

/**
 * Sanitiza de manera segura cada objeto dentro del array 'documents' para Firestore.
 * Evita el error 'Property array contains an invalid nested entity' garantizando:
 * - Cero valores 'undefined' dentro de los elementos del array
 * - Cero cargas binarias Base64 gigantescas (fileDataUrl) que saturan el documento (límite 1MB de Firestore)
 * - Tipos primitivos válidos (string, boolean)
 */
export function sanitizeDocumentItem(docItem: any): CreditDocumentItem {
  const clean: Record<string, any> = {
    id: String(docItem?.id || `doc_${Date.now()}`),
    title: String(docItem?.title || "Documento"),
    required: Boolean(docItem?.required),
    status: ["pendiente", "en_revision", "aprobado", "rechazado"].includes(docItem?.status)
      ? docItem.status
      : "pendiente",
    fileUrl: String(docItem?.fileUrl || ""),
    fileName: String(docItem?.fileName || ""),
    rejectionReason: String(docItem?.rejectionReason || ""),
    uploadedAt: docItem?.uploadedAt
      ? (typeof docItem.uploadedAt === "string"
          ? docItem.uploadedAt
          : (docItem.uploadedAt?.toDate?.()?.toISOString?.() || String(docItem.uploadedAt)))
      : "",
    reviewedAt: docItem?.reviewedAt
      ? (typeof docItem.reviewedAt === "string"
          ? docItem.reviewedAt
          : (docItem.reviewedAt?.toDate?.()?.toISOString?.() || String(docItem.reviewedAt)))
      : "",
    description: String(docItem?.description || ""),
    category: (["empresa", "avalista", "pago", "otros"].includes(docItem?.category) ? docItem.category : "otros"),
  };

  return clean as CreditDocumentItem;
}

/**
 * Subir un documento a Firebase Storage y actualizar el expediente de crédito
 */
export async function uploadCreditDocumentFile(
  creditCaseId: string,
  documentId: string,
  file: File,
  currentDocuments: CreditDocumentItem[],
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!storage || !db) {
    throw new Error("Firebase Storage o Firestore no inicializados");
  }

  // 1. Subir archivo a Storage
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `creditos/${creditCaseId}/${documentId}_${Date.now()}_${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file);

  const downloadUrl = await new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Error uploading file to Storage:", error);
        reject(error);
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          try {
            saveFormFileToIndexedDB(url, file);
            saveFormFileToIndexedDB(storagePath, file);
            saveFormFileToIndexedDB(file.name, file);
            saveFormFileToIndexedDB(documentId, file);
          } catch (e) {
            console.warn("Error guardando en caché IndexedDB:", e);
          }
          resolve(url);
        } catch (urlErr) {
          reject(urlErr);
        }
      }
    );
  });

  // 2. Actualizar el documento en la lista de documentos del expediente con sanitización completa
  const updatedDocuments = (currentDocuments || []).map((docItem) => {
    if (docItem.id === documentId) {
      return sanitizeDocumentItem({
        ...docItem,
        fileUrl: downloadUrl,
        fileName: file.name,
        status: "en_revision",
        rejectionReason: "",
        uploadedAt: new Date().toISOString(),
      });
    }
    return sanitizeDocumentItem(docItem);
  });

  // 3. Si todos los requeridos están en revisión o aprobados, pasar el estado general a en_revision
  const allRequiredSent = updatedDocuments
    .filter((d) => d.required)
    .every((d) => d.status === "en_revision" || d.status === "aprobado");

  const caseRef = doc(db, COLLECTION_NAME, creditCaseId);
  await updateDoc(caseRef, {
    documents: updatedDocuments,
    ...(allRequiredSent ? { status: "en_revision" } : {}),
    updatedAt: serverTimestamp(),
  });

  return downloadUrl;
}

/**
 * Eliminar/remover un documento subido de un expediente de crédito
 */
export async function deleteCreditDocumentFile(
  creditCaseId: string,
  documentId: string,
  currentDocuments: CreditDocumentItem[]
): Promise<void> {
  if (!db) {
    throw new Error("Firestore no inicializado");
  }

  const targetDoc = (currentDocuments || []).find((d) => d.id === documentId);

  // 1. Intentar eliminar de Firebase Storage si existe fileUrl
  if (targetDoc?.fileUrl && storage) {
    try {
      const storageRef = ref(storage, targetDoc.fileUrl);
      await deleteObject(storageRef);
    } catch (error) {
      console.warn("No se pudo eliminar el archivo de Storage:", error);
    }
  }

  // 2. Limpiar la información del documento en Firestore con sanitización completa
  const updatedDocuments = (currentDocuments || []).map((docItem) => {
    if (docItem.id === documentId) {
      return sanitizeDocumentItem({
        ...docItem,
        fileUrl: "",
        fileName: "",
        status: "pendiente",
        rejectionReason: "",
        uploadedAt: "",
      });
    }
    return sanitizeDocumentItem(docItem);
  });

  // 3. Re-evaluar estado general del expediente si algún documento requerido queda pendiente
  const hasPendingRequired = updatedDocuments
    .filter((d) => d.required)
    .some((d) => d.status === "pendiente");

  const caseRef = doc(db, COLLECTION_NAME, creditCaseId);
  await updateDoc(caseRef, {
    documents: updatedDocuments,
    ...(hasPendingRequired ? { status: "documentos_solicitados" } : {}),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Guardar firma digital del contrato de prestación de servicios
 */
export async function saveCreditContractSignature(
  creditCaseId: string,
  contractUpdate: Partial<CreditContractData>
): Promise<void> {
  if (!db) throw new Error("Firestore no inicializado");

  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const month = monthNames[today.getMonth()];
  const year = String(today.getFullYear());

  const caseRef = doc(db, COLLECTION_NAME, creditCaseId);
  await updateDoc(caseRef, {
    "contract.signed": true,
    "contract.signedAt": serverTimestamp(),
    "contract.signedDateDay": day,
    "contract.signedDateMonth": month,
    "contract.signedDateYear": year,
    ...Object.entries(contractUpdate).reduce((acc, [key, val]) => {
      if (val !== undefined) acc[`contract.${key}`] = val;
      return acc;
    }, {} as Record<string, any>),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Subir comprobante de pago del estudio de crédito ($250.000 Bancolombia)
 */
export async function uploadStudyPaymentReceipt(
  creditCaseId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!storage || !db) throw new Error("Firebase Storage o Firestore no inicializados");

  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `creditos/${creditCaseId}/estudio_pago_${Date.now()}_${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  const uploadTask = uploadBytesResumable(storageRef, file);

  const downloadUrl = await new Promise<string>((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(progress);
      },
      (error) => {
        console.error("Error uploading study receipt:", error);
        reject(error);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });

  const caseRef = doc(db, COLLECTION_NAME, creditCaseId);
  await updateDoc(caseRef, {
    studyPayment: {
      cost: 250000,
      bankName: "BANCOLOMBIA",
      accountType: "Cuenta Corriente",
      accountNumber: "29899994884",
      accountNit: "901500993",
      fileUrl: downloadUrl,
      fileName: file.name,
      status: "en_revision",
      uploadedAt: new Date().toISOString(),
    },
    updatedAt: serverTimestamp(),
  });

  return downloadUrl;
}

/**
 * Actualizar datos principales del cliente (Cédula, Teléfono, etc.) si estaban incompletos
 */
export async function updateCreditCaseClientData(
  creditCaseId: string,
  data: {
    documentNumber?: string;
    documentType?: string;
    phone?: string;
    email?: string;
    clientName?: string;
    city?: string;
    address?: string;
  }
): Promise<void> {
  if (!db) throw new Error("Firebase DB no disponible");
  const caseRef = doc(db, COLLECTION_NAME, creditCaseId);
  await updateDoc(caseRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });

  // Guardar también en perfil de usuario global
  await saveOrUpdateUserData(data);
}

/**
 * Actualizar estado del caso de crédito (ej: pasar a 'en_revision')
 */
export async function updateCreditCaseStatus(
  creditCaseId: string,
  newStatus: CreditCaseStatus,
  statusNote?: string
): Promise<void> {
  if (!db) throw new Error("Firebase DB no disponible");
  const caseRef = doc(db, COLLECTION_NAME, creditCaseId);
  await updateDoc(caseRef, {
    status: newStatus,
    ...(statusNote ? { statusNote } : {}),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Guarda o actualiza automáticamente Cédula, Teléfono y datos del cliente
 * en localStorage y Firestore (colección `users` y `credit_cases`) en cualquier formulario
 */
export async function saveOrUpdateUserData(data: {
  documentNumber?: string;
  documentType?: string;
  phone?: string;
  email?: string;
  clientName?: string;
  city?: string;
}): Promise<void> {
  // 1. Guardar en localStorage como caché persistente del navegador
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem("next_user_saved_data") || "{}");
      const updated = {
        ...existing,
        ...(data.documentNumber && data.documentNumber !== "No asignado" ? { documentNumber: data.documentNumber.trim() } : {}),
        ...(data.documentType ? { documentType: data.documentType.trim() } : {}),
        ...(data.phone ? { phone: data.phone.trim() } : {}),
        ...(data.email ? { email: data.email.trim().toLowerCase() } : {}),
        ...(data.clientName ? { clientName: data.clientName.trim() } : {}),
        ...(data.city ? { city: data.city.trim() } : {}),
      };
      localStorage.setItem("next_user_saved_data", JSON.stringify(updated));
    } catch(e) {}
  }

  // 2. Si el usuario está autenticado en Firebase Auth, guardar en su perfil de Firestore
  if (auth && auth.currentUser && db) {
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const updatePayload: Record<string, any> = {
        updatedAt: serverTimestamp(),
      };
      if (data.documentNumber && data.documentNumber !== "No asignado") updatePayload.documentNumber = data.documentNumber.trim();
      if (data.documentType) updatePayload.documentType = data.documentType.trim();
      if (data.phone) updatePayload.phone = data.phone.trim();
      if (data.email) updatePayload.email = data.email.trim().toLowerCase();
      if (data.clientName) updatePayload.displayName = data.clientName.trim();
      if (data.city) updatePayload.city = data.city.trim();

      await setDoc(userRef, updatePayload, { merge: true });
    } catch(e) {
      console.warn("Error guardando datos de usuario en Firestore:", e);
    }
  }

  // 3. Sincronizar en casos de crédito existentes que coincidan con su email
  if (db && (data.email || auth?.currentUser?.email)) {
    try {
      const targetEmail = (data.email || auth?.currentUser?.email || "").trim().toLowerCase();
      if (targetEmail) {
        const q = query(collection(db, "credit_cases"), where("email", "==", targetEmail));
        const snap = await getDocs(q);
        snap.forEach(async (docSnap) => {
          const caseRef = doc(db, "credit_cases", docSnap.id);
          const patch: Record<string, any> = { updatedAt: serverTimestamp() };
          if (data.documentNumber && data.documentNumber !== "No asignado") patch.documentNumber = data.documentNumber.trim();
          if (data.documentType) patch.documentType = data.documentType.trim();
          if (data.phone) patch.phone = data.phone.trim();
          if (data.clientName) patch.clientName = data.clientName.trim();
          if (data.city) patch.city = data.city.trim();
          await updateDoc(caseRef, patch);
        });
      }
    } catch(e) {}
  }
}

/**
 * Obtiene los datos guardados del usuario (Cédula, Teléfono, etc.)
 * para autocompletar automáticamente cualquier formulario
 */
export function getSavedUserData(): {
  documentNumber?: string;
  documentType?: string;
  phone?: string;
  email?: string;
  clientName?: string;
  city?: string;
} {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("next_user_saved_data") || "{}");
  } catch(e) {
    return {};
  }
}



