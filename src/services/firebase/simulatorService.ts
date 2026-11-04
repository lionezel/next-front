import { doc, setDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/firebase/config";

export interface BankConfig {
  id: string;
  name: string;
  monthlyRatePct: number; // Ej: 1.35 para 1.35% M.V.
  active: boolean;
}

export interface SimulatorConfig {
  minAmount: number;
  maxAmount: number;
  defaultAmount: number;
  minMonths: number;
  maxMonths: number;
  defaultMonths: number;
  banks: BankConfig[];
  updatedAt?: unknown;
}

export const DEFAULT_SIMULATOR_CONFIG: SimulatorConfig = {
  minAmount: 1000000,
  maxAmount: 100000000,
  defaultAmount: 20000000,
  minMonths: 6,
  maxMonths: 72,
  defaultMonths: 24,
  banks: [
    { id: "bancolombia", name: "Bancolombia", monthlyRatePct: 1.35, active: true },
    { id: "banco_bogota", name: "Banco de Bogotá", monthlyRatePct: 1.28, active: true },
    { id: "davivienda", name: "Davivienda", monthlyRatePct: 1.30, active: true },
    { id: "bbva", name: "BBVA Colombia", monthlyRatePct: 1.40, active: true },
    { id: "itau", name: "Itaú", monthlyRatePct: 1.25, active: true },
    { id: "scotiabank", name: "Scotiabank Colpatria", monthlyRatePct: 1.38, active: true },
  ],
};

const CONFIG_COLLECTION = "config_general";
const CONFIG_DOC_ID = "simulador_credito";

/**
 * Suscribirse en tiempo real a la configuración del simulador y bancos
 */
export function subscribeSimulatorConfig(
  onUpdate: (config: SimulatorConfig) => void
): () => void {
  if (!db) {
    onUpdate(DEFAULT_SIMULATOR_CONFIG);
    return () => {};
  }

  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Partial<SimulatorConfig>;
        const merged: SimulatorConfig = {
          minAmount: data.minAmount || DEFAULT_SIMULATOR_CONFIG.minAmount,
          maxAmount: data.maxAmount || DEFAULT_SIMULATOR_CONFIG.maxAmount,
          defaultAmount: data.defaultAmount || DEFAULT_SIMULATOR_CONFIG.defaultAmount,
          minMonths: data.minMonths || DEFAULT_SIMULATOR_CONFIG.minMonths,
          maxMonths: data.maxMonths || DEFAULT_SIMULATOR_CONFIG.maxMonths,
          defaultMonths: data.defaultMonths || DEFAULT_SIMULATOR_CONFIG.defaultMonths,
          banks: data.banks && data.banks.length > 0 ? data.banks : DEFAULT_SIMULATOR_CONFIG.banks,
        };
        onUpdate(merged);
      } else {
        onUpdate(DEFAULT_SIMULATOR_CONFIG);
      }
    },
    (err) => {
      console.warn("Error subscribing to simulator config:", err);
      onUpdate(DEFAULT_SIMULATOR_CONFIG);
    }
  );
}

/**
 * Guardar la configuración del simulador y bancos en Firestore
 */
export async function saveSimulatorConfig(config: SimulatorConfig): Promise<void> {
  if (!db) throw new Error("Firestore no inicializado");
  const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
  await setDoc(
    docRef,
    {
      ...config,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Calcular Tasa Promedio Mensual (% M.V.) de los bancos activos
 */
export function getAverageMonthlyRatePct(banks: BankConfig[]): number {
  const activeBanks = (banks || []).filter((b) => b.active);
  if (activeBanks.length === 0) return 1.35;
  const sum = activeBanks.reduce((acc, b) => acc + (b.monthlyRatePct || 0), 0);
  return Number((sum / activeBanks.length).toFixed(3));
}

/**
 * Convertir % M.V. a % E.A.
 */
export function convertMvToEaPct(mvPct: number): number {
  const mv = mvPct / 100;
  const ea = Math.pow(1 + mv, 12) - 1;
  return Number((ea * 100).toFixed(1));
}

/**
 * Calcular cuota mensual fija (Amortización francesa)
 */
export function calculateMonthlyInstallment(
  amount: number,
  monthlyRatePct: number,
  months: number
): number {
  if (months <= 0) return 0;
  const i = monthlyRatePct / 100;
  if (i === 0) return Math.round(amount / months);
  const pmt = (amount * i) / (1 - Math.pow(1 + i, -months));
  return Math.round(pmt);
}
