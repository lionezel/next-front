import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase/config";

const CONFIG_COLLECTION = "config_general";
const CALENDLY_DOC_ID = "calendly_config";

/**
 * Suscribirse en tiempo real a la URL de Calendly configurada desde next-admin
 */
export function subscribeCalendlyConfig(onUpdate: (url: string) => void): () => void {
  if (!db) {
    onUpdate("");
    return () => {};
  }

  const docRef = doc(db, CONFIG_COLLECTION, CALENDLY_DOC_ID);
  const unsub = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onUpdate(data.url || "");
      } else {
        onUpdate("");
      }
    },
    (err) => {
      console.error("Error subscribing to Calendly config:", err);
      onUpdate("");
    }
  );

  return unsub;
}
