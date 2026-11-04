import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { FitOrder, FitProduct } from "@/src/types/fit";

const ORDERS_COLLECTION = "fit_orders";
const PRODUCTS_COLLECTION = "fit_products";

export const submitFitOrder = async (data: Omit<FitOrder, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
      ...data,
      status: data.status || "pendiente",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting fit order:", error);
    throw error;
  }
};

export const getFitProductsFromDB = async (): Promise<FitProduct[]> => {
  try {
    const q = query(collection(db, PRODUCTS_COLLECTION));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return [];
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as FitProduct[];
  } catch (error) {
    console.error("Error fetching fit products:", error);
    return [];
  }
};
