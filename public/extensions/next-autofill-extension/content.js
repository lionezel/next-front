// Content Script para inyectar valores en formularios bancarios y Google Forms
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'AUTOFILL') {
    let raw = request.clientData;
    let data = {};

    try {
      data = typeof raw === 'object' ? raw : JSON.parse(raw);
    } catch(e) {
      const lines = String(raw).split('\n');
      lines.forEach(l => {
        if (l.includes('Nombre Completo:')) data.clientName = l.split(':')[1]?.trim();
        if (l.includes('Razón Social:')) data.companyName = l.split(':')[1]?.trim();
        if (l.includes('NIT:')) data.companyNit = l.split(':')[1]?.trim();
        if (l.includes('Número de Identificación:') || l.includes('Cédula:')) data.documentNumber = l.split(':')[1]?.trim();
        if (l.includes('Tipo de Documento:')) data.documentType = l.split(':')[1]?.trim();
        if (l.includes('Celular / WhatsApp:') || l.includes('Teléfono:')) data.phone = l.split(':')[1]?.trim();
        if (l.includes('Correo Electrónico:')) data.email = l.split(':')[1]?.trim();
        if (l.includes('Domicilio / Ciudad:')) data.city = l.split(':')[1]?.trim();
        if (l.includes('Dirección:')) data.address = l.split(':')[1]?.trim();
      });
    }

    const count = performFill(data);
    sendResponse({ count });
  }
  return true;
});

function norm(str) {
  if (!str) return '';
  return str.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ');
}

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
      if (!matched && el.options.length > 1) el.selectedIndex = 1;
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
    return false;
  }
}

function getContext(el) {
  let txt = norm(el.name + ' ' + el.id + ' ' + (el.placeholder || '') + ' ' + (el.getAttribute('aria-label') || '') + ' ' + (el.className || ''));
  
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

function performFill(data) {
  const nameParts = (data.clientName || '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const secondName = nameParts.length >= 3 ? nameParts[1] : '';
  const firstLastName = nameParts.length >= 3 ? nameParts[2] : (nameParts.length === 2 ? nameParts[1] : nameParts[0] || '');
  const secondLastName = nameParts.length >= 4 ? nameParts.slice(3).join(' ') : '';
  const fullLastName = nameParts.length >= 3 ? nameParts.slice(2).join(' ') : (nameParts.slice(1).join(' ') || nameParts[0] || '');

  const inputs = Array.from(document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=file]), select, textarea, [role="radio"]'));
  let filledCount = 0;

  inputs.forEach(el => {
    const ctx = getContext(el);

    if (ctx.match(/\b(primer.*apellido|1er.*apellido|apellido.*paterno)\b/)) {
      if (setVal(el, firstLastName)) { filledCount++; return; }
    }
    if (ctx.match(/\b(segundo.*apellido|2do.*apellido|apellido.*materno)\b/)) {
      if (setVal(el, secondLastName || firstLastName)) { filledCount++; return; }
    }
    if (ctx.match(/\b(primer.*nombre|1er.*nombre)\b/)) {
      if (setVal(el, firstName)) { filledCount++; return; }
    }
    if (ctx.match(/\b(segundo.*nombre|2do.*nombre)\b/)) {
      if (setVal(el, secondName || firstName)) { filledCount++; return; }
    }
    if (ctx.match(/\b(apellidos|last.*name)\b/) && !ctx.match(/\b(primer.*nombre)\b/)) {
      if (setVal(el, fullLastName)) { filledCount++; return; }
    }
    if (ctx.match(/\b(nombres|first.*name)\b/) && !ctx.match(/\b(apellido)\b/)) {
      if (setVal(el, firstName + (secondName ? ' ' + secondName : ''))) { filledCount++; return; }
    }
    if (ctx.match(/\b(cedula|documento|identificacion|num.*doc|no.*doc|cc)\b/) && !ctx.match(/\b(tipo|expedicion|lugar)\b/)) {
      if (setVal(el, data.documentNumber)) { filledCount++; return; }
    }
    if (ctx.match(/\b(celular|telefono|fijo|movil|tel|phone|whatsapp)\b/)) {
      if (setVal(el, data.phone)) { filledCount++; return; }
    }
    if (ctx.match(/\b(correo|email|mail)\b/)) {
      if (setVal(el, data.email)) { filledCount++; return; }
    }
    if (ctx.match(/\b(ciudad|municipio|residencia|domicilio)\b/) && !ctx.match(/\b(direccion)\b/)) {
      if (setVal(el, data.city || 'Medellín')) { filledCount++; return; }
    }
    if (ctx.match(/\b(direccion|residencia|domicilio|address)\b/) && !ctx.match(/\b(ciudad|correo)\b/)) {
      if (setVal(el, data.address || data.city)) { filledCount++; return; }
    }
    if (ctx.match(/\b(monto|valor.*solicitado|cuantia|credito|prestamo)\b/) && data.amount) {
      if (setVal(el, data.amount)) { filledCount++; return; }
    }
    if (ctx.match(/\b(plazo|meses|cuotas)\b/) && data.termMonths) {
      if (setVal(el, data.termMonths)) { filledCount++; return; }
    }
    if (ctx.match(/\b(empresa|razon|social|compania|juridica|negocio)\b/)) {
      if (setVal(el, data.companyName || data.clientName)) { filledCount++; return; }
    }
    if (ctx.match(/\b(nit|tributario)\b/)) {
      if (setVal(el, data.companyNit || data.documentNumber)) { filledCount++; return; }
    }
    if (ctx.match(/\b(tipo.*doc|tipo.*id|tipo.*identificacion)\b/)) {
      if (setVal(el, data.documentType || 'CC')) { filledCount++; return; }
    }
    if (ctx.match(/\b(nombre.*completo|nombre.*cliente|titular|solicitante)\b/)) {
      if (setVal(el, data.clientName)) { filledCount++; return; }
    }
    if (ctx.match(/\b(ingreso.*principal|ingresos|salario.*base|sueldo)\b/)) {
      if (setVal(el, data.amount ? String(data.amount) : "3500000")) { filledCount++; return; }
    }
    if (ctx.match(/\b(otros.*ingresos)\b/)) {
      if (setVal(el, "0")) { filledCount++; return; }
    }
    if (ctx.match(/\b(egresos|arriendo|gastos)\b/)) {
      if (setVal(el, "1200000")) { filledCount++; return; }
    }
    if (ctx.match(/\b(tipo.*contrato)\b/)) {
      if (setVal(el, "Indefinido")) { filledCount++; return; }
    }
    if (ctx.match(/\b(experiencia.*sector.*bancario|sector.*bancario)\b/)) {
      if (setVal(el, "Si")) { filledCount++; return; }
    }
    if (ctx.match(/\b(declara.*renta)\b/)) {
      if (setVal(el, "No")) { filledCount++; return; }
    }
  });

  return filledCount;
}

