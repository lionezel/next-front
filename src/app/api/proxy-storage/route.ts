import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return new NextResponse("URL de archivo requerida", { status: 400 });
    }

    // Node.js server realiza el fetch hacia Firebase Storage sin restricciones CORS del navegador
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return new NextResponse(`Error obteniendo archivo de Firebase: ${response.statusText}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "application/pdf";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err: any) {
    console.error("Error en proxy de almacenamiento:", err);
    return new NextResponse(`Error interno del proxy: ${err?.message || err}`, { status: 500 });
  }
}
