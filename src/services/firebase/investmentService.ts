import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase/config";
import { InvestmentLead } from "@/src/types/investment";

const COLLECTION_NAME = "investment_leads";

export const submitInvestmentLead = async (data: Omit<InvestmentLead, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      status: data.status || "pendiente",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting investment lead:", error);
    throw error;
  }
};

export const getInvestmentLeads = async (): Promise<InvestmentLead[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as InvestmentLead[];
  } catch (error) {
    console.error("Error fetching investment leads:", error);
    return [];
  }
};
