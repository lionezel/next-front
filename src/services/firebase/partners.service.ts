import {
  collection,
  getDocs,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { Partner } from "@/src/types/firebase";

const COLLECTION_NAME = "aliados";

export const fallbackPartners: Partner[] = [
  { id: "p1", name: "Bancolombia", logoUrl: "", description: "Crédito & Financiación Bancaria", website: "https://bancolombia.com", category: "credito", active: true, order: 1 },
  { id: "p2", name: "Sura Seguros", logoUrl: "", description: "Protección Integral de Salud y Vida", website: "https://sura.com", category: "seguros", active: true, order: 2 },
  { id: "p3", name: "Seguros Bolívar", logoUrl: "", description: "Pólizas Vehiculares y Patrimoniales", website: "https://segurosbolivar.com", category: "seguros", active: true, order: 3 },
  { id: "p4", name: "Allianz Seguros", logoUrl: "", description: "Cobertura Médica & Autos Global", website: "https://allianz.co", category: "seguros", active: true, order: 4 },
  { id: "p5", name: "AXA Colpatria", logoUrl: "", description: "Pólizas de Salud, Autos y ARL", website: "https://axacolpatria.co", category: "seguros", active: true, order: 5 },
  { id: "p6", name: "Mapfre Seguros", logoUrl: "", description: "Seguros de Transporte, Hogar y Vida", website: "https://mapfre.com.co", category: "seguros", active: true, order: 6 },
  { id: "p7", name: "Banco de Bogotá", logoUrl: "", description: "Líneas de Crédito Institucional", website: "https://bancodebogota.com", category: "credito", active: true, order: 7 },
  { id: "p8", name: "Seguros del Estado", logoUrl: "", description: "Cumplimiento y Responsabilidad Civil", website: "https://segurosdelestado.com", category: "seguros", active: true, order: 8 },
  { id: "p9", name: "Zurich Seguros", logoUrl: "", description: "Protección Patrimonial y Riesgos", website: "https://zurichseguros.com.co", category: "seguros", active: true, order: 9 },
  { id: "p10", name: "MetLife", logoUrl: "", description: "Seguro de Vida y Ahorro Programado", website: "https://metlife.com.co", category: "seguros", active: true, order: 10 },
  { id: "p11", name: "Credicorp Capital", logoUrl: "", description: "Portafolios Globales de Rentabilidad", website: "https://credicorpcapital.com", category: "inversiones", active: true, order: 11 },
  { id: "p12", name: "Smart Fit Club", logoUrl: "", description: "Centros de Acondicionamiento y Bienestar", website: "https://smartfit.com.co", category: "fit", active: true, order: 12 },
];

/**
 * Obtener listado de aliados activos de Firestore
 */
export async function getPartners(): Promise<Partner[]> {
  if (!db) {
    return fallbackPartners;
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      return fallbackPartners;
    }

    const data: Partner[] = snapshot.docs
      .map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Partner, "id">),
      }))
      .filter((item) => item.active !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    return data.length > 0 ? data : fallbackPartners;
  } catch (error) {
    console.error("Error fetching partners from Firestore:", error);
    return fallbackPartners;
  }
}

/**
 * Suscripción en tiempo real a los aliados activos
 */
export function subscribePartners(
  onUpdate: (partners: Partner[]) => void
): Unsubscribe | (() => void) {
  if (!db) {
    onUpdate(fallbackPartners);
    return () => {};
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);

    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(fallbackPartners);
        } else {
          const data: Partner[] = snapshot.docs
            .map((docSnap) => ({
              id: docSnap.id,
              ...(docSnap.data() as Omit<Partner, "id">),
            }))
            .filter((item) => item.active !== false)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          onUpdate(data.length > 0 ? data : fallbackPartners);
        }
      },
      (error) => {
        console.error("Error subscribing to partners:", error);
        onUpdate(fallbackPartners);
      }
    );
  } catch (error) {
    console.error("Error setting up partners subscription:", error);
    onUpdate(fallbackPartners);
    return () => {};
  }
}

/**
 * Guardar o actualizar un aliado (Utilizado también en distripako-admin)
 */
export async function savePartner(partner: Partial<Partner> & { id?: string }): Promise<string> {
  if (!db) throw new Error("Firestore no está inicializado");

  const partnerId = partner.id || doc(collection(db, COLLECTION_NAME)).id;
  const docRef = doc(db, COLLECTION_NAME, partnerId);

  await setDoc(
    docRef,
    {
      ...partner,
      id: partnerId,
      active: partner.active ?? true,
      order: partner.order ?? 0,
      updatedAt: serverTimestamp(),
      ...(partner.createdAt ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );

  return partnerId;
}

/**
 * Eliminar o desactivar un aliado
 */
export async function deletePartner(partnerId: string): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");
  await deleteDoc(doc(db, COLLECTION_NAME, partnerId));
}
