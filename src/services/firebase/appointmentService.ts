import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  limit,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/src/firebase/config";
import { Appointment, AppointmentStatus } from "@/src/types/appointment";
import { saveUserContactProfile } from "./userProfileService";

const COLLECTION_NAME = "citas";

/**
 * Generar un código único de cita, ej: CITA-2026-7391
 */
export function generateAppointmentCode(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `CITA-${new Date().getFullYear()}-${randomDigits}`;
}

export const OFFICIAL_GOOGLE_MEET_URL =
  process.env.NEXT_PUBLIC_DEFAULT_MEET_URL || "https://meet.google.com/dts-uwgw-akw";
export const OFFICIAL_GOOGLE_MEET_CODE = "dts-uwgw-akw";

/**
 * Generar o retornar el enlace oficial y activo de Google Meet
 */
export function generateGoogleMeetUrl(customCode?: string): { meetUrl: string; meetCode: string } {
  if (customCode) {
    return {
      meetCode: customCode,
      meetUrl: `https://meet.google.com/${customCode}`,
    };
  }
  return {
    meetCode: OFFICIAL_GOOGLE_MEET_CODE,
    meetUrl: OFFICIAL_GOOGLE_MEET_URL,
  };
}

/**
 * Generar enlace para añadir la cita directamente a Google Calendar
 */
export function generateGoogleCalendarUrl(appointment: {
  serviceName: string;
  date: string;
  timeSlot: string;
  modality: "presencial" | "virtual";
  branch?: string;
  meetUrl?: string;
  code?: string;
  clientName?: string;
}): string {
  const { serviceName, date, timeSlot, modality, branch, meetUrl, code, clientName } = appointment;

  // Extraer hora y minutos de timeSlot (ej: "09:00 AM", "03:30 PM")
  let startHour = 9;
  let startMinute = 0;
  if (timeSlot) {
    const match = timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
      let h = parseInt(match[1], 10);
      const m = parseInt(match[2], 10);
      const ampm = match[3].toUpperCase();
      if (ampm === "PM" && h < 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      startHour = h;
      startMinute = m;
    }
  }

  // Parsear fecha YYYY-MM-DD
  const dateClean = (date || new Date().toISOString().split("T")[0]).replace(/-/g, "");
  const pad = (n: number) => String(n).padStart(2, "0");

  const startTimeStr = `${dateClean}T${pad(startHour)}${pad(startMinute)}00`;
  // Duración estimada: 45 min
  let endHour = startHour;
  let endMinute = startMinute + 45;
  if (endMinute >= 60) {
    endHour += 1;
    endMinute -= 60;
  }
  const endTimeStr = `${dateClean}T${pad(endHour)}${pad(endMinute)}00`;

  const title = encodeURIComponent(`Cita Grupo Next - ${serviceName} (${code || "Confirmada"})`);
  const details = encodeURIComponent(
    `Cita Asignada con Asesor Financiero/Especialista.\n` +
      `Código de Cita: ${code || "N/A"}\n` +
      `Cliente: ${clientName || "Estimado Usuario"}\n` +
      `Modalidad: ${modality === "virtual" ? "Virtual por Google Meet" : `Presencial (${branch || ""})`}\n` +
      (meetUrl ? `\nEnlace de Google Meet: ${meetUrl}\n` : "") +
      `\nPor favor conectarse puntualmente.`
  );
  const location = encodeURIComponent(
    modality === "virtual" && meetUrl ? meetUrl : branch || "Sede Grupo Next"
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTimeStr}/${endTimeStr}&details=${details}&location=${location}`;
}

/**
 * Agendar una nueva cita (desde next-front)
 */
export async function createAppointment(
  data: Omit<Appointment, "id" | "status" | "createdAt" | "updatedAt">
): Promise<{ id: string; code: string; meetUrl?: string; meetCode?: string }> {
  if (!db) {
    throw new Error("Firestore no está inicializado");
  }

  const code = data.code || generateAppointmentCode();

  // Si la modalidad es virtual, determinar el enlace de videollamada activo
  let meetUrl = data.meetUrl;
  let meetCode = data.meetCode;
  if (data.modality === "virtual" && !meetUrl) {
    try {
      const confSnap = await getDoc(doc(db, "config_general", "videollamadas"));
      if (confSnap.exists() && confSnap.data().corporateMeetUrl) {
        const confUrl = confSnap.data().corporateMeetUrl.trim();
        if (confUrl) {
          meetUrl = confUrl;
          meetCode = confUrl.split("/").pop() || "";
        }
      }
    } catch (e) {
      console.warn("Could not fetch videollamadas config:", e);
    }

    if (!meetUrl) {
      const cleanCode = code.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      meetUrl = `https://meet.jit.si/GrupoNext-${cleanCode}`;
      meetCode = `GrupoNext-${cleanCode}`;
    }
  }

  const payload: any = {
    ...data,
    code,
    status: "pendiente" as AppointmentStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (meetUrl) {
    payload.meetUrl = meetUrl;
    payload.meetCode = meetCode;
  }

  // Remove any undefined fields to avoid Firestore serialization errors
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) {
      delete payload[key];
    }
  });

  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);

  // Automatically save user profile (documentNumber, phone, name) to Firestore user profile
  const targetUid = (data as any).userId || auth?.currentUser?.uid;
  if (targetUid) {
    saveUserContactProfile(targetUid, {
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      clientName: data.clientName,
      phone: data.phone,
      email: data.email,
    }).catch(console.error);
  } else if (data.email) {
    getDocs(query(collection(db, "users"), where("email", "==", data.email.trim().toLowerCase()), limit(1)))
      .then((snap) => {
        if (!snap.empty) {
          saveUserContactProfile(snap.docs[0].id, {
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            clientName: data.clientName,
            phone: data.phone,
            email: data.email,
          }).catch(console.error);
        }
      })
      .catch(console.error);
  }

  return { id: docRef.id, code, meetUrl, meetCode };
}

/**
 * Obtener los horarios que ya están ocupados para una fecha y modalidad específica
 */
export async function getOccupiedTimeSlots(
  date: string,
  modality: "presencial" | "virtual",
  branch?: string
): Promise<string[]> {
  if (!db) return [];

  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("date", "==", date),
      where("modality", "==", modality)
    );

    const snapshot = await getDocs(q);

    const occupiedSlots: string[] = [];
    snapshot.forEach((docSnap) => {
      const appt = docSnap.data() as Appointment;
      // Solo consideramos ocupadas las que están pendientes o aceptadas (no canceladas)
      if (appt.status !== "cancelada") {
        if (modality === "presencial") {
          // Si es presencial, solo bloquea si es en la misma sede
          if (!branch || appt.branch === branch) {
            occupiedSlots.push(appt.timeSlot);
          }
        } else {
          // Si es virtual
          occupiedSlots.push(appt.timeSlot);
        }
      }
    });

    return occupiedSlots;
  } catch (error) {
    console.error("Error checking occupied time slots:", error);
    return [];
  }
}

/**
 * Suscribirse a las citas en tiempo real (para el dashboard o seguimiento)
 */
export function subscribeAppointments(
  onUpdate: (appointments: Appointment[]) => void
): Unsubscribe | (() => void) {
  if (!db) {
    onUpdate([]);
    return () => {};
  }

  try {
    const colRef = collection(db, COLLECTION_NAME);

    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: Appointment[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Appointment, "id">),
        }));

        // Ordenar por fecha y hora
        list.sort((a, b) => {
          const dateCompare = (b.date || "").localeCompare(a.date || "");
          if (dateCompare !== 0) return dateCompare;
          return (a.timeSlot || "").localeCompare(b.timeSlot || "");
        });

        onUpdate(list);
      },
      (error) => {
        console.error("Error subscribing to appointments:", error);
      }
    );
  } catch (error) {
    console.error("Error setting up appointments subscription:", error);
    return () => {};
  }
}

/**
 * Actualizar el estado de una cita
 */
export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Actualizar o asignar un enlace de Google Meet a una cita
 */
export async function updateAppointmentMeetUrl(
  id: string,
  meetUrl: string,
  meetCode: string
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    meetUrl,
    meetCode,
    updatedAt: serverTimestamp(),
  });
}
