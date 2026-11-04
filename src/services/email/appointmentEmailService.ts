import nodemailer from "nodemailer";

interface AppointmentEmailParams {
  clientName: string;
  email: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "08:00 AM" or "02:30 PM"
  meetUrl: string;
  code: string;
  notes?: string;
}

// Convert local date and timeSlot to UTC iCalendar format (YYYYMMDDTHHmmssZ)
function formatUtcIcsDate(dateStr: string, timeStr: string, durationMinutes = 45) {
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

  // Colombia is UTC-5, so UTC hours = local hours + 5
  const startUtc = new Date(Date.UTC(year, month - 1, day, hours + 5, minutes, 0));
  const endUtc = new Date(startUtc.getTime() + durationMinutes * 60 * 1000);

  const format = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return {
    startUtcStr: format(startUtc),
    endUtcStr: format(endUtc),
  };
}

export async function sendAppointmentInvitationEmail(params: AppointmentEmailParams) {
  const { clientName, email, serviceName, date, timeSlot, meetUrl, code, notes } = params;

  const senderUser = process.env.GMAIL_USER || process.env.SMTP_USER || "miguel.barrera.205m@gmail.com";
  const appPassword = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (!appPassword) {
    console.warn(
      "[Email Service] GMAIL_APP_PASSWORD o SMTP_PASS no configurado en .env.local. Saltando envío de correo."
    );
    return { success: false, reason: "email_credentials_missing" };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderUser,
      pass: appPassword.replace(/\s+/g, ""), // Eliminar espacios si vienen con formato "abcd efgh ijkl mnop"
    },
  });

  const { startUtcStr, endUtcStr } = formatUtcIcsDate(date, timeSlot, 45);

  const icsContent = [
    "BEGIN:VCALENDAR",
    "PRODID:-//FinTech Ecosystem//Citas VIP//ES",
    "VERSION:2.0",
    "METHOD:REQUEST",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:cita-${code}-${Date.now()}@ecosistema.com`,
    `DTSTAMP:${startUtcStr}`,
    `DTSTART:${startUtcStr}`,
    `DTEND:${endUtcStr}`,
    `SUMMARY:Asesoría VIP: ${serviceName}`,
    `DESCRIPTION:Hola ${clientName},\\n\\nTu cita de asesoría está confirmada.\\n\\n• Especialidad: ${serviceName}\\n• Sala Google Meet: ${meetUrl}\\n• Radicado: ${code}\\n• Notas: ${notes || "Ninguna"}\\n\\n¡Te esperamos puntual!`,
    `LOCATION:${meetUrl}`,
    `ORGANIZER;CN="Asesoría Especializada":mailto:${senderUser}`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;RSVP=TRUE;CN="${clientName}":mailto:${email}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Recordatorio de Asesoría VIP",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 28px 24px; }
        .ticket { background: #f1f5f9; border-radius: 16px; padding: 20px; margin: 20px 0; border: 1px solid #cbd5e1; }
        .ticket-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .ticket-row:last-child { margin-bottom: 0; }
        .label { color: #64748b; font-weight: 600; }
        .value { color: #0f172a; font-weight: 800; }
        .btn { display: inline-block; background: #0284c7; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 28px; border-radius: 12px; text-align: center; margin-top: 15px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>¡Tu Cita está Confirmada!</h1>
          <p>Hemos reservado tu espacio de asesoría personalizada</p>
        </div>
        <div class="content">
          <p>Hola <strong>${clientName}</strong>,</p>
          <p>Se ha generado tu cita con éxito. Esta invitación incluye el evento para tu <strong>Google Calendar</strong>.</p>
          
          <div class="ticket">
            <div class="ticket-row"><span class="label">Código Radicado:</span><span class="value">${code}</span></div>
            <div class="ticket-row"><span class="label">Especialidad:</span><span class="value">${serviceName}</span></div>
            <div class="ticket-row"><span class="label">Fecha:</span><span class="value">${date}</span></div>
            <div class="ticket-row"><span class="label">Hora:</span><span class="value">${timeSlot}</span></div>
          </div>

          <div style="text-align: center; margin: 25px 0;">
            <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Acceso a la videollamada:</p>
            <a href="${meetUrl}" class="btn" target="_blank">Entrar a la Sala de Google Meet</a>
            <p style="font-size: 12px; color: #0284c7; margin-top: 8px; word-break: break-all;">${meetUrl}</p>
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            💡 <em>Nota: Si usas Gmail o Google Calendar en tu celular, este evento ya se ha sugerido/agregado a tu agenda automáticamente.</em>
          </p>
        </div>
        <div class="footer">
          Mensaje automático generado por el Centro de Agendamiento.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Asesoría Especializada" <${senderUser}>`,
      to: email,
      subject: `🗓️ Confirmación de Cita: ${serviceName} - ${date} ${timeSlot}`,
      text: `Hola ${clientName},\n\nTu cita para ${serviceName} está confirmada para el ${date} a las ${timeSlot}.\n\nSala de Google Meet: ${meetUrl}\nRadicado: ${code}`,
      html: htmlContent,
      icalEvent: {
        filename: "cita-google-calendar.ics",
        method: "REQUEST",
        content: icsContent,
      },
    });

    console.log("[Email Service] Correo e invitación enviados a:", email, "MessageId:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("[Email Service Error]:", err);
    return { success: false, error: err?.message || err };
  }
}

export async function sendAppointmentCancellationEmail(params: {
  clientName: string;
  email: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  code: string;
  reason?: string;
}) {
  const { clientName, email, serviceName, date, timeSlot, code, reason } = params;

  const senderUser = process.env.GMAIL_USER || process.env.SMTP_USER || "miguel.barrera.205m@gmail.com";
  const appPassword = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (!appPassword) return { success: false, reason: "email_credentials_missing" };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: senderUser,
      pass: appPassword.replace(/\s+/g, ""),
    },
  });

  const { startUtcStr, endUtcStr } = formatUtcIcsDate(date, timeSlot, 45);

  const icsCancel = [
    "BEGIN:VCALENDAR",
    "PRODID:-//FinTech Ecosystem//Citas VIP//ES",
    "VERSION:2.0",
    "METHOD:CANCEL",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:cita-${code}@ecosistema.com`,
    `DTSTAMP:${startUtcStr}`,
    `DTSTART:${startUtcStr}`,
    `DTEND:${endUtcStr}`,
    `SUMMARY:Cancelada: Asesoría VIP ${serviceName}`,
    `DESCRIPTION:Hola ${clientName}, tu cita con código ${code} ha sido cancelada.`,
    `ORGANIZER;CN="Asesoría Especializada":mailto:${senderUser}`,
    `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=DECLINED;CN="${clientName}":mailto:${email}`,
    "STATUS:CANCELLED",
    "SEQUENCE:1",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); color: #ffffff; padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .header p { margin: 6px 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 28px 24px; }
        .ticket { background: #fef2f2; border-radius: 16px; padding: 20px; margin: 20px 0; border: 1px solid #fecaca; }
        .ticket-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; }
        .ticket-row:last-child { margin-bottom: 0; }
        .label { color: #991b1b; font-weight: 600; }
        .value { color: #7f1d1d; font-weight: 800; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>Cita Cancelada</h1>
          <p>Tu cita ha sido cancelada y removida de la agenda</p>
        </div>
        <div class="content">
          <p>Hola <strong>${clientName}</strong>,</p>
          <p>Te confirmamos que la siguiente cita ha sido cancelada exitosamente y eliminada de Google Calendar:</p>
          
          <div class="ticket">
            <div class="ticket-row"><span class="label">Código Radicado:</span><span class="value">${code}</span></div>
            <div class="ticket-row"><span class="label">Especialidad:</span><span class="value">${serviceName}</span></div>
            <div class="ticket-row"><span class="label">Fecha:</span><span class="value">${date}</span></div>
            <div class="ticket-row"><span class="label">Hora:</span><span class="value">${timeSlot}</span></div>
            ${reason ? `<div class="ticket-row"><span class="label">Motivo:</span><span class="value">${reason}</span></div>` : ""}
          </div>

          <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
            El espacio ha sido liberado. Si deseas agendar una nueva cita en otro horario, puedes hacerlo cuando gustes ingresando a nuestra plataforma.
          </p>
        </div>
        <div class="footer">
          Mensaje automático generado por el Centro de Agendamiento.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Asesoría Especializada" <${senderUser}>`,
      to: email,
      subject: `❌ Cita Cancelada: ${serviceName} - ${date} ${timeSlot}`,
      text: `Hola ${clientName},\n\nTu cita con radicado ${code} para el ${date} a las ${timeSlot} ha sido cancelada y eliminada de Google Calendar.`,
      html: htmlContent,
      icalEvent: {
        filename: "cancelacion-cita.ics",
        method: "CANCEL",
        content: icsCancel,
      },
    });

    console.log("[Email Service] Notificación de cancelación enviada a:", email);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("[Email Cancellation Error]:", err);
    return { success: false, error: err?.message || err };
  }
}
