import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { BranchOffice, BRANCH_OFFICES } from "@/src/types/appointment";

const COLLECTION_NAME = "sedes";

/**
 * Suscribirse a las sedes activas en tiempo real desde Firestore.
 * Si no hay sedes configuradas en la colección, utiliza las sedes por defecto.
 */
export function subscribeActiveBranches(
  onUpdate: (branches: BranchOffice[]) => void
): Unsubscribe | (() => void) {
  if (!db) {
    onUpdate(BRANCH_OFFICES);
    return () => {};
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);

    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          // Si aún no se han configurado sedes en Firestore, retornar las sedes iniciales
          onUpdate(BRANCH_OFFICES);
          return;
        }

        const list: BranchOffice[] = [];
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          // Solo sedes activas (si 'active' no está definido, se asume activa)
          if (data.active !== false) {
            list.push({
              id: docSnap.id,
              name: data.name || "Sede sin nombre",
              city: data.city || "",
              address: data.address || "",
              schedule: data.schedule || "",
              phone: data.phone || "",
              active: data.active !== false,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            });
          }
        });

        // Ordenar alfabéticamente por ciudad y nombre
        list.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));

        onUpdate(list.length > 0 ? list : BRANCH_OFFICES);
      },
      (error) => {
        console.error("Error subscribing to sedes:", error);
        onUpdate(BRANCH_OFFICES);
      }
    );
  } catch (error) {
    console.error("Error setting up sedes subscription:", error);
    onUpdate(BRANCH_OFFICES);
    return () => {};
  }
}

/**
 * Obtener listado puntual de sedes activas
 */
export async function getActiveBranches(): Promise<BranchOffice[]> {
  if (!db) return BRANCH_OFFICES;

  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      return BRANCH_OFFICES;
    }

    const list: BranchOffice[] = [];
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.active !== false) {
        list.push({
          id: docSnap.id,
          name: data.name || "Sede sin nombre",
          city: data.city || "",
          address: data.address || "",
          schedule: data.schedule || "",
          phone: data.phone || "",
          active: data.active !== false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        });
      }
    });

    list.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
    return list.length > 0 ? list : BRANCH_OFFICES;
  } catch (error) {
    console.error("Error getting active sedes:", error);
    return BRANCH_OFFICES;
  }
}
