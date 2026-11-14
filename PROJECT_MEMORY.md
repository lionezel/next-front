# 🧠 Memoria y Contexto del Proyecto: NEXT-FRONT

> **Para desarrolladores y asistentes de Inteligencia Artificial (Antigravity, Cursor, Claude Code, Copilot):**  
> Este documento contiene el contexto integral, decisiones de diseño, reglas de negocio y arquitectura de `next-front`. Al clonar este repositorio, léelo detenidamente para mantener la continuidad perfecta del proyecto.

---

## 1. 🏢 Ecosistema y Visión de Negocio

**NEXT Connection Group 360°** es una plataforma financiera y de blindaje integral de activos.  
- **Slogan / Propuesta de Valor Central:**  
  *"Somos expertos en planificación financiera, blindaje y protección de tu patrimonio."*
- **Enfoque de Marca:** Estilo corporativo de banca privada / wealth management, diseño limpio, elegante, sin saturación innecesaria de colores ni cajas pesadas.

### División de Repositorios del Ecosistema:
1. **`next-front` (Este Repositorio):**
   - Aplicación pública para clientes y usuarios finales.
   - Landing interactiva, banner principal con avatar 3D de asesoría patrimonial.
   - Simuladores y solicitudes de soluciones financieras.
   - Portal del cliente (`/portal`, `/portal/login`, `/portal/credito`, `/portal/perfil`).
2. **`next-admin` (Repositorio Hermano):**
   - Panel de administración para el equipo operativo, asesores y analistas de crédito.
   - Gestión de expedientes de estudio de crédito, documentos contables/tributarios, datos de contacto directo con contadores (WhatsApp), y seguimiento de clientes persona natural y jurídica.

---

## 2. 🏛️ Los 3 Servicios Principales (Tríada Central)

En la página principal (`ModernAppHome.tsx`), la sección **Servicios Principales** está sintetizada en **exactamente tres pilares simétricos**, habiéndose eliminado categorías secundarias para lograr un aspecto limpio y equilibrado:

1. **Finanzas:**
   - **Etiqueta Superior:** `Tasas competitivas del mercado`
   - **Enfoque:** Créditos para personas naturales y jurídicas con las mejores tasas: compra de cartera, capital de trabajo, cupos rotativos, créditos de vehículo, hipotecarios, confirming y factoring.
   - **Elemento 3D:** `<Finance3DVault />` (tarjetas y chip isométrico en SVG claymorphism).
   - **Acción:** Abre el modal/flujo de crédito y estructuración financiera (`handleServiceClick("credito")`).

2. **Seguros:**
   - **Etiqueta Superior:** `Ahorro hasta un 50% en pólizas actuales`
   - **Enfoque:** Especialistas en pólizas de salud, jubilación, educativas, pólizas de socios, pólizas de vehículos y blindaje empresarial integral.
   - **Elemento 3D:** `<Insurance3DShield />` (escudo 3D de protección patrimonial).
   - **Acción:** Abre el modal/flujo de seguros (`handleServiceClick("seguros")`).

3. **Inversiones:**
   - **Etiqueta Superior:** `Rentabilidades anuales según el fondo`
   - **Enfoque:** Portafolios de alta rentabilidad, rendimiento fiduciario respaldado y estrategias de crecimiento de capital.
   - **Elemento 3D:** `<Investment3DGrowth />` (gráfico de barras 3D y flecha de rendimiento).
   - **Acción:** Abre el modal/flujo de inversiones (`handleServiceClick("inversiones")`).

---

## 3. 🎨 Identidad Visual y UI System

- **Paleta de Colores:** Azul corporativo NEXT (`sky-500`, `sky-600`, `blue-700`, `slate-900`, fondos `white` y `slate-50`).
- **Acentos Luminosos:** Cyan/Sky brillante (`text-sky-200`) para titulares destacados sobre fondos oscuros.
- **Iconografía:**
  - Iconos generales: `lucide-react`.
  - Iconos de impacto 3D: Creados en SVG puro de alta resolución con efectos claymorphism e iluminación suave en [`src/components/common/Icons3D.tsx`](src/components/common/Icons3D.tsx).
- **Banner del Avatar 3D:**
  - Situado en el Hero de `ModernAppHome.tsx`.
  - Muestra un avatar 3D flotante con badges de confianza: *"Asesora VIP • Blindaje Patrimonial"* y *"Blindaje Patrimonial"*.

---

## 4. 💻 Pila Tecnológica (Tech Stack)

- **Framework:** [Next.js](https://nextjs.org/) versión 16.1.6 con **Turbopack** y **App Router**.
- **Lenguaje:** TypeScript (`strict: true`).
- **Estilos:** Tailwind CSS con utilidades de gradiente y desenfoque de cristal (`backdrop-blur`).
- **Despliegue e Infraestructura:**
  - **Firebase Hosting:** Proyecto `next-ffca0`.
  - **Firebase Functions (SSR / API):** Node.js 24 (2nd Gen).
  - **URL Producción:** [https://next-ffca0.web.app](https://next-ffca0.web.app)

---

## 5. 📂 Estructura del Código

```text
next-front/
├── PROJECT_MEMORY.md                     <-- Este archivo de memoria y contexto
├── firebase.json / .firebaserc           <-- Configuración de Firebase Hosting
├── package.json                          <-- Dependencias y scripts
├── public/                               <-- Activos estáticos, imágenes, avatares
└── src/
    ├── app/                              <-- Rutas de App Router (/, /portal, /credito, etc.)
    ├── components/
    │   └── common/
    │       ├── Icons3D.tsx               <-- SVGs 3D Claymorphism (Vault, Shield, Growth)
    │       └── VerticalInfoModal.tsx     <-- Modal de detalle para cada vertical
    ├── features/
    │   └── hub/
    │       └── ModernAppHome.tsx         <-- Home principal (Hero, Avatar 3D, Servicios)
    └── types/
        └── common.ts                     <-- VerticalKey ('credito' | 'inversiones' | 'seguros' | 'fit')
```

---

## 6. 🚀 Comandos de Trabajo

### Levantar en Desarrollo:
```bash
pnpm dev
# ó
npm run dev
```
La aplicación correrá en `http://localhost:3000`.

### Validar Compilación:
```bash
npm run build
```
*Siempre debe compilar limpiamente con Turbopack antes de subir cambios.*

### Repositorios Git (Doble Remoto):
El proyecto cuenta con dos repositorios remotos que deben mantenerse sincronizados:
1. **GitHub (`origin`):** `https://github.com/lionezel/next-front.git`
2. **Azure DevOps (`azure`):** `https://dev.azure.com/Prioritech/Colores%20De%20Vida%2013/_git/distripako-front`

Para enviar cambios a ambos:
```bash
git push origin main
git push azure main
```

### Despliegue a Firebase Hosting:
```bash
npx firebase-tools deploy --only hosting
```

---

## 7. 🔑 Variables de Entorno (`.env.local`)
Este archivo contiene las credenciales de Firebase y APIs. Dado que **NO se sube a Git por seguridad**, debe ser transferido de forma privada y segura al nuevo desarrollador y ubicarse en la raíz del proyecto como `.env.local`.

---

## 8. 🤖 Instrucciones para Asistentes de IA
- Mantener siempre el tono corporativo, profesional y elegante.
- Respetar la tríada de servicios (Finanzas, Seguros, Inversiones) y la paleta de colores.
- No saturar las pantallas con cajas o contadores innecesarios; priorizar la legibilidad y la experiencia del usuario.
- Redactar siempre en español neutral para el mercado colombiano/latinoamericano.
