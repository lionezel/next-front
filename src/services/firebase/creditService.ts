import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { CreditApplication } from "@/src/types/credit";

const COLLECTION_NAME = "credit_applications";

export const submitCreditApplication = async (data: Omit<CreditApplication, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      status: data.status || "pendiente",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting credit application:", error);
    throw error;
  }
};

export const getCreditApplications = async (): Promise<CreditApplication[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CreditApplication[];
  } catch (error) {
    console.error("Error fetching credit applications:", error);
    return [];
  }
};
