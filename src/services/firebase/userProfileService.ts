import { doc, getDoc, setDoc, collection, query, where, getDocs, limit, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/src/firebase/config";

export interface UserContactProfile {
  documentType?: string;
  documentNumber?: string;
  clientName?: string;
  displayName?: string;
  phone?: string;
  email?: string;
  city?: string;
  address?: string;
  companyName?: string;
  companyNit?: string;
  updatedAt?: unknown;
}

const USERS_COLLECTION = "users";

/**
 * Saves the user's contact profile (personal data) to the ROOT of their Firestore document.
 * This ensures the data is visible in both next-front (portal) and next-admin (web-users table).
 * Uses merge so other fields (role, photoURL, etc.) are NOT overwritten.
 */
export async function saveUserContactProfile(
  uid: string,
  profile: Omit<UserContactProfile, "updatedAt">
): Promise<void> {
  if (!db) throw new Error("Firestore not initialized");
  const userRef = doc(db, USERS_COLLECTION, uid);

  const cleanDoc = profile.documentNumber && profile.documentNumber !== "No asignado" ? profile.documentNumber.trim() : "";
  const cleanPhone = profile.phone ? profile.phone.trim() : "";
  const cleanName = profile.clientName ? profile.clientName.trim() : "";

  await setDoc(
    userRef,
    {
      // Save at root level so next-admin can read them directly
      ...(profile.documentType && { documentType: profile.documentType }),
      ...(cleanDoc && { documentNumber: cleanDoc, cedula: cleanDoc, documento: cleanDoc }),
      ...(cleanPhone && { phone: cleanPhone, phoneNumber: cleanPhone, telefono: cleanPhone, celular: cleanPhone }),
      ...(cleanName && {
        displayName: cleanName,
        clientName: cleanName,
      }),
      ...(profile.email && { email: profile.email.trim().toLowerCase() }),
      ...(profile.city && { city: profile.city.trim() }),
      ...(profile.address && { address: profile.address.trim() }),
      ...(profile.companyName && { companyName: profile.companyName.trim() }),
      ...(profile.companyNit && { companyNit: profile.companyNit.trim() }),
      // Keep contactProfile snapshot for easy access
      contactProfile: {
        ...profile,
        ...(cleanDoc && { documentNumber: cleanDoc }),
        ...(cleanPhone && { phone: cleanPhone }),
        ...(cleanName && { clientName: cleanName }),
        updatedAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Fetches the user's saved contact profile from their Firestore document.
 * Deeply checks all possible field aliases (documentNumber, cedula, documento, cc, phone, telefono, celular).
 * If missing, falls back to searching recent appointments or credit cases for this user.
 */
export async function getUserContactProfile(
  uid: string
): Promise<UserContactProfile | null> {
  if (!db) return null;

  let data: any = {};
  if (uid) {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      data = snap.data();
    }
  }

  const currentUser = auth?.currentUser;
  const isSelf = currentUser && currentUser.uid === uid;
  const authPhone = isSelf ? currentUser.phoneNumber || "" : "";
  const authEmail = isSelf ? currentUser.email || "" : "";
  const authName = isSelf ? currentUser.displayName || "" : "";

  let documentType =
    data.documentType ||
    data.contactProfile?.documentType ||
    "CC";

  let documentNumber =
    data.documentNumber ||
    data.cedula ||
    data.documento ||
    data.cc ||
    data.dni ||
    data.numDocumento ||
    data.contactProfile?.documentNumber ||
    data.contactProfile?.cedula ||
    data.contactProfile?.documento ||
    "";

  let phone =
    data.phone ||
    data.phoneNumber ||
    data.telefono ||
    data.celular ||
    data.tel ||
    data.contactProfile?.phone ||
    data.contactProfile?.telefono ||
    data.contactProfile?.celular ||
    authPhone ||
    "";

  let clientName =
    data.clientName ||
    data.displayName ||
    data.nombre ||
    data.nombreCompleto ||
    data.contactProfile?.clientName ||
    authName ||
    "";

  let email =
    data.email ||
    data.correo ||
    data.contactProfile?.email ||
    authEmail ||
    "";

  let city =
    data.city ||
    data.ciudad ||
    data.contactProfile?.city ||
    "Medellín";

  let address =
    data.address ||
    data.direccion ||
    data.contactProfile?.address ||
    "";

  let companyName =
    data.companyName ||
    data.empresa ||
    data.contactProfile?.companyName ||
    "";

  let companyNit =
    data.companyNit ||
    data.nit ||
    data.contactProfile?.companyNit ||
    "";

  if (documentNumber === "No asignado") {
    documentNumber = "";
  }

  // Fallback 1: Search appointments collection if documentNumber or phone is missing
  if (!documentNumber || !phone) {
    try {
      let apptQuery;
      if (uid) {
        apptQuery = query(collection(db, "appointments"), where("userId", "==", uid), limit(3));
      } else if (email) {
        apptQuery = query(collection(db, "appointments"), where("email", "==", email), limit(3));
      }

      if (apptQuery) {
        const apptSnap = await getDocs(apptQuery);
        for (const docItem of apptSnap.docs) {
          const apptData = docItem.data();
          if (!documentNumber) {
            documentNumber =
              apptData.documentNumber || apptData.cedula || apptData.documento || apptData.cc || "";
            if (documentNumber === "No asignado") documentNumber = "";
          }
          if (!phone) {
            phone = apptData.phone || apptData.telefono || apptData.celular || apptData.phoneNumber || "";
          }
          if (!clientName) {
            clientName = apptData.clientName || apptData.displayName || apptData.nombre || "";
          }
          if (documentNumber && phone) break;
        }
      }
    } catch (e) {
      console.warn("Could not fetch fallback profile from appointments:", e);
    }
  }

  // Fallback 2: Search credit_cases collection if documentNumber or phone is missing
  if (!documentNumber || !phone) {
    try {
      let caseQuery;
      if (uid) {
        caseQuery = query(collection(db, "credit_cases"), where("userId", "==", uid), limit(3));
      } else if (email) {
        caseQuery = query(collection(db, "credit_cases"), where("email", "==", email), limit(3));
      }

      if (caseQuery) {
        const caseSnap = await getDocs(caseQuery);
        for (const docItem of caseSnap.docs) {
          const caseData = docItem.data();
          if (!documentNumber) {
            documentNumber =
              caseData.documentNumber || caseData.contract?.repLegalDoc || caseData.cedula || "";
            if (documentNumber === "No asignado") documentNumber = "";
          }
          if (!phone) {
            phone = caseData.phone || caseData.contract?.phone || caseData.telefono || "";
          }
          if (!clientName) {
            clientName = caseData.clientName || caseData.contract?.repLegalName || "";
          }
          if (documentNumber && phone) break;
        }
      }
    } catch (e) {
      console.warn("Could not fetch fallback profile from credit_cases:", e);
    }
  }

  // If missing fields were retrieved from fallbacks, persist them to user's root document
  if (uid && (documentNumber || phone)) {
    try {
      const updatesToPersist: any = {};
      if (documentNumber && !data.documentNumber) {
        updatesToPersist.documentNumber = documentNumber;
        updatesToPersist.cedula = documentNumber;
      }
      if (phone && !data.phone) {
        updatesToPersist.phone = phone;
        updatesToPersist.phoneNumber = phone;
      }
      if (clientName && !data.clientName) {
        updatesToPersist.clientName = clientName;
        updatesToPersist.displayName = clientName;
      }
      if (Object.keys(updatesToPersist).length > 0) {
        await setDoc(doc(db, USERS_COLLECTION, uid), updatesToPersist, { merge: true });
      }
    } catch (e) {
      console.warn("Could not persist auto-filled fields to user profile:", e);
    }
  }

  return {
    documentType,
    documentNumber,
    clientName,
    phone,
    email,
    city,
    address,
    companyName,
    companyNit,
  };
}
