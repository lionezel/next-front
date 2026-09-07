import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/src/lib/firebase";
import { OrderQuote, OrderStatus } from "@/src/types/firebase";

const COLLECTION_NAME = "encargos";

/**
 * Generador de código único de cotización/encargo (Ej: DP-26-4821)
 */
export function generateOrderCode(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `DP-${year}-${randomSuffix}`;
}

/**
 * Registrar un nuevo encargo / cotización en Firestore
 */
export async function createOrderQuote(
  orderData: Omit<OrderQuote, "id" | "code" | "status" | "createdAt"> & {
    code?: string;
  }
): Promise<{ id: string; code: string }> {
  const code = orderData.code || generateOrderCode();

  if (!isFirebaseConfigured() || !db) {
    console.info("Firebase no configurado, cotización generada localmente:", code);
    return { id: `local-${Date.now()}`, code };
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...orderData,
      code,
      status: "pendiente" as OrderStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, code };
  } catch (error) {
    console.error("Error creating order quote in Firestore:", error);
    return { id: `fallback-${Date.now()}`, code };
  }
}

/**
 * Obtener todos los encargos (para distripako-admin)
 */
export async function getOrderQuotes(): Promise<OrderQuote[]> {
  if (!isFirebaseConfigured() || !db) return [];

  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<OrderQuote, "id">),
    }));
    return data.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching order quotes:", error);
    return [];
  }
}

/**
 * Suscripción en tiempo real a los encargos (para distripako-admin)
 */
export function subscribeOrderQuotes(
  onUpdate: (quotes: OrderQuote[]) => void
): Unsubscribe | (() => void) {
  if (!isFirebaseConfigured() || !db) {
    onUpdate([]);
    return () => {};
  }

  try {
    return onSnapshot(collection(db, COLLECTION_NAME), (snapshot) => {
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<OrderQuote, "id">),
      }));
      data.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      onUpdate(data);
    });
  } catch (error) {
    console.error("Error subscribing to order quotes:", error);
    return () => {};
  }
}

/**
 * Actualizar estado de un encargo (para distripako-admin)
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");

  const docRef = doc(db, COLLECTION_NAME, orderId);
  await updateDoc(docRef, {
    status: newStatus,
    updatedAt: serverTimestamp(),
  });
}
