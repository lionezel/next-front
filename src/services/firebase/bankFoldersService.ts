import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { BankFolder, BankTemplate } from "@/src/types/bankForm";
import { DEFAULT_BANKS } from "@/src/data/bankProfileMatrix";

const COLLECTION_NAME = "bank_folders";

/**
 * Obtener todas las carpetas de bancos con sus plantillas
 */
export async function getBankFolders(): Promise<BankFolder[]> {
  if (!db) return DEFAULT_BANKS;

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      // Inicializar con la lista predeterminada si la colección está vacía
      for (const bank of DEFAULT_BANKS) {
        await setDoc(doc(db, COLLECTION_NAME, bank.id), {
          ...bank,
          updatedAt: serverTimestamp(),
        });
      }
      return DEFAULT_BANKS;
    }

    const folders: BankFolder[] = [];
    snap.forEach((docSnap) => {
      folders.push({ id: docSnap.id, ...docSnap.data() } as BankFolder);
    });

    return folders.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error al obtener carpetas de bancos:", error);
    return DEFAULT_BANKS;
  }
}

/**
 * Agregar o actualizar una plantilla dentro de una carpeta de banco
 */
export async function addBankTemplate(
  bankId: string,
  template: Omit<BankTemplate, "id" | "createdAt">
): Promise<BankFolder[]> {
  const folders = await getBankFolders();
  const folder = folders.find((f) => f.id === bankId);

  if (!folder) throw new Error("Banco no encontrado");

  const newTemplate: BankTemplate = {
    ...template,
    id: `tpl_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  const updatedTemplates = [...(folder.templates || []), newTemplate];

  if (db) {
    const bankRef = doc(db, COLLECTION_NAME, bankId);
    await updateDoc(bankRef, {
      templates: updatedTemplates,
      updatedAt: serverTimestamp(),
    });
  }

  folder.templates = updatedTemplates;
  return [...folders];
}

/**
 * Eliminar una plantilla de un banco
 */
export async function deleteBankTemplate(
  bankId: string,
  templateId: string
): Promise<BankFolder[]> {
  const folders = await getBankFolders();
  const folder = folders.find((f) => f.id === bankId);

  if (!folder) throw new Error("Banco no encontrado");

  const updatedTemplates = (folder.templates || []).filter((t) => t.id !== templateId);

  if (db) {
    const bankRef = doc(db, COLLECTION_NAME, bankId);
    await updateDoc(bankRef, {
      templates: updatedTemplates,
      updatedAt: serverTimestamp(),
    });
  }

  folder.templates = updatedTemplates;
  return [...folders];
}
