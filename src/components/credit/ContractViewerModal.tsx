"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  FileText,
  X,
  Printer,
  CheckCircle2,
  PenTool,
  RotateCcw,
  ShieldCheck,
  Building,
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Download,
} from "lucide-react";
import { CreditCase, CreditContractData } from "@/src/types/credit";
import { saveCreditContractSignature } from "@/src/services/firebase/creditCasesService";
import { auth } from "@/src/firebase/config";
import {
  getUserContactProfile,
  saveUserContactProfile,
} from "@/src/services/firebase/userProfileService";

interface ContractViewerModalProps {
  creditCase: CreditCase;
  isOpen: boolean;
  onClose: () => void;
  onContractSigned?: () => void;
  readOnly?: boolean;
}

export default function ContractViewerModal({
  creditCase,
  isOpen,
  onClose,
  onContractSigned,
  readOnly = false,
}: ContractViewerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signingMode, setSigningMode] = useState<"canvas" | "electronic">("canvas");
  const [typedSignature, setTypedSignature] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable / auto-completed contract fields
  const [companyName, setCompanyName] = useState(
    creditCase.companyName || creditCase.contract?.companyName || ""
  );
  const [companyNit, setCompanyNit] = useState(
    creditCase.companyNit || creditCase.contract?.companyNit || ""
  );
  const [repLegalName, setRepLegalName] = useState(
    creditCase.clientName || creditCase.contract?.repLegalName || ""
  );
  const [repLegalDoc, setRepLegalDoc] = useState(
    creditCase.documentNumber || creditCase.contract?.repLegalDoc || ""
  );
  const [city, setCity] = useState(
    creditCase.city || creditCase.contract?.city || "Medellín"
  );
  const [address, setAddress] = useState(
    creditCase.address || creditCase.contract?.address || ""
  );
  const [phone, setPhone] = useState(
    creditCase.phone || creditCase.contract?.phone || ""
  );
  const [email, setEmail] = useState(
    creditCase.email || creditCase.contract?.email || ""
  );

  // Auto-fill from Firestore User Profile whenever modal opens
  useEffect(() => {
    if (!isOpen) return;

    const initialName = creditCase.clientName || creditCase.contract?.repLegalName || "";
    const initialDoc =
      creditCase.documentNumber && creditCase.documentNumber !== "No asignado"
        ? creditCase.documentNumber
        : creditCase.contract?.repLegalDoc || "";
    const initialPhone = creditCase.phone || creditCase.contract?.phone || "";
    const initialEmail = creditCase.email || creditCase.contract?.email || "";
    const initialCompName = creditCase.companyName || creditCase.contract?.companyName || "";
    const initialCompNit = creditCase.companyNit || creditCase.contract?.companyNit || "";
    const initialCity = creditCase.city || creditCase.contract?.city || "Medellín";
    const initialAddress = creditCase.address || creditCase.contract?.address || "";

    setCompanyName(initialCompName);
    setCompanyNit(initialCompNit);
    setRepLegalName(initialName);
    setRepLegalDoc(initialDoc);
    setCity(initialCity);
    setAddress(initialAddress);
    setPhone(initialPhone);
    setEmail(initialEmail);

    // Fetch user profile from Firestore to auto-complete missing fields
    const targetUid = creditCase.userId || auth?.currentUser?.uid;
    if (targetUid) {
      getUserContactProfile(targetUid)
        .then((profile) => {
          if (!profile) return;
          if (profile.clientName) setRepLegalName((prev) => prev || profile.clientName || "");
          if (profile.documentNumber) setRepLegalDoc((prev) => (prev && prev !== "No asignado") ? prev : profile.documentNumber || "");
          if (profile.phone) setPhone((prev) => prev || profile.phone || "");
          if (profile.email) setEmail((prev) => prev || profile.email || "");
          if (profile.city) setCity((prev) => (!prev || prev === "Medellín") ? (profile.city || "Medellín") : prev);
          if (profile.address) setAddress((prev) => prev || profile.address || "");
          if (profile.companyName) setCompanyName((prev) => prev || profile.companyName || "");
          if (profile.companyNit) setCompanyNit((prev) => prev || profile.companyNit || "");
        })
        .catch(console.error);
    }
  }, [isOpen, creditCase]);

  // Commissions
  const successFeePct = creditCase.contract?.successFeePct || 8;
  const successFeeValue =
    creditCase.contract?.successFeeValue ||
    Math.round((creditCase.amount || 0) * (successFeePct / 100));
  const preApprovedFeePct = creditCase.contract?.preApprovedFeePct || 4;
  const preApprovedFeeValue =
    creditCase.contract?.preApprovedFeeValue ||
    Math.round((creditCase.amount || 0) * (preApprovedFeePct / 100));
  const virtualViabilityPct = creditCase.contract?.virtualViabilityPct || 2;
  const virtualViabilityValue =
    creditCase.contract?.virtualViabilityValue ||
    Math.round((creditCase.amount || 0) * (virtualViabilityPct / 100));

  const isAlreadySigned = !!creditCase.contract?.signed;

  // Date calculation
  const today = new Date();
  const day = creditCase.contract?.signedDateDay || String(today.getDate()).padStart(2, "0");
  const monthNames = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const month = creditCase.contract?.signedDateMonth || monthNames[today.getMonth()];
  const year = creditCase.contract?.signedDateYear || "2026";

  // Canvas drawing handlers
  useEffect(() => {
    if (!isOpen || isAlreadySigned || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [isOpen, isAlreadySigned, readOnly]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleSignContract = async () => {
    if (!creditCase.id) return;
    let signatureUrl = "";

    if (signingMode === "canvas") {
      if (!hasDrawn) {
        alert("Por favor dibuja tu firma en el recuadro antes de confirmar.");
        return;
      }
      const canvas = canvasRef.current;
      if (canvas) signatureUrl = canvas.toDataURL("image/png");
    } else {
      if (!typedSignature.trim()) {
        alert("Por favor escribe tu nombre completo para formalizar la firma.");
        return;
      }
      // Create virtual electronic signature badge
      const c = document.createElement("canvas");
      c.width = 400;
      c.height = 100;
      const ctx = c.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 400, 100);
        ctx.fillStyle = "#1e3a8a";
        ctx.font = "italic 26px 'Brush Script MT', cursive, serif";
        ctx.fillText(typedSignature.trim(), 20, 60);
        signatureUrl = c.toDataURL("image/png");
      }
    }

    if (!repLegalDoc.trim() || !phone.trim() || repLegalDoc.trim() === "No asignado") {
      alert("⚠️ ATENCIÓN: La Cédula de Ciudadanía y el Teléfono son datos obligatorios para firmar el contrato. Por favor complétalos en los campos superiores.");
      return;
    }

    setIsSaving(true);
    try {
      const finalCompName = companyName.trim() || creditCase.companyName || "N/A";
      const finalCompNit = companyNit.trim() || creditCase.companyNit || "N/A";
      const finalName = repLegalName.trim() || creditCase.clientName || auth?.currentUser?.displayName || "Cliente";
      const finalDoc = repLegalDoc.trim() || creditCase.documentNumber || "";
      const finalCity = city.trim() || "Medellín";
      const finalAddress = address.trim() || "";
      const finalPhone = phone.trim() || creditCase.phone || "";
      const finalEmail = email.trim() || creditCase.email || auth?.currentUser?.email || "";

      await saveCreditContractSignature(creditCase.id, {
        companyName: finalCompName,
        companyNit: finalCompNit,
        repLegalName: finalName,
        repLegalDoc: finalDoc,
        city: finalCity,
        address: finalAddress,
        phone: finalPhone,
        email: finalEmail,
        signatureDataUrl: signatureUrl,
        signatureType: signingMode,
        successFeePct,
        successFeeValue,
        preApprovedFeePct,
        preApprovedFeeValue,
        virtualViabilityPct,
        virtualViabilityValue,
      });

      // Synchronize updated user profile data into Firestore (root fields + contactProfile)
      const targetUid = creditCase.userId || auth?.currentUser?.uid;
      if (targetUid) {
        await saveUserContactProfile(targetUid, {
          documentType: "CC",
          documentNumber: finalDoc,
          clientName: finalName,
          phone: finalPhone,
          email: finalEmail,
          city: finalCity,
          address: finalAddress,
          companyName: finalCompName,
          companyNit: finalCompNit,
        });
      }

      setSaveSuccess(true);
      if (onContractSigned) onContractSigned();
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error signing contract:", err);
      alert("Ocurrió un error al registrar la firma. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <style>{`
        @media print {
          @page {
            margin: 12mm 15mm;
            size: auto;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
          }
          body * {
            visibility: hidden !important;
          }
          #front-contract-print-area, #front-contract-print-area * {
            visibility: visible !important;
          }
          #front-contract-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
        }
      `}</style>
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none">
        {/* Modal Top Bar (Hidden during printing) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between gap-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Contrato de Prestación de Servicios - Gestión Comercial Financiera
              </h3>
              <p className="text-xs text-slate-400">
                NEXT CONNECTION GROUP SAS • NIT 901500993-2 • Radicado: {creditCase.code}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Imprimir o Guardar como PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: The Contract Document */}
        <div id="front-contract-print-area" className="p-6 sm:p-12 max-h-[75vh] overflow-y-auto space-y-6 text-slate-800 font-serif leading-relaxed text-sm print:max-h-none print:p-8 print:text-black print:overflow-visible">
          {/* Document Header with Official NEXT Logo */}
          <div className="flex flex-col items-center justify-center pb-6 border-b border-slate-200">
            <img
              src="/logo.png"
              alt="NEXT Connection Group Logo"
              className="h-28 sm:h-32 max-w-[280px] w-auto object-contain mb-3"
            />
            <div className="text-[11px] tracking-widest uppercase font-sans font-bold text-slate-600 mt-1">
              NEXT CONNECTION GROUP SAS • NIT 901500993-2
            </div>

            <h1 className="text-center font-sans font-black text-lg sm:text-xl text-slate-900 mt-4 uppercase tracking-wide">
              CONTRATO DE PRESTACIÓN DE SERVICIOS
              <br />
              <span className="text-blue-900">GESTIÓN COMERCIAL FINANCIERA</span>
            </h1>
          </div>

          {/* Parties Introduction */}
          <p className="text-justify leading-relaxed">
            Entre, <strong>DIANA PATRICIA DUQUE CAMPILLO</strong>, mayor de edad, e identificada con cédula de ciudadanía <strong>Nº 43.593.567</strong>, en calidad de representante legal de <strong>NEXT CONNECTION GROUP SAS</strong> NIT <strong>901500993-2</strong>, con domicilio en la ciudad de <strong>Medellín</strong>, y{" "}
            <span className="font-bold underline text-blue-950">
              {repLegalName || "________________________"}
            </span>
            , mayor de edad, e identificado (a) con cédula de ciudadanía <strong>Nº {repLegalDoc || "____________"}</strong>, actuando en nombre propio y en calidad de representante legal de{" "}
            <span className="font-bold underline text-blue-950">
              {companyName || "________________________"}
            </span>{" "}
            NIT{" "}
            <span className="font-bold underline text-blue-950">
              {companyNit || "____________"}
            </span>
            , con domicilio principal en la ciudad de{" "}
            <span className="font-bold underline text-blue-950">
              {city || "Medellín"}
            </span>
            , quien en adelante se denomina <strong>EL CLIENTE</strong>, acordamos celebrar el presente contrato de prestación de servicios para la <strong>GESTIÓN COMERCIAL FINANCIERA</strong>, con fundamento en las siguientes:
          </p>

          <h3 className="font-sans font-bold text-center text-sm uppercase tracking-widest text-slate-900 py-1">
            CLÁUSULAS
          </h3>

          {/* Cláusula Primera */}
          <p className="text-justify">
            <strong>PRIMERA: OBJETO DE CONTRATO:</strong> En virtud del presente contrato <strong>NEXT CONNECTION GROUP SAS</strong>, se compromete con el <strong>CLIENTE</strong>, a realizar las gestiones ante las entidades financieras, vigiladas por la Superintendencia Financiera o quien haga sus veces, para la aprobación y desembolsos de productos financieros tales como crédito de libre inversión, cupos de crédito rotativo, Tarjetas de Crédito, cupos de Factoring, cupos de Confirming, entre otros.
          </p>

          {/* Cláusula Segunda */}
          <div className="text-justify space-y-2">
            <p>
              <strong>SEGUNDA: HONORARIOS:</strong> El <strong>CLIENTE</strong>, se obliga y compromete a cancelar a la <strong>INTERMEDIARIO FINANCIERO</strong>, los siguientes valores:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>
                La Comisión por estudio de crédito, incluye: consulta y perfilamiento de cliente en Datacrédito, verificación de documentos, y análisis financiero, para estudio de crédito con las diferentes entidades financieras, bancarias o cooperativas, y aseguradoras, tendrá un costo de <strong>$ 250.000 mil pesos</strong>, una vez el crédito sea APROBADO, DESEMBOLSADO Y SEA PAGADA LA COMISION, por parte del cliente, estos son reembolsables por parte de <strong>NEXT CONNECTION GROUP SAS</strong>. <strong>Cuenta Corriente # 29899994884 BANCOLOMBIA, NIT 901500993</strong>.
              </li>
              <li>
                Comisión de éxito del <strong>{successFeePct}%</strong> sobre el valor del crédito, incluye crédito de libre inversión, cupos de crédito rotativo, Tarjetas de Crédito, cupos de Factoring, cupos de Confirming, entre otros que sean aprobados y/o desembolsados, que equivale al valor estimado de <strong>${successFeeValue.toLocaleString("es-CO")} COP</strong>.
              </li>
              <li>
                Comisión del <strong>{preApprovedFeePct}%</strong> sobre el crédito PRE APROBADO O APROBADO, pero que por cualquier razón ajena a la voluntad de <strong>NEXT CONNECTION GROUP SAS</strong>, el <strong>CLIENTE</strong> no lo quiso TOMAR, y después de haber hecho el proceso con <strong>NEXT CONNECTION GROUP SAS</strong>, lo tramite en alguna oficina diferente de la entidad que aprobó la operación de crédito o lo tomo después de tres meses, esta comisión se genera, que equivale al valor de <strong>${preApprovedFeeValue.toLocaleString("es-CO")} COP</strong>.
              </li>
              <li>
                Comisión del <strong>{virtualViabilityPct}%</strong> por viabilidades virtuales, que equivale al valor de <strong>${virtualViabilityValue.toLocaleString("es-CO")} COP</strong>.
              </li>
            </ol>
          </div>

          {/* Cláusula Tercera */}
          <p className="text-justify">
            <strong>TERCERA. – FORMA DE PAGO:</strong> EL <strong>CLIENTE</strong>, deberá cancelar dentro de los 3 días calendario siguientes el valor de la comisión de acuerdo con lo estipulado en la cláusula segunda de este contrato, a la <strong>cuenta corriente N° 29899994884 Bancolombia</strong>.
          </p>

          {/* Cláusula Cuarta */}
          <p className="text-justify">
            <strong>CUARTA. - NATURALEZA DEL CONTRATO:</strong> Se trata de un contrato de intermediación, en donde <strong>NEXT CONNECTION GROUP SAS</strong>, bajo su experticia y conocimiento, pone en contacto al <strong>CLIENTE</strong>, con la entidad financiera, para la gestión y trámite del producto financiero solicitado y según su perfil se tramitará por las diferentes entidades con las que se tiene relación comercial a favor del <strong>CLIENTE</strong>. Por lo tanto, el no cumplimiento de las obligaciones contractuales, o las discrepancias entre la entidad financiera y el <strong>CLIENTE</strong>, será del resorte exclusivo de estas dos partes, por lo que <strong>NEXT CONNECTION GROUP SAS</strong>, se mantendrá indemne ante estas situaciones.
          </p>

          {/* Cláusula Quinta */}
          <p className="text-justify">
            <strong>QUINTA. - OBLIGACIONES:</strong> Las partes establecen que el presente contrato es de medio y no de resultados, por lo que <strong>NEXT CONNECTION GROUP SAS</strong>, deberá poner al servicio del <strong>CLIENTE</strong>, toda la idoneidad, experticia y responsabilidad, para lograr obtener el resultado. Y este a su vez deberá dar a conocer al <strong>NEXT CONNECTION GROUP SAS</strong>, toda la información necesaria para la aprobación del producto financiero y pagar las comisiones de acuerdo con lo estipulado en la cláusula segunda.
          </p>

          {/* Cláusula Sexta */}
          <p className="text-justify">
            <strong>SEXTA. - REPRESENTANTES DE NEXT CONNECTION GROUP SAS:</strong> El <strong>CLIENTE</strong>, conoce y acepta que <strong>NEXT CONNECTION GROUP SAS</strong>, podrá tener representantes que actúen a su nombre, sin embargo, el pago de los honorarios establecidos en la cláusula segunda de este contrato deberá ser cancelado directamente a <strong>NEXT CONNECTION GROUP SAS</strong>, y no a la cuenta de ningún representante de NEXT CONNECTION GROUP SAS. En caso de que el <strong>CLIENTE</strong>, consigne, deposite o pague a favor de un tercero, las comisiones estipuladas en este contrato, sin contar con la autorización expresa de <strong>NEXT CONNECTION GROUP SAS</strong>, dicho pago se tendrá como no realizado y el <strong>CLIENTE</strong> deberá volver a realizar el pago.
          </p>

          {/* Cláusula Séptima */}
          <p className="text-justify">
            <strong>SÉPTIMA. - PLAZO DE EJECUCIÓN:</strong> Este contrato se realiza por tiempo indefinido. No requiere preaviso para su terminación, sin embargo, en el evento que el <strong>CLIENTE</strong>, decida dar por terminado el contrato, dentro de las gestiones que realice el <strong>NEXT CONNECTION GROUP SAS</strong>, este deberá cancelar las comisiones estipuladas.
          </p>

          {/* Cláusula Octava */}
          <div className="text-justify space-y-1">
            <p>
              <strong>OCTAVA: REPORTES:</strong> El cliente autoriza, acepta y conoce que, en caso de mora en el cumplimiento de su obligación:
            </p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Será reportado a las centrales de riesgo que tenga contratada la empresa <strong>NEXT CONNECTION GROUP SAS</strong>.</li>
              <li>Se iniciarán los procesos judiciales respectivos y se procederá a solicitar medidas cautelares correspondientes, tales como embargos y secuestros de bienes y cuentas bancarias.</li>
            </ol>
          </div>

          {/* Cláusula Novena */}
          <p className="text-justify">
            <strong>NOVENA:</strong> El cliente autoriza que la empresa <strong>NEXT CONNECTION GROUP SAS</strong>, pueda llenar los espacios en blanco, en lo que hace referencia al valor del crédito aprobado y/o desembolsado, el cual deberá estar acompañado del certificado de aprobación del crédito.
          </p>

          {/* Cláusula Décima */}
          <p className="text-justify">
            <strong>DÉCIMA:</strong> El presente contrato presta mérito ejecutivo, y las partes renuncian desde ya a cualquier requerimiento judicial o extrajudicial para la constitución en mora.
          </p>

          {/* Agreement Confirmation */}
          <p className="text-justify">
            Las partes manifiestan haber leído la totalidad del contenido del presente contrato, a fin de verificar la exactitud de todos los datos en él consignados, y/o aclarar, modificar, corregir, adicionar o suprimir sus cláusulas; por lo tanto, cualquier imprecisión o inexactitud en el mismo, es completa responsabilidad de las partes.
          </p>

          {/* Subscription Date */}
          <p className="text-justify font-semibold">
            De conformidad con lo anterior las partes suscriben el presente documento en dos ejemplares en el mismo tenor y valor, a los <u>&nbsp;&nbsp;{day}&nbsp;&nbsp;</u> días del mes de <u>&nbsp;&nbsp;{month}&nbsp;&nbsp;</u> de <strong>{year}</strong>.
          </p>

          {/* Signatures Section */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans">
            {/* NEXT Connection Group Legal Signature */}
            <div className="space-y-3">
              <div className="h-20 flex items-end">
                <div className="font-serif italic text-blue-900 font-bold text-lg border-b-2 border-slate-800 pb-1 w-full max-w-[260px]">
                  Diana Patricia Duque C.
                </div>
              </div>
              <div className="text-xs space-y-0.5">
                <strong className="block text-slate-900 text-sm">DIANA PATRICIA DUQUE CAMPILLO</strong>
                <span className="block text-slate-600">Representante Legal</span>
                <span className="block font-bold text-blue-900">NEXT CONNECTION GROUP SAS</span>
                <span className="block text-slate-500 font-mono text-[11px]">NIT 901500993-2</span>
              </div>
            </div>

            {/* Client Signature */}
            <div className="space-y-3">
              <div className="h-20 flex items-end">
                {isAlreadySigned || creditCase.contract?.signatureDataUrl ? (
                  <div className="border-b-2 border-slate-800 pb-1 w-full max-w-[260px]">
                    <img
                      src={creditCase.contract?.signatureDataUrl}
                      alt="Firma del Cliente"
                      className="h-16 object-contain"
                    />
                  </div>
                ) : (
                  <div className="border-b-2 border-dashed border-slate-400 pb-1 w-full max-w-[260px] text-xs text-slate-400 italic">
                    [Firma digital pendiente de formalizar]
                  </div>
                )}
              </div>

              <div className="text-xs space-y-1">
                <div>
                  <strong className="text-slate-900 block text-sm">EL CLIENTE: {repLegalName || "_________________"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">CÉDULA:</span>{" "}
                  <span className="font-mono">{repLegalDoc || "_________________"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">EMPRESA:</span>{" "}
                  <span>{companyName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">NIT:</span>{" "}
                  <span className="font-mono">{companyNit || "N/A"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">CEL:</span>{" "}
                  <span>{phone || "_________________"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">DIRECCIÓN:</span>{" "}
                  <span>{address || "Medellín, Colombia"}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-bold">MAIL:</span>{" "}
                  <span>{email || "_________________"}</span>
                </div>

                {isAlreadySigned && (
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Suscrito electrónicamente el {day} de {month} de {year}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Digital Signature Pad (Displayed only if not signed yet and not read-only) */}
          {!isAlreadySigned && !readOnly && (
            <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200 font-sans print:hidden space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    Formalización de Firma Digital del Cliente
                  </h4>
                </div>

                <div className="inline-flex rounded-lg bg-slate-200 p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSigningMode("canvas")}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      signingMode === "canvas"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Trazar Firma
                  </button>
                  <button
                    type="button"
                    onClick={() => setSigningMode("electronic")}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      signingMode === "electronic"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Firma Electrónica
                  </button>
                </div>
              </div>

              {/* Company & Client editable metadata to complete contract (Auto-completed) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-1">
                  <span>⚡ Datos autocompletados desde tu perfil (puedes verificar o editar si es necesario):</span>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Auto-Fill Activo
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white rounded-xl border border-slate-200 text-xs">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Nombre Cliente / Rep. Legal *</label>
                    <input
                      type="text"
                      value={repLegalName}
                      onChange={(e) => setRepLegalName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-blue-600 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Cédula de Ciudadanía *</label>
                    <input
                      type="text"
                      value={repLegalDoc}
                      onChange={(e) => setRepLegalDoc(e.target.value)}
                      placeholder="Ej: 1020304050"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-blue-600 font-mono bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Teléfono / Celular *</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 3001234567"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-blue-600 font-mono bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@correo.com"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-blue-600 bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Razón Social Empresa</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ej: Inversiones ABC SAS (Opcional)"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">NIT Empresa</label>
                    <input
                      type="text"
                      value={companyNit}
                      onChange={(e) => setCompanyNit(e.target.value)}
                      placeholder="Ej: 900.123.456-1"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-blue-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Ciudad Principal *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ej: Medellín / Bogotá"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Dirección Residencial</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ej: Calle 10 # 40-20"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-blue-600"
                    />
                  </div>
                </div>
              </div>

              {signingMode === "canvas" ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Dibuja tu firma a continuación con el cursor o tu dedo en pantalla táctil:
                  </p>
                  <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-white overflow-hidden touch-none h-36">
                    <canvas
                      ref={canvasRef}
                      width={650}
                      height={144}
                      className="w-full h-full cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                    {!hasDrawn && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400 font-sans">
                        ✍️ Traza tu firma aquí
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold inline-flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Limpiar y volver a firmar
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Escribe tu nombre y apellidos completos para estampar la firma electrónica legal:
                  </p>
                  <input
                    type="text"
                    value={typedSignature}
                    onChange={(e) => setTypedSignature(e.target.value)}
                    placeholder="Nombre completo del representante legal..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-serif italic text-lg text-blue-900 bg-white"
                  />
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>¡Contrato firmado y registrado exitosamente en el expediente!</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cerrar sin Firmar
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSignContract}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSaving ? "Guardando..." : "Firmar Contrato Oficial"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer (Hidden on print) */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden text-xs">
          <div className="text-slate-500">
            Documento vinculante según Ley 527 de 1999 de comercio electrónico y firma digital.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
