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
import { Product, Category } from "@/src/types/firebase";
import { PRODUCTS, CATEGORIES, ProductItem, CategoryItem } from "@/src/data/uniforms-data";

const PRODUCTS_COLLECTION = "productos";
const CATEGORIES_COLLECTION = "categorias";

// Fallbacks from uniforms-data
const defaultProducts: Product[] = PRODUCTS.map((p, idx) => ({
  ...p,
  active: true,
  order: idx,
  availableSizes: ["S", "M", "L", "XL", "XXL"],
}));

const defaultCategories: Category[] = CATEGORIES.map((c, idx) => ({
  ...c,
  active: true,
  order: idx,
}));

/**
 * Obtener todos los productos activos
 */
export async function getProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured() || !db) {
    return defaultProducts;
  }

  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("active", "==", true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return defaultProducts;
    }

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Product, "id">),
    }));
    return data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return defaultProducts;
  }
}

/**
 * Suscribirse a productos activos en tiempo real
 */
export function subscribeProducts(
  onUpdate: (products: Product[]) => void
): Unsubscribe | (() => void) {
  if (!isFirebaseConfigured() || !db) {
    onUpdate(defaultProducts);
    return () => {};
  }

  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where("active", "==", true)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(defaultProducts);
        } else {
          const data = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Product, "id">),
          }));
          data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          onUpdate(data);
        }
      },
      (error) => {
        console.error("Error subscribing to products:", error);
        onUpdate(defaultProducts);
      }
    );
  } catch (error) {
    console.error("Error setting up products subscription:", error);
    onUpdate(defaultProducts);
    return () => {};
  }
}

/**
 * Obtener categorías activas
 */
export async function getCategories(): Promise<Category[]> {
  if (!isFirebaseConfigured() || !db) {
    return defaultCategories;
  }

  try {
    const q = query(
      collection(db, CATEGORIES_COLLECTION),
      where("active", "==", true)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return defaultCategories;
    }

    const data = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Category, "id">),
    }));
    return data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  } catch (error) {
    console.error("Error fetching categories from Firestore:", error);
    return defaultCategories;
  }
}

/**
 * Suscribirse a categorías activas en tiempo real
 */
export function subscribeCategories(
  onUpdate: (categories: Category[]) => void
): Unsubscribe | (() => void) {
  if (!isFirebaseConfigured() || !db) {
    onUpdate(defaultCategories);
    return () => {};
  }

  try {
    const q = query(
      collection(db, CATEGORIES_COLLECTION),
      where("active", "==", true)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(defaultCategories);
        } else {
          const data = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Category, "id">),
          }));
          data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          onUpdate(data);
        }
      },
      (error) => {
        console.error("Error subscribing to categories:", error);
        onUpdate(defaultCategories);
      }
    );
  } catch (error) {
    console.error("Error setting up categories subscription:", error);
    onUpdate(defaultCategories);
    return () => {};
  }
}

/**
 * Guardar o actualizar producto
 */
export async function saveProduct(product: Partial<Product> & { id?: string }): Promise<string> {
  if (!db) throw new Error("Firestore no está inicializado");

  const productId = product.id || doc(collection(db, PRODUCTS_COLLECTION)).id;
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);

  await setDoc(
    docRef,
    {
      ...product,
      id: productId,
      active: product.active ?? true,
      order: product.order ?? 0,
      updatedAt: serverTimestamp(),
      ...(product.createdAt ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true }
  );

  return productId;
}

/**
 * Eliminar producto
 */
export async function deleteProduct(productId: string): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
}
