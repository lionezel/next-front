export interface AutoFillDocument {
  type: 'cedula' | 'rut' | 'camara_comercio' | 'estados_financieros' | 'cert_bancario' | 'otro';
  name: string;
  url: string;
}

export interface AutoFillClientData {
  clientName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  companyName?: string;
  companyNit?: string;
  city?: string;
  address?: string;
  amount?: number;
  termMonths?: number;
  code?: string;
  documents?: AutoFillDocument[];
}

/**
 * Genera el código JavaScript ejecutable como Bookmarklet para el navegador.
 * Puede arrastrarse a la barra de marcadores o ejecutarse en la consola / pestaña del banco.
 */
export function generateBankAutoFillBookmarklet(data: AutoFillClientData): string {
  // Serializar datos limpios
  const safeData = {
    clientName: (data.clientName || "").trim(),
    documentType: (data.documentType || "CC").trim(),
    documentNumber: (data.documentNumber || "").trim(),
    email: (data.email || "").trim(),
    phone: (data.phone || "").trim(),
    companyName: (data.companyName || data.clientName || "").trim(),
    companyNit: (data.companyNit || data.documentNumber || "").trim(),
    city: (data.city || "Medellín").trim(),
    address: (data.address || "").trim(),
    amount: data.amount ? String(data.amount) : "",
    termMonths: data.termMonths ? String(data.termMonths) : "",
    code: (data.code || "NEXT").trim(),
    documents: data.documents || [],
  };

  const codeString = `
(function() {
  const data = ${JSON.stringify(safeData)};
  
  // Normalizador de texto para búsquedas
  function norm(str) {
    if (!str) return '';
    return str.toString().toLowerCase()
      .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
      .replace(/[^a-z0-9]/g, ' ');
  }

  // Descomponer nombres y apellidos minuciosamente
  const nameParts = (data.clientName || '').trim().split(/\\s+/);
  const firstName = nameParts[0] || '';
  const secondName = nameParts.length >= 3 ? nameParts[1] : '';
  const firstLastName = nameParts.length >= 3 ? nameParts[2] : (nameParts.length === 2 ? nameParts[1] : nameParts[0] || '');
  const secondLastName = nameParts.length >= 4 ? nameParts.slice(3).join(' ') : '';
  const fullLastName = nameParts.length >= 3 ? nameParts.slice(2).join(' ') : (nameParts.slice(1).join(' ') || nameParts[0] || '');

  // Función para inyectar valor de texto / select / radio compatible con Google Forms, React, Vue, Angular
  function setVal(el, val) {
    if (!el || val === undefined || val === null || val === '') return false;
    try {
      if (el.getAttribute('role') === 'radio' || el.type === 'radio') {
        const parent = el.closest('[role="radiogroup"]') || el.closest('.ge4wEf') || el.parentElement;
        if (parent) {
          const options = Array.from(parent.querySelectorAll('[role="radio"], input[type="radio"], label, span'));
          const normVal = norm(val);
          for (let opt of options) {
            const txt = norm(opt.innerText || opt.textContent || opt.value || '');
            if (txt && (txt.includes(normVal) || normVal.includes(txt))) {
              opt.click();
              return true;
            }
          }
        }
        el.click();
        return true;
      }

      if (el.tagName === 'SELECT') {
        const normVal = norm(val);
        let matched = false;
        for (let i = 0; i < el.options.length; i++) {
          const optNorm = norm(el.options[i].text + ' ' + el.options[i].value);
          if (optNorm.includes(normVal) || normVal.includes(optNorm)) {
            el.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched && el.options.length > 1) {
          el.selectedIndex = 1;
        }
      } else {
        const proto = Object.getPrototypeOf(el);
        const set = Object.getOwnPropertyDescriptor(proto, 'value')?.set || Object.getOwnPropertyDescriptor(el, 'value')?.set;
        if (set) {
          set.call(el, val);
        } else {
          el.value = val;
        }
      }

      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));

      el.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
      el.style.borderColor = '#10b981';
      el.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.25)';
      setTimeout(() => { el.style.boxShadow = ''; }, 3000);

      return true;
    } catch(e) {
      console.warn('Error filling field:', e);
      return false;
    }
  }

  // Obtener contexto de texto de cada elemento (compatible con Google Forms y portales bancarios)
  function getContext(el) {
    let txt = norm(el.name + ' ' + el.id + ' ' + (el.placeholder || '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + (el.className || ''));
    
    // Google Forms aria-labelledby
    const ariaLabelledBy = el.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      ariaLabelledBy.split(' ').forEach(id => {
        const lbl = document.getElementById(id);
        if (lbl) txt += ' ' + norm(lbl.innerText || lbl.textContent);
      });
    }

    if (el.id) {
      const label = document.querySelector('label[for="' + el.id + '"]');
      if (label) txt += ' ' + norm(label.innerText || label.textContent);
    }
    
    // Inspeccionar contenedores padres (Google Forms preguntas, divs de tarjetas)
    let parent = el.parentElement;
    let depth = 0;
    while (parent && depth < 5) {
      const heading = parent.querySelector('[role="heading"], label, .exportLabel, .M7eFJf, .vfZBx, span, div');
      if (heading && heading.innerText) {
        txt += ' ' + norm(heading.innerText);
      }
      parent = parent.parentElement;
      depth++;
    }

    return txt;
  }

  // Adjuntar archivo descargado desde URL a un input de tipo file
  async function attachFileToInput(inputEl, fileUrl, fileName) {
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const file = new File([blob], fileName || 'documento.pdf', { type: blob.type || 'application/pdf' });
      
      const dt = new DataTransfer();
      dt.items.add(file);
      inputEl.files = dt.files;

      inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      inputEl.dispatchEvent(new Event('change', { bubbles: true }));

      inputEl.style.border = '2px solid #10b981';
      return true;
    } catch(err) {
      console.warn('No se pudo adjuntar automáticamente el documento:', fileName, err);
      return false;
    }
  }

  // 1. LLENAR CAMPOS DE TEXTO, SELECTS Y RADIOS
  const inputs = Array.from(document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=file]), select, textarea, [role="radio"]'));
  let filledCount = 0;
  const filledFields = [];

  inputs.forEach(el => {
    const ctx = getContext(el);

    // 1. Primer Apellido
    if (ctx.match(/\\b(primer.*apellido|1er.*apellido|apellido.*paterno)\\b/)) {
      if (setVal(el, firstLastName)) { filledCount++; filledFields.push('Primer Apellido'); return; }
    }
    // 2. Segundo Apellido
    if (ctx.match(/\\b(segundo.*apellido|2do.*apellido|apellido.*materno)\\b/)) {
      if (setVal(el, secondLastName || firstLastName)) { filledCount++; filledFields.push('Segundo Apellido'); return; }
    }
    // 3. Primer Nombre
    if (ctx.match(/\\b(primer.*nombre|1er.*nombre)\\b/)) {
      if (setVal(el, firstName)) { filledCount++; filledFields.push('Primer Nombre'); return; }
    }
    // 4. Segundo Nombre
    if (ctx.match(/\\b(segundo.*nombre|2do.*nombre)\\b/)) {
      if (setVal(el, secondName || firstName)) { filledCount++; filledFields.push('Segundo Nombre'); return; }
    }

    // Nombres / Apellidos generales
    if (ctx.match(/\\b(apellidos|last.*name)\\b/) && !ctx.match(/\\b(primer.*nombre)\\b/)) {
      if (setVal(el, fullLastName)) { filledCount++; filledFields.push('Apellidos'); return; }
    }
    if (ctx.match(/\\b(nombres|first.*name)\\b/) && !ctx.match(/\\b(apellido)\\b/)) {
      if (setVal(el, firstName + (secondName ? ' ' + secondName : ''))) { filledCount++; filledFields.push('Nombres'); return; }
    }

    // 5. Cédula / Documento
    if (ctx.match(/\\b(cedula|documento|identificacion|num.*doc|no.*doc|cc)\\b/) && !ctx.match(/\\b(tipo|expedicion|lugar)\\b/)) {
      if (setVal(el, data.documentNumber)) { filledCount++; filledFields.push('Cédula'); return; }
    }

    // 6. Celular / Teléfono
    if (ctx.match(/\\b(celular|telefono|fijo|movil|tel|phone|whatsapp)\\b/)) {
      if (setVal(el, data.phone)) { filledCount++; filledFields.push('Teléfono'); return; }
    }

    // 7. Correo / Email
    if (ctx.match(/\\b(correo|email|mail)\\b/)) {
      if (setVal(el, data.email)) { filledCount++; filledFields.push('Correo'); return; }
    }

    // 8. Ciudad de residencia
    if (ctx.match(/\\b(ciudad|municipio|residencia|domicilio)\\b/) && !ctx.match(/\\b(direccion)\\b/)) {
      if (setVal(el, data.city || 'Medellín')) { filledCount++; filledFields.push('Ciudad'); return; }
    }

    // 9. Dirección
    if (ctx.match(/\\b(direccion|residencia|domicilio|address)\\b/) && !ctx.match(/\\b(ciudad|correo)\\b/)) {
      if (setVal(el, data.address || data.city)) { filledCount++; filledFields.push('Dirección'); return; }
    }

    // 10. Monto Solicitado
    if (ctx.match(/\\b(monto|valor.*solicitado|cuantia|credito|prestamo)\\b/) && data.amount) {
      if (setVal(el, data.amount)) { filledCount++; filledFields.push('Monto'); return; }
    }

    // 11. Plazo
    if (ctx.match(/\\b(plazo|meses|cuotas)\\b/) && data.termMonths) {
      if (setVal(el, data.termMonths)) { filledCount++; filledFields.push('Plazo'); return; }
    }

    // 12. Razón Social / Empresa
    if (ctx.match(/\\b(empresa|razon|social|compania|juridica|negocio)\\b/)) {
      if (setVal(el, data.companyName)) { filledCount++; filledFields.push('Empresa'); return; }
    }

    // 13. NIT
    if (ctx.match(/\\b(nit|tributario)\\b/)) {
      if (setVal(el, data.companyNit)) { filledCount++; filledFields.push('NIT'); return; }
    }

    // 14. Tipo de Documento
    if (ctx.match(/\\b(tipo.*doc|tipo.*id|tipo.*identificacion)\\b/)) {
      if (setVal(el, data.documentType || 'CC')) { filledCount++; filledFields.push('Tipo Doc'); return; }
    }

    // 15. Nombre completo
    if (ctx.match(/\\b(nombre.*completo|nombre.*cliente|titular|solicitante)\\b/)) {
      if (setVal(el, data.clientName)) { filledCount++; filledFields.push('Nombre Completo'); return; }
    }

    // 16. Campos Financieros / Laborales (para Formularios bancarios y Google Forms)
    if (ctx.match(/\\b(ingreso.*principal|ingresos|salario.*base|sueldo)\\b/)) {
      if (setVal(el, data.amount ? String(data.amount) : "3500000")) { filledCount++; filledFields.push('Ingresos'); return; }
    }
    if (ctx.match(/\\b(otros.*ingresos)\\b/)) {
      if (setVal(el, "0")) { filledCount++; filledFields.push('Otros Ingresos'); return; }
    }
    if (ctx.match(/\\b(egresos|arriendo|gastos)\\b/)) {
      if (setVal(el, "1200000")) { filledCount++; filledFields.push('Egresos'); return; }
    }
    if (ctx.match(/\\b(tipo.*contrato)\\b/)) {
      if (setVal(el, "Indefinido")) { filledCount++; filledFields.push('Tipo Contrato'); return; }
    }
    if (ctx.match(/\\b(experiencia.*sector.*bancario|sector.*bancario)\\b/)) {
      if (setVal(el, "Si")) { filledCount++; filledFields.push('Exp. Bancaria'); return; }
    }
    if (ctx.match(/\\b(declara.*renta)\\b/)) {
      if (setVal(el, "No")) { filledCount++; filledFields.push('Declara Renta'); return; }
    }
  });

  // 2. DETECTAR Y ADJUNTAR ARCHIVOS/DOCUMENTOS DE FORMA ASÍNCRONA
  let attachedDocCount = 0;
  const attachedDocNames = [];

  const fileInputs = Array.from(document.querySelectorAll('input[type=file]'));
  if (fileInputs.length > 0 && data.documents && data.documents.length > 0) {
    fileInputs.forEach(async (fileInput) => {
      const ctx = getContext(fileInput);
      
      // Buscar el documento correspondiente en la lista de documentos del cliente
      const matchedDoc = data.documents.find(doc => {
        const docType = norm(doc.type);
        const docName = norm(doc.name);
        if (docType === 'cedula' && ctx.match(/\\b(cedula|documento|id|identificacion)\\b/)) return true;
        if (docType === 'rut' && ctx.match(/\\b(rut|tributario)\\b/)) return true;
        if (docType === 'camara_comercio' && ctx.match(/\\b(camara|comercio|existencia)\\b/)) return true;
        if (docType === 'estados_financieros' && ctx.match(/\\b(estado|financiero|balance|contable)\\b/)) return true;
        if (docType === 'cert_bancario' && ctx.match(/\\b(banco|bancari|certifica)\\b/)) return true;
        return ctx.includes(docName) || docName.includes(ctx);
      }) || data.documents[0]; // fallback al primer documento si hay solo un input file

      if (matchedDoc && matchedDoc.url) {
        const ok = await attachFileToInput(fileInput, matchedDoc.url, matchedDoc.name || 'documento.pdf');
        if (ok) {
          attachedDocCount++;
          attachedDocNames.push(matchedDoc.name || matchedDoc.type);
          updateBannerDocStatus();
        }
      }
    });
  }

  // 3. MOSTRAR BANNER FLOTANTE INTERACTIVO
  const oldBanner = document.getElementById('next-autofill-banner');
  if (oldBanner) oldBanner.remove();

  const banner = document.createElement('div');
  banner.id = 'next-autofill-banner';
  banner.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999999;background:#0f172a;color:#ffffff;border-radius:20px;padding:18px 22px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.4);font-family:system-ui,-apple-system,sans-serif;width:380px;max-width:92vw;border:1px solid #334155;animation:nextSlideIn 0.3s ease;';

  // Renderizar enlaces de descarga de documentos rápidos si los tiene
  let docButtonsHtml = '';
  if (data.documents && data.documents.length > 0) {
    docButtonsHtml = \`
      <div style="margin-top:12px;padding-top:10px;border-top:1px solid #334155;">
        <div style="font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:6px;display:flex;justify-content:space-between;">
          <span>📄 Documentos del Cliente (\${data.documents.length}):</span>
          <span style="color:#38bdf8;">Clic para descargar</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          \${data.documents.map(d => \`
            <a href="\${d.url}" target="_blank" download="\${d.name}" style="background:#1e293b;color:#e2e8f0;padding:4px 8px;border-radius:8px;font-size:10px;font-weight:600;text-decoration:none;border:1px solid #475569;display:inline-flex;align-items:center;gap:4px;" title="Haz clic para descargar">
              📥 \${d.name || d.type}
            </a>
          \`).join('')}
        </div>
      </div>
    \`;
  }

  function renderBannerContent() {
    banner.innerHTML = \`
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
        <div style="width:36px;height:36px;background:linear-gradient(135deg,#2563eb,#1d4ed8);border-radius:12px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#fff;box-shadow:0 4px 12px rgba(37,99,235,0.4);">⚡</div>
        <div style="flex:1;">
          <div style="font-weight:800;font-size:14px;color:#f8fafc;letter-spacing:-0.2px;">NEXT Financial Auto-Fill</div>
          <div style="font-size:11px;color:#94a3b8;">Radicado: <strong>\${data.code}</strong></div>
        </div>
        <button onclick="this.closest('#next-autofill-banner').remove()" style="background:none;border:none;color:#64748b;font-size:20px;cursor:pointer;line-height:1;">&times;</button>
      </div>
      <div style="font-size:12px;color:#cbd5e1;line-height:1.4;">
        \${filledCount > 0 
          ? '<span style="color:#10b981;font-weight:700;">¡' + filledCount + ' campos completados!</span> para <strong>' + data.clientName + '</strong>.'
          : '<span style="color:#f59e0b;font-weight:700;">No se detectaron campos nuevos</span> en esta pantalla.'}
        <span id="next-doc-status-text"></span>
      </div>
      \${filledCount > 0 ? '<div style="margin-top:6px;font-size:10px;color:#64748b;">Campos: ' + Array.from(new Set(filledFields)).join(', ') + '</div>' : ''}
      \${docButtonsHtml}
    \`;
  }

  function updateBannerDocStatus() {
    const el = document.getElementById('next-doc-status-text');
    if (el && attachedDocCount > 0) {
      el.innerHTML = '<br><span style="color:#38bdf8;font-weight:700;">📎 ' + attachedDocCount + ' documento(s) adjuntado(s) automáticamente</span> (' + attachedDocNames.join(', ') + ').';
    }
  }

  renderBannerContent();
  document.body.appendChild(banner);
  
  setTimeout(() => {
    if (banner && banner.parentNode) banner.remove();
  }, 12000);
})();
`;

  // Comprimir a formato Bookmarklet seguro
  const minified = codeString.replace(/\s+/g, " ").trim();
  return `javascript:${encodeURIComponent(minified)}`;
}

/**
 * Genera el código JavaScript puro sin codificar (para consola F12 o Extensiones).
 */
export function generateBankAutoFillRawScript(data: AutoFillClientData): string {
  const safeData = {
    clientName: (data.clientName || "").trim(),
    documentType: (data.documentType || "CC").trim(),
    documentNumber: (data.documentNumber || "").trim(),
    email: (data.email || "").trim(),
    phone: (data.phone || "").trim(),
    companyName: (data.companyName || data.clientName || "").trim(),
    companyNit: (data.companyNit || data.documentNumber || "").trim(),
    city: (data.city || "Medellín").trim(),
    address: (data.address || "").trim(),
    amount: data.amount ? String(data.amount) : "",
    termMonths: data.termMonths ? String(data.termMonths) : "",
    code: (data.code || "NEXT").trim(),
    documents: data.documents || [],
  };

  return `(function(){const data=${JSON.stringify(safeData)};function norm(s){return s?s.toString().toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]/g,' '):''}const nameParts=(data.clientName||'').trim().split(/\\s+/);const firstName=nameParts[0]||'';const secondName=nameParts.length>=3?nameParts[1]:'';const firstLastName=nameParts.length>=3?nameParts[2]:(nameParts.length===2?nameParts[1]:nameParts[0]||'');const secondLastName=nameParts.length>=4?nameParts.slice(3).join(' '):'';const fullLastName=nameParts.length>=3?nameParts.slice(2).join(' '):(nameParts.slice(1).join(' ')||nameParts[0]||'');function setVal(el,val){if(!el||val===undefined||val===null||val==='')return false;try{if(el.getAttribute('role')==='radio'||el.type==='radio'){const parent=el.closest('[role="radiogroup"]')||el.closest('.ge4wEf')||el.parentElement;if(parent){const options=Array.from(parent.querySelectorAll('[role="radio"], input[type="radio"], label, span'));const normVal=norm(val);for(let opt of options){const txt=norm(opt.innerText||opt.textContent||opt.value||'');if(txt&&(txt.includes(normVal)||normVal.includes(txt))){opt.click();return true;}}}el.click();return true;}if(el.tagName==='SELECT'){const normVal=norm(val);let matched=false;for(let i=0;i<el.options.length;i++){const optNorm=norm(el.options[i].text+' '+el.options[i].value);if(optNorm.includes(normVal)||normVal.includes(optNorm)){el.selectedIndex=i;matched=true;break;}}if(!matched&&el.options.length>1)el.selectedIndex=1;}else{const proto=Object.getPrototypeOf(el);const set=Object.getOwnPropertyDescriptor(proto,'value')?.set||Object.getOwnPropertyDescriptor(el,'value')?.set;if(set){set.call(el,val);}else{el.value=val;}}el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));el.dispatchEvent(new Event('blur',{bubbles:true}));el.style.borderColor='#10b981';return true;}catch(e){return false;}}function getContext(el){let txt=norm(el.name+' '+el.id+' '+(el.placeholder||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.className||''));const ariaLabelledBy=el.getAttribute('aria-labelledby');if(ariaLabelledBy){ariaLabelledBy.split(' ').forEach(id=>{const lbl=document.getElementById(id);if(lbl)txt+=' '+norm(lbl.innerText||lbl.textContent);});}if(el.id){const label=document.querySelector('label[for="'+el.id+'"]');if(label)txt+=' '+norm(label.innerText||label.textContent);}let parent=el.parentElement;let depth=0;while(parent&&depth<5){const heading=parent.querySelector('[role="heading"], label, .exportLabel, .M7eFJf, .vfZBx, span, div');if(heading&&heading.innerText){txt+=' '+norm(heading.innerText);}parent=parent.parentElement;depth++;}return txt;}const inputs=Array.from(document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=file]), select, textarea, [role="radio"]'));let filledCount=0;inputs.forEach(el=>{const ctx=getContext(el);if(ctx.match(/\\b(primer.*apellido|1er.*apellido|apellido.*paterno)\\b/)){if(setVal(el,firstLastName)){filledCount++;return;}}if(ctx.match(/\\b(segundo.*apellido|2do.*apellido|apellido.*materno)\\b/)){if(setVal(el,secondLastName||firstLastName)){filledCount++;return;}}if(ctx.match(/\\b(primer.*nombre|1er.*nombre)\\b/)){if(setVal(el,firstName)){filledCount++;return;}}if(ctx.match(/\\b(segundo.*nombre|2do.*nombre)\\b/)){if(setVal(el,secondName||firstName)){filledCount++;return;}}if(ctx.match(/\\b(apellidos|last.*name)\\b/)&&!ctx.match(/\\b(primer.*nombre)\\b/)){if(setVal(el,fullLastName)){filledCount++;return;}}if(ctx.match(/\\b(nombres|first.*name)\\b/)&&!ctx.match(/\\b(apellido)\\b/)){if(setVal(el,firstName+(secondName?' '+secondName:''))){filledCount++;return;}}if(ctx.match(/\\b(cedula|documento|identificacion|num.*doc|no.*doc|cc)\\b/)&&!ctx.match(/\\b(tipo|expedicion|lugar)\\b/)){if(setVal(el,data.documentNumber)){filledCount++;return;}}if(ctx.match(/\\b(celular|telefono|fijo|movil|tel|phone|whatsapp)\\b/)){if(setVal(el,data.phone)){filledCount++;return;}}if(ctx.match(/\\b(correo|email|mail)\\b/)){if(setVal(el,data.email)){filledCount++;return;}}if(ctx.match(/\\b(ciudad|municipio|residencia|domicilio)\\b/)&&!ctx.match(/\\b(direccion)\\b/)){if(setVal(el,data.city||'Medellín')){filledCount++;return;}}if(ctx.match(/\\b(direccion|residencia|domicilio|address)\\b/)&&!ctx.match(/\\b(ciudad|correo)\\b/)){if(setVal(el,data.address||data.city)){filledCount++;return;}}if(ctx.match(/\\b(monto|valor.*solicitado|cuantia|credito|prestamo)\\b/)&&data.amount){if(setVal(el,data.amount)){filledCount++;return;}}if(ctx.match(/\\b(plazo|meses|cuotas)\\b/)&&data.termMonths){if(setVal(el,data.termMonths)){filledCount++;return;}}if(ctx.match(/\\b(empresa|razon|social|compania|juridica|negocio)\\b/)){if(setVal(el,data.companyName||data.clientName)){filledCount++;return;}}if(ctx.match(/\\b(nit|tributario)\\b/)){if(setVal(el,data.companyNit||data.documentNumber)){filledCount++;return;}}if(ctx.match(/\\b(tipo.*doc|tipo.*id|tipo.*identificacion)\\b/)){if(setVal(el,data.documentType||'CC')){filledCount++;return;}}if(ctx.match(/\\b(nombre.*completo|nombre.*cliente|titular|solicitante)\\b/)){if(setVal(el,data.clientName)){filledCount++;return;}}if(ctx.match(/\\b(ingreso.*principal|ingresos|salario.*base|sueldo)\\b/)){if(setVal(el,data.amount?String(data.amount):"3500000")){filledCount++;return;}}if(ctx.match(/\\b(otros.*ingresos)\\b/)){if(setVal(el,"0")){filledCount++;return;}}if(ctx.match(/\\b(egresos|arriendo|gastos)\\b/)){if(setVal(el,"1200000")){filledCount++;return;}}if(ctx.match(/\\b(tipo.*contrato)\\b/)){if(setVal(el,"Indefinido")){filledCount++;return;}}if(ctx.match(/\\b(experiencia.*sector.*bancario|sector.*bancario)\\b/)){if(setVal(el,"Si")){filledCount++;return;}}if(ctx.match(/\\b(declara.*renta)\\b/)){if(setVal(el,"No")){filledCount++;return;}}});const fileInputs=Array.from(document.querySelectorAll('input[type=file]'));let attachedCount=0;if(fileInputs.length>0&&data.documents&&data.documents.length>0){fileInputs.forEach(async(fileInput)=>{const ctx=getContext(fileInput);const matchedDoc=data.documents.find(doc=>{const docType=norm(doc.type);const docName=norm(doc.name);if(docType==='cedula'&&ctx.match(/\\b(cedula|documento|id|identificacion)\\b/))return true;if(docType==='rut'&&ctx.match(/\\b(rut|tributario)\\b/))return true;if(docType==='camara_comercio'&&ctx.match(/\\b(camara|comercio|existencia)\\b/))return true;if(docType==='estados_financieros'&&ctx.match(/\\b(estado|financiero|balance|contable)\\b/))return true;if(docType==='cert_bancario'&&ctx.match(/\\b(banco|bancari|certifica)\\b/))return true;return ctx.includes(docName)||docName.includes(ctx);})||data.documents[0];if(matchedDoc&&matchedDoc.url){try{const res=await fetch(matchedDoc.url);const blob=await res.blob();const file=new File([blob],matchedDoc.name||'documento.pdf',{type:blob.type||'application/pdf'});const dt=new DataTransfer();dt.items.add(file);fileInput.files=dt.files;fileInput.dispatchEvent(new Event('input',{bubbles:true}));fileInput.dispatchEvent(new Event('change',{bubbles:true}));fileInput.style.border='2px solid #10b981';attachedCount++;}catch(e){}}});}alert('⚡ ¡'+filledCount+' campos completados'+(attachedCount>0?' y '+attachedCount+' documentos adjuntados':'')+' con éxito!');})();`;
}

/**
 * Genera un texto consolidado estructurado para copiar y pegar en 1 solo clic.
 */
export function generateConsolidatedDataSheet(data: AutoFillClientData): string {
  const docsText = data.documents && data.documents.length > 0
    ? data.documents.map(d => `- ${d.name} (${d.type}): ${d.url}`).join("\n")
    : "Sin documentos adjuntos";

  return `FICHA DE RADICACIÓN BANCARIA — GRUPO NEXT
Radicado: ${data.code || "S/D"}
------------------------------------------------
DATOS DEL CLIENTE / REPRESENTANTE LEGAL:
- Nombre Completo: ${data.clientName}
- Tipo de Documento: ${data.documentType || "CC"}
- Número de Identificación: ${data.documentNumber}
- Celular / WhatsApp: ${data.phone}
- Correo Electrónico: ${data.email}

DATOS DE LA EMPRESA:
- Razón Social: ${data.companyName || data.clientName}
- NIT: ${data.companyNit || data.documentNumber}
- Domicilio / Ciudad: ${data.city || "Medellín"}
- Dirección: ${data.address || "No especificada"}

CONDICIONES DE LA SOLICITUD:
- Monto Solicitado: $${(data.amount || 0).toLocaleString("es-CO")} COP
- Plazo Estimado: ${data.termMonths || 36} Meses

DOCUMENTOS DISPONIBLES:
${docsText}
------------------------------------------------
Generado automáticamente por NEXT CONNECTION GROUP SAS`;
}


