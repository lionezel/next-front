import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { GeneralLead } from "@/src/types/common";

const COLLECTION_NAME = "ecosystem_leads";

export const submitGeneralLead = async (data: Omit<GeneralLead, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      status: data.status || "pendiente",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting general lead:", error);
    throw error;
  }
};

export const getGeneralLeads = async (): Promise<GeneralLead[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GeneralLead[];
  } catch (error) {
    console.error("Error fetching general leads:", error);
    return [];
  }
};
