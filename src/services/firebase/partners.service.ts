import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/src/lib/firebase";
import { Partner } from "@/src/types/firebase";
import { partners as fallbackPartners } from "@/src/features/home/services/partners-data";

const COLLECTION_NAME = "aliados";

const defaultPartners: Partner[] = fallbackPartners.map((p, index) => ({
  id: p.id,
  name: p.name,
  logoUrl: `/logos/${p.id}.png`,
  active: true,
  order: index,
}));

/**
 * Obtener listado de aliados activos
 */
export async function getPartners(): Promise<Partner[]> {
  if (!isFirebaseConfigured() || !db) {
    return defaultPartners;
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("active", "==", true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return defaultPartners;
    }

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Partner, "id">),
    }));
    return data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching partners from Firestore:", error);
    return defaultPartners;
  }
}

/**
 * Suscripción en tiempo real a los aliados activos
 */
export function subscribePartners(
  onUpdate: (partners: Partner[]) => void
): Unsubscribe | (() => void) {
  if (!isFirebaseConfigured() || !db) {
    onUpdate(defaultPartners);
    return () => {};
  }

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("active", "==", true)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(defaultPartners);
        } else {
          const data = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Partner, "id">),
          }));
          data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          onUpdate(data);
        }
      },
      (error) => {
        console.error("Error subscribing to partners:", error);
        onUpdate(defaultPartners);
      }
    );
  } catch (error) {
    console.error("Error setting up partners subscription:", error);
    onUpdate(defaultPartners);
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
