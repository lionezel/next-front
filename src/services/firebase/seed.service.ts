import { doc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/src/lib/firebase";
import { PRODUCTS, CATEGORIES } from "@/src/data/uniforms-data";
import { partners } from "@/src/features/home/services/partners-data";
import { projectsData } from "@/src/features/proyect/services/proyect-data";

/**
 * Función para sembrar Firestore con todos los datos iniciales
 * (Categorías, Productos, Aliados, Proyectos)
 */
export async function seedFirestoreDatabase(): Promise<{
  success: boolean;
  message: string;
  counts?: { products: number; categories: number; partners: number; projects: number };
}> {
  if (!isFirebaseConfigured() || !db) {
    return {
      success: false,
      message: "Firebase no está configurado. Por favor añade tus credenciales en .env.local",
    };
  }

  try {
    const batch = writeBatch(db);

    // 1. Sembrar Categorías
    CATEGORIES.forEach((cat, index) => {
      const ref = doc(db!, "categorias", cat.id);
      batch.set(ref, {
        ...cat,
        active: true,
        order: index,
        updatedAt: serverTimestamp(),
      });
    });

    // 2. Sembrar Productos
    PRODUCTS.forEach((prod, index) => {
      const ref = doc(db!, "productos", prod.id);
      batch.set(ref, {
        ...prod,
        active: true,
        order: index,
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        updatedAt: serverTimestamp(),
      });
    });

    // 3. Sembrar Aliados
    partners.forEach((partner, index) => {
      const ref = doc(db!, "aliados", partner.id);
      batch.set(ref, {
        id: partner.id,
        name: partner.name,
        logoUrl: `/logos/${partner.id}.png`,
        active: true,
        order: index,
        updatedAt: serverTimestamp(),
      });
    });

    // 4. Sembrar Proyectos
    projectsData.forEach((proj, index) => {
      const ref = doc(db!, "proyectos", proj.id);
      batch.set(ref, {
        ...proj,
        active: true,
        order: index,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();

    return {
      success: true,
      message: "Base de datos Firestore sembrada exitosamente con datos de Distripako.",
      counts: {
        categories: CATEGORIES.length,
        products: PRODUCTS.length,
        partners: partners.length,
        projects: projectsData.length,
      },
    };
  } catch (error: any) {
    console.error("Error sembrando Firestore:", error);
    return {
      success: false,
      message: `Error al sembrar Firestore: ${error?.message || error}`,
    };
  }
}
