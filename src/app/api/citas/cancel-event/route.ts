import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

export const dynamic = "force-dynamic";
import { sendAppointmentCancellationEmail } from "@/src/services/email/appointmentEmailService";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      appointmentId,
      calendarEventId,
      code,
      clientName,
      email,
      serviceName,
      date,
      timeSlot,
      reason,
    } = body;

    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    let calendarDeleted = false;

    // 1. Eliminar evento de Google Calendar
    if (serviceAccountEmail && privateKey && calendarId) {
      try {
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

        // A. Si tenemos el calendarEventId directo
        if (calendarEventId) {
          try {
            await calendar.events.delete({
              calendarId,
              eventId: calendarEventId,
            });
            calendarDeleted = true;
            console.log(`[Google Calendar] Evento ${calendarEventId} eliminado exitosamente.`);
          } catch (delErr: any) {
            console.warn(`[Google Calendar] No se pudo borrar por ID directo:`, delErr?.message);
          }
        }

        // B. Si no se borró por ID (o no teníamos ID previo), buscar por código de radicado o nombre
        if (!calendarDeleted && (code || clientName)) {
          const searchQuery = code || clientName;
          const searchParams: any = {
            calendarId,
            q: searchQuery,
          };
          if (date) {
            searchParams.timeMin = `${date}T00:00:00-05:00`;
            searchParams.timeMax = `${date}T23:59:59-05:00`;
          }

          const searchRes = await calendar.events.list(searchParams);
          if (searchRes.data.items && searchRes.data.items.length > 0) {
            for (const item of searchRes.data.items) {
              if (item.id) {
                try {
                  await calendar.events.delete({
                    calendarId,
                    eventId: item.id,
                  });
                  calendarDeleted = true;
                  console.log(`[Google Calendar] Evento coincidente ${item.id} eliminado.`);
                } catch (subErr) {
                  console.warn("[Google Calendar] Error borrando evento encontrado:", subErr);
                }
              }
            }
          }
        }
      } catch (calErr: any) {
        console.error("[Google Calendar Deletion Error]:", calErr);
      }
    }

    // 2. Enviar correo de notificación de cancelación al cliente (si tiene email registrado)
    let emailSent = false;
    if (email && date && timeSlot) {
      try {
        const emailRes = await sendAppointmentCancellationEmail({
          clientName: clientName || "Cliente",
          email: email.trim(),
          serviceName: serviceName || "Asesoría",
          date,
          timeSlot,
          code: code || "CITA",
          reason,
        });
        emailSent = emailRes.success;
      } catch (mailErr) {
        console.warn("[Cancellation Email Error]:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      calendarDeleted,
      emailSent,
      message: "Cita procesada para cancelación y eliminada de Google Calendar.",
    });
  } catch (error: any) {
    console.error("[Cancel Event Route Error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Error al cancelar cita" },
      { status: 500 }
    );
  }
}
