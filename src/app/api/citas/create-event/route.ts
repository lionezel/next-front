import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { sendAppointmentInvitationEmail } from "@/src/services/email/appointmentEmailService";

// Helper to construct ISO strings with Colombia offset (UTC-5)
function buildDateTimeISO(dateStr: string, timeStr: string, durationMinutes = 45) {
  const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  let hours = 9;
  let minutes = 0;
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toUpperCase();
    if (meridiem === "PM" && hours < 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
  }

  const parts = dateStr.split("-").map(Number);
  const year = parts[0] || new Date().getFullYear();
  const month = parts[1] || 1;
  const day = parts[2] || 1;

  const pad = (n: number) => String(n).padStart(2, "0");
  const startISO = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:00-05:00`;

  // Calculate end time
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  const endISO = `${year}-${pad(month)}-${pad(day)}T${pad(endHours)}:${pad(endMinutes)}:00-05:00`;

  return { startISO, endISO };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientName, email, phone, serviceName, date, timeSlot, notes, meetUrl, code } = body;

    if (!clientName || !email || !date || !timeSlot) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (clientName, email, date, timeSlot)" },
        { status: 400 }
      );
    }

    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    // Si aún no se han configurado las credenciales en .env.local, devolvemos aviso graceful
    if (!serviceAccountEmail || !privateKey || !calendarId) {
      console.warn(
        "[Google Calendar API] Credenciales pendientes en .env.local (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID)."
      );
      return NextResponse.json({
        success: false,
        configured: false,
        message: "Google Calendar API no está configurada aún en el servidor.",
      });
    }

    const { startISO, endISO } = buildDateTimeISO(date, timeSlot, 45);

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey,
      },
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events",
      ],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const defaultOfficialMeetUrl = process.env.NEXT_PUBLIC_DEFAULT_MEET_URL || "https://meet.google.com/dts-uwgw-akw";
    const effectiveMeetUrl = meetUrl || defaultOfficialMeetUrl;

    const event = {
      summary: `Asesoría VIP: ${serviceName} - ${clientName}`,
      location: effectiveMeetUrl,
      description: `Reunión de asesoría personalizada con ${clientName}.\n\n` +
        `• Enlace Google Meet: ${effectiveMeetUrl}\n` +
        `• Servicio: ${serviceName}\n` +
        `• Cliente: ${clientName}\n` +
        `• Teléfono: ${phone || "No especificado"}\n` +
        `• Correo: ${email}\n` +
        `• Dudas / Notas: ${notes || "Ninguna"}\n\n` +
        `Generado automáticamente desde la plataforma.`,
      start: {
        dateTime: startISO,
        timeZone: "America/Bogota",
      },
      end: {
        dateTime: endISO,
        timeZone: "America/Bogota",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 }, // 1 día antes
          { method: "email", minutes: 60 },      // 1 hora antes
          { method: "popup", minutes: 15 },      // 15 min antes
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });

    // 2. Enviar invitación oficial por correo al cliente con el archivo .ics de Google Calendar
    const emailResult = await sendAppointmentInvitationEmail({
      clientName,
      email: email.trim(),
      serviceName,
      date,
      timeSlot,
      meetUrl: effectiveMeetUrl,
      code: code || `CITA-${Date.now().toString().slice(-4)}`,
      notes,
    });

    return NextResponse.json({
      success: true,
      configured: true,
      eventId: response.data.id,
      meetUrl: effectiveMeetUrl,
      htmlLink: response.data.htmlLink,
      emailSent: emailResult.success,
    });
  } catch (error: any) {
    console.error("[Google Calendar API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Error al crear evento en Google Calendar",
        details: error?.response?.data || null,
      },
      { status: 500 }
    );
  }
}
