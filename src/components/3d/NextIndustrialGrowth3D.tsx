"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export interface NextIndustrialGrowth3DProps {
  /** Normalized scroll progress from 0.0 to 1.0 */
  progress: number;
  /** Active scene index (0, 1, 2, 3) */
  activeScene: number;
  /** Reduced motion preference */
  reducedMotion?: boolean;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Generates a high-DPI procedural CanvasTexture for the 3D NEXT Corporate Card
 */
function createNextCardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  // Metallic Navy to Sky Blue Gradient Background
  const grad = ctx.createLinearGradient(0, 0, 1024, 640);
  grad.addColorStop(0, "#081C45");
  grad.addColorStop(0.55, "#0C2D6B");
  grad.addColorStop(1, "#0284C7");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);

  // Subtle Diagonal Geometric Light Sheen
  ctx.fillStyle = "rgba(56, 189, 248, 0.14)";
  ctx.beginPath();
  ctx.moveTo(420, 0);
  ctx.lineTo(780, 0);
  ctx.lineTo(520, 640);
  ctx.lineTo(160, 640);
  ctx.closePath();
  ctx.fill();

  // Border Highlight
  ctx.strokeStyle = "rgba(125, 211, 252, 0.45)";
  ctx.lineWidth = 8;
  ctx.strokeRect(16, 16, 992, 608);

  // EMV Gold/Silver Chip
  ctx.fillStyle = "#E5C168";
  ctx.beginPath();
  ctx.roundRect(96, 230, 130, 98, 18);
  ctx.fill();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 3;
  ctx.strokeRect(126, 252, 70, 54);

  // NEXT Logo Typography
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 92px system-ui, -apple-system, sans-serif";
  ctx.fillText("NE", 265, 310);

  // Sky-Blue Arrow inside Logo
  ctx.fillStyle = "#38BDF8";
  ctx.fillText("➔", 400, 308);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("XT", 495, 310);

  // Subtitle "CORPORATE CAPITAL"
  ctx.fillStyle = "#7DD3FC";
  ctx.font = "700 26px system-ui, -apple-system, sans-serif";
  ctx.fillText("FINANCIACIÓN EMPRESARIAL", 96, 465);

  // Approved Line Badge on Card
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 38px monospace";
  ctx.fillText("LÍNEA ACTIVA • EMPRESAS", 96, 535);

  // Mastercard-style Dual Circles Bottom Right
  ctx.fillStyle = "#38BDF8";
  ctx.beginPath();
  ctx.arc(835, 510, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#0EA5E9";
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(895, 510, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Helper to build a stylized minimalist 3D character (Entrepreneur or Operator)
 * Keeping the entrepreneur's visual identity consistent across all 4 scenes.
 */
function buildStylizedPerson(options: {
  suitColor: number;
  shirtColor: number;
  tieColor?: number;
  helmetColor?: number;
  isEntrepreneur?: boolean;
}): {
  root: THREE.Group;
  rightArm: THREE.Group;
  leftArm: THREE.Group;
  head: THREE.Mesh;
} {
  const root = new THREE.Group();

  const suitMat = new THREE.MeshStandardMaterial({
    color: options.suitColor,
    roughness: 0.35,
    metalness: 0.1,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xe6b89c,
    roughness: 0.45,
  });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: options.shirtColor,
    roughness: 0.3,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
  });

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.085, 0.36, 8, 12);
  const leftLeg = new THREE.Mesh(legGeo, suitMat);
  leftLeg.position.set(-0.1, 0.26, 0);
  leftLeg.castShadow = true;
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, suitMat);
  rightLeg.position.set(0.1, 0.26, 0);
  rightLeg.castShadow = true;
  root.add(rightLeg);

  // Torso (Clean rounded executive blazer)
  const torsoGeo = new THREE.CapsuleGeometry(0.2, 0.42, 10, 16);
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.position.set(0, 0.72, 0);
  torso.scale.set(1.05, 1, 0.72);
  torso.castShadow = true;
  root.add(torso);

  // Shirt V-neck / Collar accent
  const shirtGeo = new THREE.BoxGeometry(0.16, 0.26, 0.16);
  const shirt = new THREE.Mesh(shirtGeo, shirtMat);
  shirt.position.set(0, 0.82, 0.08);
  root.add(shirt);

  // Sky-blue tie / badge for the Entrepreneur so he is unmistakably identifiable
  if (options.tieColor) {
    const tieMat = new THREE.MeshStandardMaterial({
      color: options.tieColor,
      emissive: options.tieColor,
      emissiveIntensity: 0.18,
      roughness: 0.25,
    });
    const tieGeo = new THREE.BoxGeometry(0.055, 0.24, 0.04);
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 0.78, 0.16);
    root.add(tie);
  }

  // Head
  const headGeo = new THREE.SphereGeometry(0.17, 20, 20);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.set(0, 1.18, 0);
  head.castShadow = true;
  root.add(head);

  // Hair or Safety Helmet
  if (options.helmetColor) {
    const helmetMat = new THREE.MeshStandardMaterial({
      color: options.helmetColor,
      roughness: 0.25,
      metalness: 0.15,
    });
    const helmetGeo = new THREE.SphereGeometry(
      0.185,
      18,
      12,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.55
    );
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 1.2, 0);
    root.add(helmet);
  } else {
    // Stylish sculpted hair for the Entrepreneur
    const hairGeo = new THREE.SphereGeometry(
      0.18,
      18,
      14,
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.6
    );
    const hair = new THREE.Mesh(hairGeo, darkMat);
    hair.position.set(0, 1.21, -0.02);
    hair.rotation.x = -0.15;
    root.add(hair);
  }

  // Arms (Pivot at shoulder)
  const armGeo = new THREE.CapsuleGeometry(0.065, 0.32, 8, 12);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.26, 0.9, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, suitMat);
  leftArmMesh.position.set(0, -0.16, 0);
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);
  root.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.26, 0.9, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, suitMat);
  rightArmMesh.position.set(0, -0.16, 0);
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);
  root.add(rightArm);

  return { root, rightArm, leftArm, head };
}

export default function NextIndustrialGrowth3D({
  progress,
  activeScene,
  reducedMotion = false,
}: NextIndustrialGrowth3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const progressRef = useRef<number>(progress);
  progressRef.current = progress;

  const reducedMotionRef = useRef<boolean>(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Check WebGL Availability
    let renderer: THREE.WebGLRenderer;
    try {
      const isMobile = window.innerWidth < 768;
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
      );
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
    } catch {
      setWebglSupported(false);
      return;
    }

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Scene & Isometric-like Perspective Camera
    const scene = new THREE.Scene();

    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    const camera = new THREE.PerspectiveCamera(32, aspect, 0.1, 120);
    camera.position.set(13, 11.5, 13);
    camera.lookAt(0, 1.2, 0);

    // 3. Studio Lighting (Clean White, Sky Blue & Executive Navy accents)
    const hemiLight = new THREE.HemisphereLight(0xf0f9ff, 0xcbd5e1, 1.35);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.85);
    dirLight.position.set(12, 18, 10);
    dirLight.castShadow = true;
    const isMobileInit = window.innerWidth < 768;
    const shadowRes = isMobileInit ? 1024 : 2048;
    dirLight.shadow.mapSize.width = shadowRes;
    dirLight.shadow.mapSize.height = shadowRes;
    dirLight.shadow.camera.near = 2;
    dirLight.shadow.camera.far = 45;
    const d = 10;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    rimLight.position.set(-12, 8, -10);
    scene.add(rimLight);

    // Point light attached to the NEXT 3D Card (energizes the factory in Scene 2)
    const cardPointLight = new THREE.PointLight(0x38bdf8, 0, 12);
    scene.add(cardPointLight);

    // ========================================================================
    // 4. SHARED MATERIALS (Disposed cleanly on unmount)
    // ========================================================================
    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const registerMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };
    const registerGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };

    const platformMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.4,
        metalness: 0.05,
      })
    );
    const platformEdgeMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        roughness: 0.35,
        metalness: 0.1,
      })
    );
    const buildingWhiteMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.25,
        metalness: 0.08,
      })
    );
    const navyAccentMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x0f243c,
        roughness: 0.3,
        metalness: 0.2,
      })
    );
    const skyGlassMat = registerMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.12,
        metalness: 0.1,
        transmission: 0.35,
        transparent: true,
        opacity: 0.82,
      })
    );
    const cyanGlowMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0ea5e9,
        emissiveIntensity: 0.45,
        roughness: 0.2,
      })
    );
    const emeraldGlowMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.4,
        roughness: 0.25,
      })
    );
    const machineSlateMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.35,
        metalness: 0.4,
      })
    );
    const packageBoxMat = registerMat(
      new THREE.MeshStandardMaterial({
        color: 0x7dd3fc,
        roughness: 0.3,
        metalness: 0.1,
      })
    );

    // ========================================================================
    // 5. WORLD ROOT & ARCHITECTURAL BASE PLATFORM
    // ========================================================================
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Main Isometric Foundation Slab (Expands slightly as factory grows)
    const baseGeo = registerGeo(new THREE.BoxGeometry(11.5, 0.45, 9.5));
    const baseMesh = new THREE.Mesh(baseGeo, platformMat);
    baseMesh.position.set(0, -0.225, 0);
    baseMesh.receiveShadow = true;
    worldGroup.add(baseMesh);

    const subBaseGeo = registerGeo(new THREE.BoxGeometry(11.9, 0.2, 9.9));
    const subBaseMesh = new THREE.Mesh(subBaseGeo, platformEdgeMat);
    subBaseMesh.position.set(0, -0.45, 0);
    worldGroup.add(subBaseMesh);

    // Subtle Architectural Grid Helper on Platform
    const gridHelper = new THREE.GridHelper(11, 22, 0xbae6fd, 0xe2e8f0);
    gridHelper.position.y = 0.01;
    worldGroup.add(gridHelper);

    // ========================================================================
    // SCENE 1 ELEMENTS (0% - 25%): INITIAL SMALL MANUFACTURING WORKSHOP
    // ========================================================================
    const initialWorkshopGroup = new THREE.Group();
    initialWorkshopGroup.position.set(-2.2, 0, -1.0);
    worldGroup.add(initialWorkshopGroup);

    // Initial Workshop Structure (Cutaway isometric style so interior machines are visible)
    const backWallGeo = registerGeo(new THREE.BoxGeometry(3.4, 2.2, 0.18));
    const backWall = new THREE.Mesh(backWallGeo, buildingWhiteMat);
    backWall.position.set(0, 1.1, -1.4);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    initialWorkshopGroup.add(backWall);

    const sideWallGeo = registerGeo(new THREE.BoxGeometry(0.18, 2.2, 2.8));
    const sideWall = new THREE.Mesh(sideWallGeo, buildingWhiteMat);
    sideWall.position.set(-1.61, 1.1, 0);
    sideWall.castShadow = true;
    sideWall.receiveShadow = true;
    initialWorkshopGroup.add(sideWall);

    // Navy Header Fascia Strip on Initial Workshop
    const fasciaGeo = registerGeo(new THREE.BoxGeometry(3.45, 0.32, 0.24));
    const fascia = new THREE.Mesh(fasciaGeo, navyAccentMat);
    fascia.position.set(0, 2.1, -1.38);
    initialWorkshopGroup.add(fascia);

    // Initial Floor Tile
    const workshopFloorGeo = registerGeo(new THREE.BoxGeometry(3.4, 0.06, 2.8));
    const workshopFloor = new THREE.Mesh(workshopFloorGeo, platformEdgeMat);
    workshopFloor.position.set(0, 0.03, 0);
    workshopFloor.receiveShadow = true;
    initialWorkshopGroup.add(workshopFloor);

    // Initial Compact Machine #1 & #2 + Short Conveyor Belt
    const machine1Geo = registerGeo(new THREE.BoxGeometry(0.85, 1.15, 0.85));
    const machine1 = new THREE.Mesh(machine1Geo, machineSlateMat);
    machine1.position.set(-0.9, 0.58, -0.5);
    machine1.castShadow = true;
    initialWorkshopGroup.add(machine1);

    const machine1Cap = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(0.9, 0.16, 0.9)),
      cyanGlowMat
    );
    machine1Cap.position.set(-0.9, 1.2, -0.5);
    initialWorkshopGroup.add(machine1Cap);

    // Initial Short Conveyor Belt
    const shortBeltGeo = registerGeo(new THREE.BoxGeometry(2.1, 0.35, 0.55));
    const shortBelt = new THREE.Mesh(shortBeltGeo, navyAccentMat);
    shortBelt.position.set(0.35, 0.18, -0.5);
    shortBelt.castShadow = true;
    initialWorkshopGroup.add(shortBelt);

    // Product Boxes on Initial Belt
    const boxGeo = registerGeo(new THREE.BoxGeometry(0.32, 0.28, 0.32));
    const initialBoxes: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const box = new THREE.Mesh(boxGeo, packageBoxMat);
      box.position.set(-0.1 + i * 0.7, 0.5, -0.5);
      box.castShadow = true;
      initialWorkshopGroup.add(box);
      initialBoxes.push(box);
    }

    // THE ENTREPRENEUR (Consistent protagonist across all 4 scenes!)
    const entrepreneur = buildStylizedPerson({
      suitColor: 0x0f243c, // Executive Navy Suit
      shirtColor: 0xffffff, // Crisp White Shirt
      tieColor: 0x38bdf8, // Signature NEXT Sky-Blue Tie
      isEntrepreneur: true,
    });
    entrepreneur.root.position.set(-0.9, 0.05, 1.25);
    entrepreneur.root.rotation.y = Math.PI * 0.18;
    worldGroup.add(entrepreneur.root);

    // ========================================================================
    // SCENE 2 ELEMENTS (25% - 50%): NEXT 3D CORPORATE CARD & FINANCING PULSE
    // ========================================================================
    const financeGroup = new THREE.Group();
    worldGroup.add(financeGroup);

    const cardTexture = createNextCardTexture();
    const cardMat = registerMat(
      new THREE.MeshPhysicalMaterial({
        map: cardTexture,
        roughness: 0.18,
        metalness: 0.35,
        clearcoat: 0.7,
        clearcoatRoughness: 0.15,
      })
    );
    const cardGeo = registerGeo(new THREE.BoxGeometry(3.2, 0.08, 2.0));
    const nextCardMesh = new THREE.Mesh(cardGeo, cardMat);
    nextCardMesh.castShadow = true;
    financeGroup.add(nextCardMesh);

    // Glowing Energy Ring beneath the 3D Card on the Factory Floor
    const ringGeo = registerGeo(new THREE.RingGeometry(1.4, 1.62, 48));
    const ringMat = registerMat(
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
      })
    );
    const energyRing = new THREE.Mesh(ringGeo, ringMat);
    energyRing.rotation.x = -Math.PI / 2;
    energyRing.position.set(0, 0.04, 0);
    worldGroup.add(energyRing);

    // Floating 3D Financial Liquidity Pillars (Appear around the card in Scene 2)
    const finPillarsGroup = new THREE.Group();
    worldGroup.add(finPillarsGroup);
    const finPillarMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const h = 0.6 + i * 0.38;
      const pGeo = registerGeo(new THREE.BoxGeometry(0.32, h, 0.32));
      const pMesh = new THREE.Mesh(
        pGeo,
        i === 3 ? emeraldGlowMat : cyanGlowMat
      );
      pMesh.position.set(1.4 + i * 0.5, h / 2, -2.2);
      pMesh.castShadow = true;
      finPillarsGroup.add(pMesh);
      finPillarMeshes.push(pMesh);
    }

    // ========================================================================
    // SCENE 3 ELEMENTS (50% - 75%): EXPANDING PRODUCTION BAYS, ROBOTS & TEAM
    // ========================================================================
    const expansionGroup = new THREE.Group();
    worldGroup.add(expansionGroup);

    // Expansion Bay #2 (Middle Automated Production Hall)
    const bay2BackWall = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(4.2, 2.6, 0.18)),
      buildingWhiteMat
    );
    bay2BackWall.position.set(1.6, 1.3, -2.4);
    bay2BackWall.castShadow = true;
    bay2BackWall.receiveShadow = true;
    expansionGroup.add(bay2BackWall);

    const bay2Fascia = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(4.25, 0.36, 0.24)),
      cyanGlowMat
    );
    bay2Fascia.position.set(1.6, 2.45, -2.38);
    expansionGroup.add(bay2Fascia);

    // Extended High-Speed Conveyor Line across Bay 2
    const longBelt = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(4.6, 0.38, 0.65)),
      navyAccentMat
    );
    longBelt.position.set(1.5, 0.19, -0.5);
    longBelt.castShadow = true;
    expansionGroup.add(longBelt);

    // 3 Automated Robotic Assembly Arms along the Extended Belt
    const robotArms: THREE.Group[] = [];
    for (let i = 0; i < 3; i++) {
      const robotRoot = new THREE.Group();
      robotRoot.position.set(0.1 + i * 1.35, 0, -1.25);

      const pedestal = new THREE.Mesh(
        registerGeo(new THREE.CylinderGeometry(0.24, 0.3, 0.5, 16)),
        machineSlateMat
      );
      pedestal.position.y = 0.25;
      pedestal.castShadow = true;
      robotRoot.add(pedestal);

      const armPivot = new THREE.Group();
      armPivot.position.y = 0.5;
      const upperArm = new THREE.Mesh(
        registerGeo(new THREE.BoxGeometry(0.18, 0.85, 0.18)),
        cyanGlowMat
      );
      upperArm.position.set(0, 0.38, 0.15);
      upperArm.rotation.x = 0.35;
      upperArm.castShadow = true;
      armPivot.add(upperArm);

      robotRoot.add(armPivot);
      expansionGroup.add(robotRoot);
      robotArms.push(armPivot);
    }

    // Moving Packages on the Extended Belt
    const expansionBoxes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(boxGeo, packageBoxMat);
      b.position.set(-0.2 + i * 1.05, 0.52, -0.5);
      b.castShadow = true;
      expansionGroup.add(b);
      expansionBoxes.push(b);
    }

    // High-Bay Storage Racks (Right Wing)
    const rackGroup = new THREE.Group();
    rackGroup.position.set(3.4, 0, 1.2);
    for (let level = 0; level < 3; level++) {
      const shelf = new THREE.Mesh(
        registerGeo(new THREE.BoxGeometry(1.8, 0.08, 0.9)),
        machineSlateMat
      );
      shelf.position.y = 0.45 + level * 0.65;
      shelf.castShadow = true;
      rackGroup.add(shelf);

      // Pallets on each shelf
      for (let p = 0; p < 2; p++) {
        const palletBox = new THREE.Mesh(
          registerGeo(new THREE.BoxGeometry(0.55, 0.42, 0.55)),
          level === 2 ? emeraldGlowMat : packageBoxMat
        );
        palletBox.position.set(-0.4 + p * 0.8, 0.7 + level * 0.65, 0);
        palletBox.castShadow = true;
        rackGroup.add(palletBox);
      }
    }
    expansionGroup.add(rackGroup);

    // 3 New Specialized Operators (With Sky-Blue Safety Helmets)
    const operators: ReturnType<typeof buildStylizedPerson>[] = [];
    const opPositions: [number, number, number, number][] = [
      [0.4, 0.05, 0.45, Math.PI],
      [1.9, 0.05, 0.45, Math.PI * 0.9],
      [2.5, 0.05, 1.6, -Math.PI * 0.4],
    ];
    opPositions.forEach(([ox, oy, oz, rot]) => {
      const op = buildStylizedPerson({
        suitColor: 0x1e293b,
        shirtColor: 0x38bdf8,
        helmetColor: 0x38bdf8,
      });
      op.root.position.set(ox, oy, oz);
      op.root.rotation.y = rot;
      expansionGroup.add(op.root);
      operators.push(op);
    });

    // ========================================================================
    // SCENE 4 ELEMENTS (75% - 100%): CONSOLIDATED MODERN INDUSTRIAL COMPLEX
    // ========================================================================
    const consolidatedGroup = new THREE.Group();
    worldGroup.add(consolidatedGroup);

    // Modern Glass Executive Headquarters Tower (Rear-Left Command Center)
    const towerCore = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(2.8, 4.4, 2.2)),
      navyAccentMat
    );
    towerCore.position.set(-2.5, 2.2, -2.6);
    towerCore.castShadow = true;
    towerCore.receiveShadow = true;
    consolidatedGroup.add(towerCore);

    // Glass Curtain Wall Facade on Tower
    const towerGlass = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(2.6, 3.8, 0.12)),
      skyGlassMat
    );
    towerGlass.position.set(-2.5, 2.2, -1.46);
    consolidatedGroup.add(towerGlass);

    // Illuminated Horizontal Floor Mullions on Glass Tower
    for (let f = 0; f < 4; f++) {
      const mullion = new THREE.Mesh(
        registerGeo(new THREE.BoxGeometry(2.65, 0.06, 0.16)),
        cyanGlowMat
      );
      mullion.position.set(-2.5, 0.9 + f * 0.9, -1.45);
      consolidatedGroup.add(mullion);
    }

    // Executive Command Balcony where the Entrepreneur stands in Scene 4
    const balconyMesh = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(2.2, 0.18, 1.2)),
      buildingWhiteMat
    );
    balconyMesh.position.set(-1.1, 0.45, 1.55);
    balconyMesh.castShadow = true;
    balconyMesh.receiveShadow = true;
    consolidatedGroup.add(balconyMesh);

    const balconyRim = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(2.24, 0.08, 1.24)),
      cyanGlowMat
    );
    balconyRim.position.set(-1.1, 0.56, 1.55);
    consolidatedGroup.add(balconyRim);

    // Automated Logistics Transport Truck (Front-Right Loading Dock)
    const truckGroup = new THREE.Group();
    truckGroup.position.set(1.8, 0.05, 2.55);
    const trailer = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(2.1, 0.95, 0.85)),
      buildingWhiteMat
    );
    trailer.position.set(0, 0.58, 0);
    trailer.castShadow = true;
    truckGroup.add(trailer);

    const trailerStripe = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(2.12, 0.16, 0.87)),
      cyanGlowMat
    );
    trailerStripe.position.set(0, 0.62, 0);
    truckGroup.add(trailerStripe);

    const cab = new THREE.Mesh(
      registerGeo(new THREE.BoxGeometry(0.75, 0.78, 0.82)),
      navyAccentMat
    );
    cab.position.set(-1.45, 0.49, 0);
    cab.castShadow = true;
    truckGroup.add(cab);
    consolidatedGroup.add(truckGroup);

    // Tall Consolidated Financial Growth Monument Bars (Back-Right)
    const monumentBars: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const mh = 1.2 + i * 0.75;
      const mBar = new THREE.Mesh(
        registerGeo(new THREE.BoxGeometry(0.48, mh, 0.48)),
        i === 3 ? emeraldGlowMat : cyanGlowMat
      );
      mBar.position.set(3.2 + i * 0.65, mh / 2, -2.4);
      mBar.castShadow = true;
      consolidatedGroup.add(mBar);
      monumentBars.push(mBar);
    }

    // ========================================================================
    // 6. INTERSECTION OBSERVER & RESIZE HANDLER
    // ========================================================================
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      camera.aspect = w / h;
      // Slightly wider FOV on narrow mobile viewports so the entire isometric complex fits
      camera.fov = w < 640 ? 40 : w < 1024 ? 35 : 31;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // ========================================================================
    // 7. SCROLL-DRIVEN RENDER LOOP (100% Synchronized with progressRef)
    // ========================================================================
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();
      const p = clamp(progressRef.current, 0, 1);
      const isReduced = reducedMotionRef.current;

      // Phase weights:
      // Scene 1: 0.00 - 0.25 (Initial small workshop)
      // Scene 2: 0.25 - 0.50 (NEXT 3D Card & Financing)
      // Scene 3: 0.50 - 0.75 (Progressive Expansion)
      // Scene 4: 0.75 - 1.00 (Consolidated Modern Industry)
      const s2Enter = smoothstep(0.18, 0.34, p);
      const s2Exit = smoothstep(0.52, 0.68, p);
      const s3Progress = smoothstep(0.45, 0.72, p);
      const s4Progress = smoothstep(0.7, 0.94, p);

      // ----------------------------------------------------------------------
      // A. SUBTLE ISOMETRIC CAMERA MOVEMENT (Driven by scroll progress)
      // ----------------------------------------------------------------------
      // Zooms out smoothly from intimate workshop view to grand industrial view
      const camDist = lerp(11.2, 14.8, smoothstep(0.2, 0.9, p));
      const camAngle = lerp(0.72, 0.86, p);
      const camHeight = lerp(9.4, 12.2, smoothstep(0.2, 0.9, p));
      camera.position.set(
        Math.cos(camAngle) * camDist,
        camHeight,
        Math.sin(camAngle) * camDist
      );
      const lookX = lerp(-1.1, 0.4, smoothstep(0.25, 0.85, p));
      const lookY = lerp(0.9, 1.45, smoothstep(0.35, 0.9, p));
      camera.lookAt(lookX, lookY, 0);

      // ----------------------------------------------------------------------
      // B. SCENE 2: 3D NEXT CORPORATE CARD & FINANCING ENERGY
      // ----------------------------------------------------------------------
      // Card descends from above at 20-35%, hovers over workshop, then rises to crown the tower in Scene 4
      const cardActiveVis = clamp(s2Enter - s2Exit * 0.35, 0, 1);
      financeGroup.visible = s2Enter > 0.01;

      const hoverOffset = isReduced ? 0 : Math.sin(elapsed * 2.4) * 0.12;
      const cardX = lerp(-0.6, -2.5, s4Progress);
      const cardY = lerp(6.8, 3.35, s2Enter) + s4Progress * 1.85 + hoverOffset;
      const cardZ = lerp(0, -2.4, s4Progress);
      nextCardMesh.position.set(cardX, cardY, cardZ);

      // Isometric presentation tilt for the NEXT Card
      nextCardMesh.rotation.set(
        lerp(0.55, 0.32, s2Enter),
        lerp(-0.4, 0.25, p) + (isReduced ? 0 : Math.sin(elapsed * 1.2) * 0.06),
        lerp(-0.18, -0.08, s2Enter)
      );
      const cardScale = lerp(0.01, 1, s2Enter) * lerp(1, 0.78, s4Progress);
      nextCardMesh.scale.setScalar(Math.max(0.001, cardScale));

      // PointLight & Floor Energy Ring intensity
      cardPointLight.position.set(cardX, cardY - 0.5, cardZ);
      cardPointLight.intensity = cardActiveVis * 4.5;

      energyRing.position.set(-0.8, 0.05, -0.4);
      const ringScale = lerp(0.4, 2.2, s2Enter);
      energyRing.scale.setScalar(ringScale);
      ringMat.opacity = clamp(s2Enter * (1 - s2Exit) * 0.65, 0, 0.65);

      // Financial Pillars scale Y with Scene 2 scroll
      finPillarsGroup.visible = s2Enter > 0.02;
      finPillarMeshes.forEach((mesh, idx) => {
        const pillarT = smoothstep(0.24 + idx * 0.04, 0.44 + idx * 0.04, p);
        mesh.scale.y = Math.max(0.001, pillarT);
        mesh.position.y = ((0.6 + idx * 0.38) * pillarT) / 2;
      });

      // ----------------------------------------------------------------------
      // C. SCENE 3: PROGRESSIVE EXPANSION OF FACILITIES, MACHINES & WORKERS
      // ----------------------------------------------------------------------
      expansionGroup.visible = s3Progress > 0.005;
      expansionGroup.scale.set(1, Math.max(0.001, s3Progress), 1);

      // Conveyor boxes position driven deterministically by scroll progress p
      initialBoxes.forEach((box, i) => {
        const travel = ((p * 4 + i * 0.5) % 1) * 1.5;
        box.position.x = -0.35 + travel;
      });

      expansionBoxes.forEach((box, i) => {
        const travel = ((p * 6 + i * 0.25) % 1) * 4.0;
        box.position.x = -0.5 + travel;
      });

      // Robotic arms articulate according to scroll progress
      robotArms.forEach((arm, idx) => {
        arm.rotation.y = Math.sin(p * Math.PI * 8 + idx * 1.4) * 0.65;
        arm.rotation.z = Math.cos(p * Math.PI * 6 + idx) * 0.18;
      });

      // ----------------------------------------------------------------------
      // D. SCENE 4: CONSOLIDATED MODERN INDUSTRY & COMMAND TOWER
      // ----------------------------------------------------------------------
      consolidatedGroup.visible = s4Progress > 0.005;
      consolidatedGroup.scale.set(1, Math.max(0.001, s4Progress), 1);

      // Delivery Truck glides into loading dock during Scene 4
      truckGroup.position.x = lerp(5.2, 1.8, s4Progress);

      // Monument Growth Bars rise in Scene 4
      monumentBars.forEach((mBar, idx) => {
        const barT = smoothstep(0.72 + idx * 0.04, 0.92 + idx * 0.03, p);
        mBar.scale.y = Math.max(0.001, barT);
        mBar.position.y = ((1.2 + idx * 0.75) * barT) / 2;
      });

      // ----------------------------------------------------------------------
      // E. ENTREPRENEUR PROTAGONIST TRANSFORMATION ACROSS ALL 4 SCENES
      // ----------------------------------------------------------------------
      // Scene 1: Next to initial workshop (-0.9, 0.05, 1.25)
      // Scene 2: Turns toward the floating NEXT 3D card & raises arm
      // Scene 3: Steps toward center floor to supervise new production line
      // Scene 4: Stands proudly atop the elevated Executive Command Balcony (-1.1, 0.58, 1.55)
      const entX = lerp(
        lerp(-0.9, 0.1, s3Progress),
        -1.1,
        s4Progress
      );
      const entY = lerp(0.05, 0.58, s4Progress);
      const entZ = lerp(1.25, 1.55, s4Progress);
      entrepreneur.root.position.set(entX, entY, entZ);

      // Entrepreneur rotation & welcoming/directing arm gesture
      entrepreneur.root.rotation.y = lerp(
        Math.PI * 0.18,
        Math.PI * 0.25,
        s4Progress
      );
      const gestureT = clamp(s2Enter * (1 - s3Progress) + s4Progress, 0, 1);
      entrepreneur.rightArm.rotation.x = lerp(0, -0.85, gestureT);
      entrepreneur.rightArm.rotation.z = lerp(0, -0.25, gestureT);

      renderer.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(animate);

    // ========================================================================
    // 8. CLEANUP OF WEBGL RESOURCES ON UNMOUNT
    // ========================================================================
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      io.disconnect();

      cardTexture.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Fallback UI if WebGL is disabled or unsupported on the device
  if (!webglSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-sky-50 via-white to-sky-100 rounded-3xl border border-sky-200">
        <div className="w-16 h-16 rounded-2xl bg-[#0F243C] text-[#38BDF8] flex items-center justify-center font-black text-xl mb-4 shadow-lg">
          NE➔XT
        </div>
        <h4 className="text-lg font-extrabold text-[#0F243C]">
          Etapa {activeScene + 1} de 4 • Evolución Industrial NEXT
        </h4>
        <p className="text-sm text-slate-600 max-w-md mt-2">
          Progreso de transformación empresarial: {Math.round(progress * 100)}%
        </p>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-grab active:cursor-grabbing"
      aria-label="Escena interactiva 3D de crecimiento empresarial impulsado por NEXT"
    />
  );
}
