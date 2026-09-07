"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

export type GarmentType = "chaqueta" | "chaleco" | "overol" | "camisa";
export type LogoPosition = "pecho" | "espalda" | "manga" | "ninguno";

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  position: [number, number, number];
}

export const HOTSPOTS_DATA: Hotspot[] = [
  {
    id: "reflectivo",
    title: "Cintas Reflectivas 3M™",
    description: "Visibilidad 360° en condiciones de baja luz. Grado industrial resistente a lavados.",
    position: [0, 0.45, 0.48],
  },
  {
    id: "tela",
    title: "Drill Vulcano / Antifluido",
    description: "Tejido de alta densidad (240g/m²) con tratamiento antirasgado y protección UV.",
    position: [0.32, 0.1, 0.38],
  },
  {
    id: "bordado",
    title: "Bordado / Estampado HD",
    description: "Zona frontal y dorsal para bordado computarizado o estampado termofijado de tu marca.",
    position: [-0.22, 0.65, 0.45],
  },
  {
    id: "costuras",
    title: "Costuras Triples Reforzadas",
    description: "Pespuntes de seguridad con hilo de alta tenacidad en puntos de mayor tensión.",
    position: [0.55, 0.7, 0.1],
  },
];

interface UniformCanvas3DProps {
  garmentType: GarmentType;
  primaryColor: string;
  secondaryColor?: string;
  nightMode: boolean;
  reflectiveTape: boolean;
  logoPosition: LogoPosition;
  logoText: string;
  logoImage?: string | null;
  autoRotate: boolean;
  activeHotspot: string | null;
  onHotspotClick?: (id: string) => void;
  onRequestCapture?: (captureFn: () => string) => void;
}

// Safe rounded rectangle on canvas
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

export default function UniformCanvas3D({
  garmentType,
  primaryColor,
  secondaryColor = "#334155",
  nightMode,
  reflectiveTape,
  logoPosition,
  logoText,
  autoRotate,
  onRequestCapture,
}: UniformCanvas3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const reflectiveMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const spotLightRef = useRef<THREE.SpotLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0.35 });
  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  // Create fabric bump texture
  const createFabricBumpTexture = useCallback(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 128, 128);

    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 1.5;
    for (let i = -128; i < 256; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 128, 128);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 16);
    return texture;
  }, []);

  // Create Logo / Decal Texture
  const createLogoTexture = useCallback((text: string) => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 512, 256);

    ctx.fillStyle = "rgba(15, 29, 54, 0.95)";
    drawRoundedRect(ctx, 20, 20, 472, 216, 24);
    ctx.fill();

    ctx.strokeStyle = "#B89C72";
    ctx.lineWidth = 6;
    drawRoundedRect(ctx, 30, 30, 452, 196, 16);
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 46px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase().slice(0, 16), 256, 105);

    ctx.fillStyle = "#B89C72";
    ctx.font = "800 20px sans-serif";
    ctx.fillText("DOTACIÓN CERTIFICADA", 256, 165);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  // Build Procedural 3D Garment
  const buildGarment = useCallback(
    (
      scene: THREE.Scene,
      type: GarmentType,
      color: string,
      secondColor: string,
      isNight: boolean,
      hasTape: boolean,
      lPos: LogoPosition,
      lText: string
    ) => {
      if (modelGroupRef.current) {
        scene.remove(modelGroupRef.current);
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }

      reflectiveMaterialsRef.current = [];
      const group = new THREE.Group();
      const bumpTexture = createFabricBumpTexture();

      // Base Fabric Material
      const fabricMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        roughness: 0.72,
        metalness: 0.08,
        bumpMap: bumpTexture,
        bumpScale: 0.015,
        side: THREE.DoubleSide,
      });

      // Accent Fabric Material
      const accentMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(secondColor),
        roughness: 0.68,
        metalness: 0.1,
        bumpMap: bumpTexture,
        bumpScale: 0.012,
        side: THREE.DoubleSide,
      });

      // Stand Material
      const mannequinMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x111827),
        roughness: 0.35,
        metalness: 0.7,
      });

      // Chrome Material
      const chromeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xd1d5db),
        roughness: 0.15,
        metalness: 0.95,
      });

      // 3M Reflective Material
      const reflectiveMat = new THREE.MeshStandardMaterial({
        color: isNight ? new THREE.Color(0xffffff) : new THREE.Color(0xdce5ec),
        emissive: isNight ? new THREE.Color(0xc7ecee) : new THREE.Color(0x000000),
        emissiveIntensity: isNight ? 2.6 : 0,
        roughness: 0.25,
        metalness: 0.75,
        side: THREE.DoubleSide,
      });
      reflectiveMaterialsRef.current.push(reflectiveMat);

      // Hardware Material
      const hardwareMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x27272a),
        roughness: 0.2,
        metalness: 0.85,
      });

      /* 1. STAND & BASE */
      const baseGeo = new THREE.CylinderGeometry(0.7, 0.75, 0.06, 32);
      const baseMesh = new THREE.Mesh(baseGeo, mannequinMat);
      baseMesh.position.y = -1.8;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 16);
      const poleMesh = new THREE.Mesh(poleGeo, chromeMat);
      poleMesh.position.y = -0.9;
      poleMesh.castShadow = true;
      group.add(poleMesh);

      const neckGeo = new THREE.CylinderGeometry(0.16, 0.19, 0.35, 24);
      const neckMesh = new THREE.Mesh(neckGeo, mannequinMat);
      neckMesh.position.y = 1.02;
      group.add(neckMesh);

      const headCapGeo = new THREE.SphereGeometry(0.18, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      const headCapMesh = new THREE.Mesh(headCapGeo, mannequinMat);
      headCapMesh.position.y = 1.18;
      group.add(headCapMesh);

      /* 2. MAIN TORSO */
      const chestGeo = new THREE.CylinderGeometry(0.44, 0.38, 0.7, 32);
      chestGeo.scale(1.15, 1, 0.75);
      const chestMesh = new THREE.Mesh(chestGeo, secondColor !== color ? accentMat : fabricMat);
      chestMesh.position.y = 0.65;
      chestMesh.castShadow = true;
      chestMesh.receiveShadow = true;
      group.add(chestMesh);

      const waistGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.75, 32);
      waistGeo.scale(1.12, 1, 0.72);
      const waistMesh = new THREE.Mesh(waistGeo, fabricMat);
      waistMesh.position.y = 0.05;
      waistMesh.castShadow = true;
      waistMesh.receiveShadow = true;
      group.add(waistMesh);

      const hemGeo = new THREE.CylinderGeometry(0.425, 0.44, 0.1, 32);
      hemGeo.scale(1.13, 1, 0.73);
      const hemMesh = new THREE.Mesh(hemGeo, accentMat);
      hemMesh.position.y = -0.35;
      group.add(hemMesh);

      const collarGeo = new THREE.CylinderGeometry(0.24, 0.29, 0.18, 24, 1, true, 0, Math.PI * 1.85);
      const collarMesh = new THREE.Mesh(collarGeo, accentMat);
      collarMesh.rotation.y = -Math.PI * 0.42;
      collarMesh.position.y = 0.96;
      group.add(collarMesh);

      const zipperGeo = new THREE.BoxGeometry(0.045, 1.42, 0.02);
      const zipperMesh = new THREE.Mesh(zipperGeo, hardwareMat);
      zipperMesh.position.set(0, 0.35, 0.34);
      group.add(zipperMesh);

      const pullGeo = new THREE.BoxGeometry(0.03, 0.08, 0.03);
      const pullMesh = new THREE.Mesh(pullGeo, chromeMat);
      pullMesh.position.set(0.03, 0.78, 0.35);
      group.add(pullMesh);

      /* 3. POCKETS */
      const pocketLGeo = new THREE.BoxGeometry(0.18, 0.22, 0.035);
      const pocketLMesh = new THREE.Mesh(pocketLGeo, accentMat);
      pocketLMesh.position.set(-0.24, 0.62, 0.33);
      pocketLMesh.rotation.y = 0.15;
      group.add(pocketLMesh);

      const flapLGeo = new THREE.BoxGeometry(0.19, 0.06, 0.045);
      const flapLMesh = new THREE.Mesh(flapLGeo, fabricMat);
      flapLMesh.position.set(-0.24, 0.74, 0.34);
      flapLMesh.rotation.y = 0.15;
      group.add(flapLMesh);

      const pocketRGeo = new THREE.BoxGeometry(0.18, 0.22, 0.035);
      const pocketRMesh = new THREE.Mesh(pocketRGeo, accentMat);
      pocketRMesh.position.set(0.24, 0.62, 0.33);
      pocketRMesh.rotation.y = -0.15;
      group.add(pocketRMesh);

      const flapRGeo = new THREE.BoxGeometry(0.19, 0.06, 0.045);
      const flapRMesh = new THREE.Mesh(flapRGeo, fabricMat);
      flapRMesh.position.set(0.24, 0.74, 0.34);
      flapRMesh.rotation.y = -0.15;
      group.add(flapRMesh);

      /* 4. SLEEVES */
      if (type !== "chaleco") {
        const isShortSleeve = type === "camisa";
        const sleeveLength = isShortSleeve ? 0.38 : 0.95;
        const sleevePosY = isShortSleeve ? 0.62 : 0.32;

        const sleeveLGeo = new THREE.CylinderGeometry(0.16, isShortSleeve ? 0.15 : 0.12, sleeveLength, 24);
        const sleeveLMesh = new THREE.Mesh(sleeveLGeo, fabricMat);
        sleeveLMesh.position.set(-0.58, sleevePosY, 0);
        sleeveLMesh.rotation.z = 0.22;
        sleeveLMesh.rotation.x = 0.08;
        sleeveLMesh.castShadow = true;
        group.add(sleeveLMesh);

        const shoulderLGeo = new THREE.SphereGeometry(0.18, 24, 16);
        const shoulderLMesh = new THREE.Mesh(shoulderLGeo, accentMat);
        shoulderLMesh.position.set(-0.5, 0.82, 0);
        group.add(shoulderLMesh);

        const sleeveRGeo = new THREE.CylinderGeometry(0.16, isShortSleeve ? 0.15 : 0.12, sleeveLength, 24);
        const sleeveRMesh = new THREE.Mesh(sleeveRGeo, fabricMat);
        sleeveRMesh.position.set(0.58, sleevePosY, 0);
        sleeveRMesh.rotation.z = -0.22;
        sleeveRMesh.rotation.x = 0.08;
        sleeveRMesh.castShadow = true;
        group.add(sleeveRMesh);

        const shoulderRGeo = new THREE.SphereGeometry(0.18, 24, 16);
        const shoulderRMesh = new THREE.Mesh(shoulderRGeo, accentMat);
        shoulderRMesh.position.set(0.5, 0.82, 0);
        group.add(shoulderRMesh);

        if (hasTape && (type === "chaqueta" || type === "overol")) {
          const armTapeLGeo = new THREE.CylinderGeometry(0.142, 0.14, 0.08, 24);
          const armTapeL = new THREE.Mesh(armTapeLGeo, reflectiveMat);
          armTapeL.position.set(-0.58, 0.35, 0);
          armTapeL.rotation.z = 0.22;
          group.add(armTapeL);

          const armTapeRGeo = new THREE.CylinderGeometry(0.142, 0.14, 0.08, 24);
          const armTapeR = new THREE.Mesh(armTapeRGeo, reflectiveMat);
          armTapeR.position.set(0.58, 0.35, 0);
          armTapeR.rotation.z = -0.22;
          group.add(armTapeR);
        }
      } else {
        const armHoleLGeo = new THREE.TorusGeometry(0.22, 0.03, 12, 24);
        const armHoleL = new THREE.Mesh(armHoleLGeo, accentMat);
        armHoleL.position.set(-0.5, 0.65, 0);
        armHoleL.rotation.y = Math.PI * 0.5;
        group.add(armHoleL);

        const armHoleRGeo = new THREE.TorusGeometry(0.22, 0.03, 12, 24);
        const armHoleR = new THREE.Mesh(armHoleRGeo, accentMat);
        armHoleR.position.set(0.5, 0.65, 0);
        armHoleR.rotation.y = Math.PI * 0.5;
        group.add(armHoleR);
      }

      /* 5. LEGS (Overol) */
      if (type === "overol") {
        const legLength = 0.9;
        const legLGeo = new THREE.CylinderGeometry(0.19, 0.16, legLength, 24);
        const legLMesh = new THREE.Mesh(legLGeo, fabricMat);
        legLMesh.position.set(-0.22, -0.85, 0);
        group.add(legLMesh);

        const legRGeo = new THREE.CylinderGeometry(0.19, 0.16, legLength, 24);
        const legRMesh = new THREE.Mesh(legRGeo, fabricMat);
        legRMesh.position.set(0.22, -0.85, 0);
        group.add(legRMesh);

        if (hasTape) {
          const legTapeLGeo = new THREE.CylinderGeometry(0.18, 0.178, 0.08, 24);
          const legTapeL = new THREE.Mesh(legTapeLGeo, reflectiveMat);
          legTapeL.position.set(-0.22, -0.8, 0);
          group.add(legTapeL);

          const legTapeRGeo = new THREE.CylinderGeometry(0.18, 0.178, 0.08, 24);
          const legTapeR = new THREE.Mesh(legTapeRGeo, reflectiveMat);
          legTapeR.position.set(0.22, -0.8, 0);
          group.add(legTapeR);
        }
      }

      /* 6. REFLECTIVE TAPES */
      if (hasTape) {
        const tapeChestGeo = new THREE.CylinderGeometry(0.445, 0.445, 0.08, 32);
        tapeChestGeo.scale(1.155, 1, 0.755);
        const tapeChestMesh = new THREE.Mesh(tapeChestGeo, reflectiveMat);
        tapeChestMesh.position.y = 0.42;
        group.add(tapeChestMesh);

        if (type === "chaleco" || type === "chaqueta") {
          const tapeWaistGeo = new THREE.CylinderGeometry(0.405, 0.405, 0.08, 32);
          tapeWaistGeo.scale(1.125, 1, 0.725);
          const tapeWaistMesh = new THREE.Mesh(tapeWaistGeo, reflectiveMat);
          tapeWaistMesh.position.y = -0.08;
          group.add(tapeWaistMesh);
        }

        if (type === "chaleco") {
          const suspenderLGeo = new THREE.BoxGeometry(0.075, 0.65, 0.02);
          const suspenderL = new THREE.Mesh(suspenderLGeo, reflectiveMat);
          suspenderL.position.set(-0.25, 0.72, 0.31);
          suspenderL.rotation.y = 0.18;
          suspenderL.rotation.z = -0.06;
          group.add(suspenderL);

          const suspenderRGeo = new THREE.BoxGeometry(0.075, 0.65, 0.02);
          const suspenderR = new THREE.Mesh(suspenderRGeo, reflectiveMat);
          suspenderR.position.set(0.25, 0.72, 0.31);
          suspenderR.rotation.y = -0.18;
          suspenderR.rotation.z = 0.06;
          group.add(suspenderR);
        }
      }

      /* 7. LOGO DECAL */
      const logoTexture = createLogoTexture(lText);
      if (logoTexture) {
        const logoMat = new THREE.MeshStandardMaterial({
          map: logoTexture,
          transparent: true,
          roughness: 0.3,
          metalness: 0.1,
        });

        const logoGeo = new THREE.PlaneGeometry(0.18, 0.09);
        const logoMesh = new THREE.Mesh(logoGeo, logoMat);

        if (lPos === "pecho") {
          logoMesh.position.set(-0.24, 0.64, 0.36);
          logoMesh.rotation.y = 0.15;
          logoMesh.visible = true;
        } else if (lPos === "espalda") {
          logoMesh.geometry = new THREE.PlaneGeometry(0.36, 0.18);
          logoMesh.position.set(0, 0.62, -0.35);
          logoMesh.rotation.y = Math.PI;
          logoMesh.visible = true;
        } else if (lPos === "manga" && type !== "chaleco") {
          logoMesh.position.set(-0.64, 0.62, 0.05);
          logoMesh.rotation.y = -Math.PI * 0.5;
          logoMesh.visible = true;
        } else {
          logoMesh.visible = false;
        }

        group.add(logoMesh);
      }

      group.position.y = -0.2;
      modelGroupRef.current = group;
      scene.add(group);
    },
    [createFabricBumpTexture, createLogoTexture]
  );

  // Initialize Scene & Attach ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = Math.max(container.clientWidth || 500, 300);
    const height = Math.max(container.clientHeight || 500, 300);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 3.4);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 4, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xb89c72, 1.2);
    rimLight.position.set(0, 4, -4);
    scene.add(rimLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0);
    spotLight.position.set(0, 0.5, 4.5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.5;
    scene.add(spotLight);
    spotLightRef.current = spotLight;

    // Build the initial garment directly inside the scene!
    buildGarment(
      scene,
      garmentType,
      primaryColor,
      secondaryColor,
      nightMode,
      reflectiveTape,
      logoPosition,
      logoText
    );

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (modelGroupRef.current) {
        if (autoRotateRef.current && !isDraggingRef.current) {
          targetRotationRef.current.y += 0.006;
        }

        modelGroupRef.current.rotation.y +=
          (targetRotationRef.current.y - modelGroupRef.current.rotation.y) * 0.08;
        modelGroupRef.current.rotation.x +=
          (targetRotationRef.current.x - modelGroupRef.current.rotation.x) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ResizeObserver ensures dimensions are never 0
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && camera && renderer) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Night Mode
  useEffect(() => {
    if (!ambientLightRef.current || !keyLightRef.current || !spotLightRef.current) return;

    if (nightMode) {
      ambientLightRef.current.intensity = 0.25;
      keyLightRef.current.intensity = 0.4;
      spotLightRef.current.intensity = 4.5;
    } else {
      ambientLightRef.current.intensity = 0.9;
      keyLightRef.current.intensity = 1.8;
      spotLightRef.current.intensity = 0;
    }

    reflectiveMaterialsRef.current.forEach((mat) => {
      mat.emissive.set(nightMode ? 0xc7ecee : 0x000000);
      mat.emissiveIntensity = nightMode ? 2.8 : 0;
      mat.needsUpdate = true;
    });
  }, [nightMode]);

  // Rebuild garment when props change
  useEffect(() => {
    if (!sceneRef.current) return;
    buildGarment(
      sceneRef.current,
      garmentType,
      primaryColor,
      secondaryColor,
      nightMode,
      reflectiveTape,
      logoPosition,
      logoText
    );
  }, [
    buildGarment,
    garmentType,
    primaryColor,
    secondaryColor,
    nightMode,
    reflectiveTape,
    logoPosition,
    logoText,
  ]);

  // Expose Screenshot Capture
  useEffect(() => {
    if (onRequestCapture && rendererRef.current && sceneRef.current && cameraRef.current) {
      onRequestCapture(() => {
        if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return "";
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        return rendererRef.current.domElement.toDataURL("image/png");
      });
    }
  }, [onRequestCapture]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    targetRotationRef.current.y += deltaX * 0.008;
    targetRotationRef.current.x = Math.max(
      -0.4,
      Math.min(0.4, targetRotationRef.current.x + deltaY * 0.005)
    );

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    cameraRef.current.position.z = Math.max(
      2.2,
      Math.min(5.0, cameraRef.current.position.z + e.deltaY * 0.002)
    );
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className="relative w-full h-full min-h-[450px] cursor-grab active:cursor-grabbing select-none touch-none"
    />
  );
}
