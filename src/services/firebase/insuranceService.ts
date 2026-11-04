import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { InsuranceQuote } from "@/src/types/insurance";

const COLLECTION_NAME = "insurance_quotes";

export const submitInsuranceQuote = async (data: Omit<InsuranceQuote, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      status: data.status || "pendiente",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting insurance quote:", error);
    throw error;
  }
};

export const getInsuranceQuotes = async (): Promise<InsuranceQuote[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as InsuranceQuote[];
  } catch (error) {
    console.error("Error fetching insurance quotes:", error);
    return [];
  }
};
