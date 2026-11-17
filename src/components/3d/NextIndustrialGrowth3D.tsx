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

function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const p = clamp(x, 0, 1);
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
}

/**
 * High-Resolution Retina CanvasTexture for the 3D NEXT Corporate Card
 */
function createHDNextCardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  // Smooth Metallic Navy to Sky-Blue Gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 640);
  grad.addColorStop(0, "#07193D");
  grad.addColorStop(0.5, "#0D3270");
  grad.addColorStop(1, "#0284C7");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 640);

  // Diagonal Glossy Light Sweep
  const sheen = ctx.createLinearGradient(200, 0, 750, 640);
  sheen.addColorStop(0, "rgba(56, 189, 248, 0.0)");
  sheen.addColorStop(0.5, "rgba(125, 211, 252, 0.25)");
  sheen.addColorStop(1, "rgba(56, 189, 248, 0.0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, 1024, 640);

  // Subtle Border Frame
  ctx.strokeStyle = "rgba(125, 211, 252, 0.65)";
  ctx.lineWidth = 10;
  ctx.strokeRect(20, 20, 984, 600);

  // Gold EMV Chip
  ctx.fillStyle = "#FBBF24";
  ctx.beginPath();
  ctx.roundRect(90, 220, 135, 100, 20);
  ctx.fill();
  ctx.strokeStyle = "#FEF3C7";
  ctx.lineWidth = 4;
  ctx.strokeRect(118, 244, 78, 52);

  // NEXT Brand Logo
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 96px system-ui, -apple-system, sans-serif";
  ctx.fillText("NE", 265, 308);
  ctx.fillStyle = "#38BDF8";
  ctx.fillText("➔", 405, 306);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("XT", 502, 308);

  // Card Labels
  ctx.fillStyle = "#BAE6FD";
  ctx.font = "700 28px system-ui, -apple-system, sans-serif";
  ctx.fillText("FINANCIACIÓN EMPRESARIAL", 90, 465);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 38px monospace";
  ctx.fillText("CUPO ACTIVO • +35 ALIADOS", 90, 535);

  // Overlapping Dual Circles Bottom Right
  ctx.fillStyle = "#38BDF8";
  ctx.beginPath();
  ctx.arc(830, 505, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#10B981";
  ctx.globalAlpha = 0.88;
  ctx.beginPath();
  ctx.arc(895, 505, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Stylized 3D Character with articulated head, torso, and arms for lively animation
 */
function buildAnimatedCharacter(options: {
  suitColor: number;
  shirtColor: number;
  tieColor?: number;
  hardhatColor?: number;
  hasGlasses?: boolean;
}): {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  headGroup: THREE.Group;
  rightArm: THREE.Group;
  leftArm: THREE.Group;
} {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  const suitMat = new THREE.MeshStandardMaterial({
    color: options.suitColor,
    roughness: 0.32,
    metalness: 0.08,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xf1c29d,
    roughness: 0.42,
  });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: options.shirtColor,
    roughness: 0.3,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.35,
  });

  // Legs
  const legGeo = new THREE.CapsuleGeometry(0.08, 0.32, 8, 14);
  const leftLeg = new THREE.Mesh(legGeo, suitMat);
  leftLeg.position.set(-0.09, 0.24, 0);
  leftLeg.castShadow = true;
  root.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, suitMat);
  rightLeg.position.set(0.09, 0.24, 0);
  rightLeg.castShadow = true;
  root.add(rightLeg);

  // Torso inside bodyGroup (allows subtle breathing & torso twist)
  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.19, 0.38, 10, 16),
    suitMat
  );
  torso.position.set(0, 0.68, 0);
  torso.scale.set(1.06, 1, 0.74);
  torso.castShadow = true;
  bodyGroup.add(torso);

  // Shirt front
  const shirt = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.28, 0.14),
    shirtMat
  );
  shirt.position.set(0, 0.76, 0.08);
  bodyGroup.add(shirt);

  // Sky-Blue Tie for the Entrepreneur
  if (options.tieColor) {
    const tieMat = new THREE.MeshStandardMaterial({
      color: options.tieColor,
      emissive: options.tieColor,
      emissiveIntensity: 0.25,
      roughness: 0.2,
    });
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.24, 0.04), tieMat);
    tie.position.set(0, 0.72, 0.15);
    bodyGroup.add(tie);
  }

  // Articulated Head Group
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.12, 0);
  bodyGroup.add(headGroup);

  const headMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.165, 24, 24),
    skinMat
  );
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.024, 10, 10);
  const leftEye = new THREE.Mesh(eyeGeo, darkMat);
  leftEye.position.set(-0.055, 0.02, 0.148);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, darkMat);
  rightEye.position.set(0.055, 0.02, 0.148);
  headGroup.add(rightEye);

  if (options.hasGlasses) {
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });
    const glasses = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.025, 0.03),
      glassMat
    );
    glasses.position.set(0, 0.045, 0.155);
    headGroup.add(glasses);
  }

  // Hair or Hardhat
  if (options.hardhatColor) {
    const hatMat = new THREE.MeshStandardMaterial({
      color: options.hardhatColor,
      roughness: 0.2,
      metalness: 0.1,
    });
    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.18,
        20,
        14,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.55
      ),
      hatMat
    );
    helmet.position.set(0, 0.02, 0);
    headGroup.add(helmet);
  } else {
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.176,
        20,
        14,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.6
      ),
      darkMat
    );
    hair.position.set(0, 0.03, -0.015);
    hair.rotation.x = -0.15;
    headGroup.add(hair);
  }

  // Articulated Arms
  const armGeo = new THREE.CapsuleGeometry(0.058, 0.28, 8, 12);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.24, 0.85, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, suitMat);
  leftArmMesh.position.set(0, -0.14, 0);
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);
  bodyGroup.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.24, 0.85, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, suitMat);
  rightArmMesh.position.set(0, -0.14, 0);
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);
  bodyGroup.add(rightArm);

  return { root, bodyGroup, headGroup, rightArm, leftArm };
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

    // 1. High-Definition Anti-Aliased WebGL Renderer (Crisp & Smooth, NOT pixelated!)
    let renderer: THREE.WebGLRenderer;
    try {
      const isMobile = window.innerWidth < 768;
      renderer = new THREE.WebGLRenderer({
        antialias: true,
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
      renderer.toneMappingExposure = 1.12;
    } catch {
      setWebglSupported(false);
      return;
    }

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 2. Scene & True Isometric-Style Orthographic Camera
    const scene = new THREE.Scene();

    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    const frustumSize = 11.2;
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      -30,
      60
    );
    camera.position.set(14, 11.5, 14);
    camera.lookAt(0, 1.4, 0);

    // 3. Rich Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbae6fd, 1.4);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.95);
    dirLight.position.set(11, 18, 9);
    dirLight.castShadow = true;
    const shadowSize = window.innerWidth < 768 ? 1024 : 2048;
    dirLight.shadow.mapSize.width = shadowSize;
    dirLight.shadow.mapSize.height = shadowSize;
    const d = 10.5;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.05);
    rimLight.position.set(-12, 9, -10);
    scene.add(rimLight);

    const cardPointLight = new THREE.PointLight(0x38bdf8, 0, 14);
    scene.add(cardPointLight);

    // ========================================================================
    // 4. MATERIALS & GEOMETRIES REGISTRY
    // ========================================================================
    const materials: THREE.Material[] = [];
    const geometries: THREE.BufferGeometry[] = [];
    const mat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };
    const geo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };

    const matWhite = mat(
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.25,
        metalness: 0.05,
      })
    );
    const matIce = mat(
      new THREE.MeshStandardMaterial({
        color: 0xe0f2fe,
        roughness: 0.32,
        metalness: 0.05,
      })
    );
    const matSkyLight = mat(
      new THREE.MeshStandardMaterial({
        color: 0x7dd3fc,
        roughness: 0.25,
        metalness: 0.1,
      })
    );
    const matSkyGlow = mat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
        roughness: 0.2,
      })
    );
    const matRoyal = mat(
      new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.28,
        metalness: 0.15,
      })
    );
    const matNavy = mat(
      new THREE.MeshStandardMaterial({
        color: 0x0f243c,
        roughness: 0.3,
        metalness: 0.2,
      })
    );
    const matSlate = mat(
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.35,
        metalness: 0.35,
      })
    );
    const matRoad = mat(
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.55 })
    );
    const matEmerald = mat(
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.35,
        roughness: 0.22,
      })
    );
    const matGold = mat(
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xd97706,
        emissiveIntensity: 0.3,
        roughness: 0.22,
        metalness: 0.3,
      })
    );
    const matGlass = mat(
      new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.1,
        transmission: 0.4,
        transparent: true,
        opacity: 0.86,
      })
    );

    // ========================================================================
    // 5. ARCHITECTURAL DIORAMA ISLAND & ANIMATED ROAD
    // ========================================================================
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const bedrock = new THREE.Mesh(
      geo(new THREE.BoxGeometry(12.4, 0.4, 10.4)),
      matNavy
    );
    bedrock.position.set(0, -0.62, 0);
    worldGroup.add(bedrock);

    const circuitSlab = new THREE.Mesh(
      geo(new THREE.BoxGeometry(12.1, 0.18, 10.1)),
      matSkyGlow
    );
    circuitSlab.position.set(0, -0.33, 0);
    worldGroup.add(circuitSlab);

    const topSlab = new THREE.Mesh(
      geo(new THREE.BoxGeometry(11.8, 0.24, 9.8)),
      matWhite
    );
    topSlab.position.set(0, -0.12, 0);
    topSlab.receiveShadow = true;
    worldGroup.add(topSlab);

    // Subtle Grid Lines
    const grid = new THREE.GridHelper(11.4, 22, 0x93c5fd, 0xe2e8f0);
    grid.position.y = 0.01;
    worldGroup.add(grid);

    // Front Logistics Avenue
    const roadMesh = new THREE.Mesh(
      geo(new THREE.BoxGeometry(11.8, 0.03, 1.45)),
      matRoad
    );
    roadMesh.position.set(0, 0.015, 3.6);
    roadMesh.receiveShadow = true;
    worldGroup.add(roadMesh);

    const roadDashes: THREE.Mesh[] = [];
    const dashGeo = geo(new THREE.BoxGeometry(0.55, 0.04, 0.1));
    for (let i = -5; i <= 5; i++) {
      const dash = new THREE.Mesh(dashGeo, matSkyLight);
      dash.position.set(i * 1.05, 0.025, 3.6);
      worldGroup.add(dash);
      roadDashes.push(dash);
    }

    // Stylized Isometric Trees (Gently swaying in the breeze)
    const trees: THREE.Group[] = [];
    const treeCoords: [number, number][] = [
      [-5.1, 2.3],
      [-5.1, -3.8],
      [5.1, 2.3],
      [5.1, -3.8],
    ];
    treeCoords.forEach(([tx, tz]) => {
      const tGroup = new THREE.Group();
      tGroup.position.set(tx, 0, tz);
      const trunk = new THREE.Mesh(
        geo(new THREE.CylinderGeometry(0.08, 0.12, 0.5, 12)),
        matSlate
      );
      trunk.position.y = 0.25;
      tGroup.add(trunk);

      const foliage1 = new THREE.Mesh(
        geo(new THREE.SphereGeometry(0.42, 18, 18)),
        matEmerald
      );
      foliage1.position.y = 0.72;
      foliage1.castShadow = true;
      tGroup.add(foliage1);

      const foliage2 = new THREE.Mesh(
        geo(new THREE.SphereGeometry(0.28, 16, 16)),
        matSkyGlow
      );
      foliage2.position.set(0.12, 1.08, 0.08);
      foliage2.castShadow = true;
      tGroup.add(foliage2);

      worldGroup.add(tGroup);
      trees.push(tGroup);
    });

    // ========================================================================
    // 6. SCENE 1 (0% – 25%): INITIAL WORKSHOP + CONTINUOUSLY ANIMATED MACHINES
    // ========================================================================
    const s1Group = new THREE.Group();
    s1Group.position.set(-2.3, 0, -0.8);
    worldGroup.add(s1Group);

    const s1BackWall = new THREE.Mesh(
      geo(new THREE.BoxGeometry(3.6, 2.2, 0.22)),
      matWhite
    );
    s1BackWall.position.set(0, 1.1, -1.5);
    s1BackWall.castShadow = true;
    s1BackWall.receiveShadow = true;
    s1Group.add(s1BackWall);

    const s1SideWall = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.22, 2.2, 3.0)),
      matWhite
    );
    s1SideWall.position.set(-1.69, 1.1, -0.1);
    s1SideWall.castShadow = true;
    s1SideWall.receiveShadow = true;
    s1Group.add(s1SideWall);

    const s1Fascia = new THREE.Mesh(
      geo(new THREE.BoxGeometry(3.68, 0.32, 0.3)),
      matNavy
    );
    s1Fascia.position.set(0, 2.15, -1.48);
    s1Group.add(s1Fascia);

    // Spinning Rooftop Ventilation Turbine on Initial Workshop
    const s1Turbine = new THREE.Group();
    s1Turbine.position.set(-1.1, 2.38, -1.48);
    const blade1 = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.6, 0.06, 0.14)),
      matSkyGlow
    );
    const blade2 = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.14, 0.06, 0.6)),
      matSkyGlow
    );
    s1Turbine.add(blade1, blade2);
    s1Group.add(s1Turbine);

    // CNC Machine + Continuously Spinning Gear & Piston
    const cncMachine = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.95, 1.25, 0.95)),
      matSlate
    );
    cncMachine.position.set(-0.9, 0.625, -0.45);
    cncMachine.castShadow = true;
    s1Group.add(cncMachine);

    const cncPiston = new THREE.Mesh(
      geo(new THREE.CylinderGeometry(0.22, 0.22, 0.35, 20)),
      matSkyGlow
    );
    cncPiston.position.set(-0.9, 1.35, -0.45);
    s1Group.add(cncPiston);

    const cncGear = new THREE.Group();
    cncGear.position.set(-0.9, 0.72, 0.06);
    const g1 = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.55, 0.14, 0.08)),
      matGold
    );
    const g2 = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.14, 0.55, 0.08)),
      matGold
    );
    cncGear.add(g1, g2);
    s1Group.add(cncGear);

    // Initial Conveyor Belt + Continuously Flowing Product Packages
    const s1Belt = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.2, 0.36, 0.62)),
      matNavy
    );
    s1Belt.position.set(0.55, 0.18, -0.45);
    s1Belt.castShadow = true;
    s1Group.add(s1Belt);

    const prodGeo = geo(new THREE.BoxGeometry(0.34, 0.3, 0.34));
    const s1Packages: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const pkg = new THREE.Mesh(prodGeo, matSkyLight);
      pkg.position.set(0, 0.52, -0.45);
      pkg.castShadow = true;
      s1Group.add(pkg);
      s1Packages.push(pkg);
    }

    // THE ENTREPRENEUR PROTAGONIST (Consistent across all 4 scenes!)
    const entrepreneur = buildAnimatedCharacter({
      suitColor: 0x0f243c,
      shirtColor: 0xffffff,
      tieColor: 0x38bdf8,
      hasGlasses: true,
    });
    entrepreneur.root.position.set(-1.25, 0.02, 1.35);
    entrepreneur.root.rotation.y = Math.PI * 0.2;
    worldGroup.add(entrepreneur.root);

    // ========================================================================
    // 7. SCENE 2 (25% – 50%): 3D NEXT CARD, ORBITING COINS & RISING PARTICLES
    // ========================================================================
    const s2Group = new THREE.Group();
    worldGroup.add(s2Group);

    const cardTexture = createHDNextCardTexture();
    const cardMat = mat(
      new THREE.MeshPhysicalMaterial({
        map: cardTexture,
        roughness: 0.16,
        metalness: 0.3,
        clearcoat: 0.8,
        clearcoatRoughness: 0.12,
      })
    );
    const nextCardMesh = new THREE.Mesh(
      geo(new THREE.BoxGeometry(3.4, 0.1, 2.15)),
      cardMat
    );
    nextCardMesh.castShadow = true;
    s2Group.add(nextCardMesh);

    // Orbiting 3D Financial Coins & Rising Light Particles
    const coins: THREE.Mesh[] = [];
    const coinGeo = geo(new THREE.CylinderGeometry(0.22, 0.22, 0.07, 24));
    for (let c = 0; c < 8; c++) {
      const coin = new THREE.Mesh(
        coinGeo,
        c % 2 === 0 ? matGold : matEmerald
      );
      coin.rotation.x = Math.PI / 2;
      coin.castShadow = true;
      s2Group.add(coin);
      coins.push(coin);
    }

    // Rising Energy Orbs (Continuous vertical fountain of financial liquidity)
    const energyOrbs: THREE.Mesh[] = [];
    const orbGeo = geo(new THREE.SphereGeometry(0.09, 12, 12));
    for (let o = 0; o < 14; o++) {
      const orb = new THREE.Mesh(
        orbGeo,
        o % 3 === 0 ? matEmerald : matSkyGlow
      );
      s2Group.add(orb);
      energyOrbs.push(orb);
    }

    // Expanding Pulse Rings on the Factory Floor
    const pulseRings: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial }[] = [];
    const ringGeo = geo(new THREE.RingGeometry(1.1, 1.28, 48));
    for (let r = 0; r < 2; r++) {
      const rMat = mat(
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
        })
      );
      const rMesh = new THREE.Mesh(ringGeo, rMat);
      rMesh.rotation.x = -Math.PI / 2;
      rMesh.position.set(-0.6, 0.03, -0.4);
      worldGroup.add(rMesh);
      pulseRings.push({ mesh: rMesh, mat: rMat });
    }

    // ========================================================================
    // 8. SCENE 3 (50% – 75%): ANIMATED ROBOTS, FORKLIFT, CONVEYOR & TEAM
    // ========================================================================
    const s3Group = new THREE.Group();
    worldGroup.add(s3Group);

    const s3Modules: {
      obj: THREE.Object3D;
      targetY: number;
      startP: number;
      endP: number;
    }[] = [];

    const hall2Wall = new THREE.Mesh(
      geo(new THREE.BoxGeometry(4.6, 2.6, 0.24)),
      matWhite
    );
    hall2Wall.position.set(1.8, 1.3, -2.3);
    hall2Wall.castShadow = true;
    hall2Wall.receiveShadow = true;
    s3Group.add(hall2Wall);
    s3Modules.push({ obj: hall2Wall, targetY: 1.3, startP: 0.44, endP: 0.55 });

    const hall2Header = new THREE.Mesh(
      geo(new THREE.BoxGeometry(4.68, 0.36, 0.32)),
      matRoyal
    );
    hall2Header.position.set(1.8, 2.55, -2.28);
    s3Group.add(hall2Header);
    s3Modules.push({
      obj: hall2Header,
      targetY: 2.55,
      startP: 0.46,
      endP: 0.57,
    });

    // Extended High-Speed Conveyor Line
    const longBelt = new THREE.Mesh(
      geo(new THREE.BoxGeometry(4.8, 0.38, 0.68)),
      matNavy
    );
    longBelt.position.set(1.6, 0.19, -0.45);
    longBelt.castShadow = true;
    s3Group.add(longBelt);
    s3Modules.push({ obj: longBelt, targetY: 0.19, startP: 0.47, endP: 0.58 });

    // 3 Articulated Robotic Assembly Arms + Welding/Scanner Light Pulses
    const robots: {
      turret: THREE.Group;
      forearm: THREE.Group;
      spark: THREE.Mesh;
    }[] = [];
    for (let r = 0; r < 3; r++) {
      const rRoot = new THREE.Group();
      rRoot.position.set(0.1 + r * 1.45, 0, -1.3);

      const pedestal = new THREE.Mesh(
        geo(new THREE.CylinderGeometry(0.26, 0.32, 0.5, 20)),
        matSlate
      );
      pedestal.position.y = 0.25;
      pedestal.castShadow = true;
      rRoot.add(pedestal);

      const turret = new THREE.Group();
      turret.position.y = 0.5;
      const shoulder = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.22, 0.82, 0.22)),
        matSkyGlow
      );
      shoulder.position.y = 0.4;
      shoulder.castShadow = true;
      turret.add(shoulder);

      const forearm = new THREE.Group();
      forearm.position.set(0, 0.78, 0);
      const boom = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.18, 0.18, 0.82)),
        matGold
      );
      boom.position.set(0, 0, 0.35);
      boom.castShadow = true;
      forearm.add(boom);

      // Glowing laser/assembly head at tip of robot arm
      const spark = new THREE.Mesh(
        geo(new THREE.SphereGeometry(0.11, 14, 14)),
        matEmerald
      );
      spark.position.set(0, -0.14, 0.72);
      forearm.add(spark);

      turret.add(forearm);
      rRoot.add(turret);
      s3Group.add(rRoot);

      robots.push({ turret, forearm, spark });
      s3Modules.push({
        obj: rRoot,
        targetY: 0,
        startP: 0.49 + r * 0.04,
        endP: 0.61 + r * 0.04,
      });
    }

    // 5 Continuously Flowing Packages on the Extended Conveyor
    const s3Packages: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const pkg = new THREE.Mesh(
        prodGeo,
        i % 2 === 0 ? matSkyGlow : matEmerald
      );
      pkg.position.set(0, 0.54, -0.45);
      pkg.castShadow = true;
      s3Group.add(pkg);
      s3Packages.push(pkg);
    }

    // High-Bay Storage Racks (Right Wing)
    const warehouseGroup = new THREE.Group();
    warehouseGroup.position.set(3.8, 0, 1.0);
    for (let lvl = 0; lvl < 3; lvl++) {
      const shelf = new THREE.Mesh(
        geo(new THREE.BoxGeometry(1.9, 0.08, 0.92)),
        matSlate
      );
      shelf.position.y = 0.45 + lvl * 0.68;
      shelf.castShadow = true;
      warehouseGroup.add(shelf);

      for (let c = 0; c < 2; c++) {
        const crate = new THREE.Mesh(
          geo(new THREE.BoxGeometry(0.58, 0.44, 0.58)),
          lvl === 2 ? matEmerald : lvl === 1 ? matSkyLight : matGold
        );
        crate.position.set(-0.45 + c * 0.9, 0.71 + lvl * 0.68, 0);
        crate.castShadow = true;
        warehouseGroup.add(crate);
      }
    }
    s3Group.add(warehouseGroup);
    s3Modules.push({
      obj: warehouseGroup,
      targetY: 0,
      startP: 0.55,
      endP: 0.67,
    });

    // Autonomous AGV Forklift ("Montacargas") shuttle moving between belt & warehouse!
    const agvForklift = new THREE.Group();
    agvForklift.position.set(2.2, 0.04, 1.0);
    const agvBase = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.75, 0.22, 0.55)),
      matGold
    );
    agvBase.position.y = 0.11;
    agvBase.castShadow = true;
    agvForklift.add(agvBase);

    const agvCargo = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.45, 0.36, 0.42)),
      matSkyGlow
    );
    agvCargo.position.y = 0.4;
    agvCargo.castShadow = true;
    agvForklift.add(agvCargo);
    s3Group.add(agvForklift);

    // 3 Animated Operators in Sky-Blue Hardhats
    const operators: ReturnType<typeof buildAnimatedCharacter>[] = [];
    const opCoords: [number, number, number][] = [
      [0.45, 0.42, Math.PI],
      [1.85, 0.42, Math.PI * 0.92],
      [2.65, 1.65, -Math.PI * 0.35],
    ];
    opCoords.forEach(([ox, oz, rot], idx) => {
      const op = buildAnimatedCharacter({
        suitColor: 0x1e293b,
        shirtColor: 0x38bdf8,
        hardhatColor: 0x38bdf8,
      });
      op.root.position.set(ox, 0.02, oz);
      op.root.rotation.y = rot;
      s3Group.add(op.root);
      operators.push(op);
      s3Modules.push({
        obj: op.root,
        targetY: 0.02,
        startP: 0.57 + idx * 0.03,
        endP: 0.69 + idx * 0.03,
      });
    });

    // ========================================================================
    // 9. SCENE 4 (75% – 100%): CONSOLIDATED TOWER, MOVING TRUCK & GROWTH BARS
    // ========================================================================
    const s4Group = new THREE.Group();
    worldGroup.add(s4Group);

    const s4Modules: {
      obj: THREE.Object3D;
      targetY: number;
      startP: number;
      endP: number;
    }[] = [];

    // Glass Executive Tower
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-2.5, 0, -2.8);

    const towerCore = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.9, 4.7, 2.2)),
      matNavy
    );
    towerCore.position.y = 2.35;
    towerCore.castShadow = true;
    towerCore.receiveShadow = true;
    towerGroup.add(towerCore);

    const towerGlass = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.7, 4.1, 0.12)),
      matGlass
    );
    towerGlass.position.set(0, 2.35, 1.12);
    towerGroup.add(towerGlass);

    for (let f = 0; f < 4; f++) {
      const bar = new THREE.Mesh(
        geo(new THREE.BoxGeometry(2.74, 0.07, 0.16)),
        matSkyGlow
      );
      bar.position.set(0, 0.95 + f * 0.92, 1.13);
      towerGroup.add(bar);
    }

    // Rotating Rooftop Radar / Beacon on Executive Tower
    const towerBeacon = new THREE.Group();
    towerBeacon.position.set(0, 4.85, 0);
    const beaconDish = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.9, 0.18, 0.22)),
      matSkyGlow
    );
    towerBeacon.add(beaconDish);
    towerGroup.add(towerBeacon);

    s4Group.add(towerGroup);
    s4Modules.push({ obj: towerGroup, targetY: 0, startP: 0.72, endP: 0.85 });

    // Executive Command Balcony
    const balconyGroup = new THREE.Group();
    balconyGroup.position.set(-1.25, 0, 1.55);
    const balconyBase = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.1, 0.52, 1.3)),
      matWhite
    );
    balconyBase.position.y = 0.26;
    balconyBase.castShadow = true;
    balconyGroup.add(balconyBase);

    const balconyRim = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.16, 0.1, 1.36)),
      matSkyGlow
    );
    balconyRim.position.y = 0.55;
    balconyGroup.add(balconyRim);

    s4Group.add(balconyGroup);
    s4Modules.push({
      obj: balconyGroup,
      targetY: 0,
      startP: 0.74,
      endP: 0.86,
    });

    // Animated Logistics Delivery Truck on Front Avenue
    const truckGroup = new THREE.Group();
    truckGroup.position.set(1.5, 0.03, 3.58);

    const trailer = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.2, 1.02, 0.9)),
      matWhite
    );
    trailer.position.set(0, 0.64, 0);
    trailer.castShadow = true;
    truckGroup.add(trailer);

    const trailerStripe = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.24, 0.2, 0.92)),
      matSkyGlow
    );
    trailerStripe.position.set(0, 0.7, 0);
    truckGroup.add(trailerStripe);

    const cab = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.82, 0.82, 0.86)),
      matNavy
    );
    cab.position.set(-1.55, 0.54, 0);
    cab.castShadow = true;
    truckGroup.add(cab);

    s4Group.add(truckGroup);

    // 4 Ascending Financial Growth Bars (With Gentle Pulse)
    const growthBars: THREE.Mesh[] = [];
    for (let b = 0; b < 4; b++) {
      const bh = 1.15 + b * 0.82;
      const bar = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.52, bh, 0.52)),
        b === 3 ? matEmerald : b === 2 ? matSkyGlow : matRoyal
      );
      bar.position.set(3.1 + b * 0.7, bh / 2, -2.5);
      bar.castShadow = true;
      s4Group.add(bar);
      growthBars.push(bar);
    }

    // ========================================================================
    // 10. INTERACTIVE MOUSE PARALLAX & RESIZE HANDLER
    // ========================================================================
    let mouseX = 0;
    let mouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * 2;
    };
    container.addEventListener("mousemove", handlePointerMove);

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
      const asp = w / h;
      const fSize = w < 640 ? 13.5 : w < 1024 ? 12.0 : 11.0;
      camera.left = (-fSize * asp) / 2;
      camera.right = (fSize * asp) / 2;
      camera.top = fSize / 2;
      camera.bottom = -fSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // ========================================================================
    // 11. CONTINUOUS + SCROLL-SYNCHRONIZED ANIMATION LOOP
    // ========================================================================
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = clock.getElapsedTime();
      const p = clamp(progressRef.current, 0, 1);
      const isReduced = reducedMotionRef.current;
      const animTime = isReduced ? p * 10 : t;

      smoothMouseX += (mouseX - smoothMouseX) * 0.08;
      smoothMouseY += (mouseY - smoothMouseY) * 0.08;

      const s2Enter = smoothstep(0.18, 0.34, p);
      const s2Exit = smoothstep(0.52, 0.66, p);
      const s3Progress = smoothstep(0.44, 0.74, p);
      const s4Progress = smoothstep(0.7, 0.94, p);

      // ----------------------------------------------------------------------
      // 1. CAMERA ORBIT + INTERACTIVE MOUSE PARALLAX
      // ----------------------------------------------------------------------
      camera.zoom = lerp(1.18, 0.98, smoothstep(0.2, 0.88, p));
      const panX = lerp(-1.15, 0.35, smoothstep(0.22, 0.82, p));
      const panY = lerp(1.0, 1.5, smoothstep(0.35, 0.9, p));
      const azimuth = lerp(0.75, 0.84, p) + smoothMouseX * 0.06;
      camera.position.set(
        Math.cos(azimuth) * 18,
        14.2 - smoothMouseY * 0.6,
        Math.sin(azimuth) * 18
      );
      camera.lookAt(panX, panY, 0);
      camera.updateProjectionMatrix();

      // ----------------------------------------------------------------------
      // 2. CONTINUOUS ENVIRONMENTAL & SCENE 1 ANIMATIONS
      // ----------------------------------------------------------------------
      // Trees gently swaying
      trees.forEach((tr, i) => {
        tr.rotation.z = Math.sin(animTime * 2.2 + i) * 0.04;
      });

      // Road lane dashes scrolling smoothly to give sense of active logistics
      roadDashes.forEach((dash, i) => {
        const flow = ((i * 1.05 + animTime * 1.2) % 11.55) - 5.775;
        dash.position.x = flow;
      });

      // Workshop rooftop turbine & CNC machine gear + piston continuously working!
      s1Turbine.rotation.y = animTime * 4.5;
      cncGear.rotation.z = -animTime * 3.8;
      cncPiston.position.y = 1.32 + Math.sin(animTime * 8) * 0.06;

      // Initial Conveyor Packages continuously flowing
      s1Packages.forEach((pkg, idx) => {
        const flow = (animTime * 0.55 + idx / s1Packages.length) % 1;
        pkg.position.x = -0.35 + flow * 1.85;
        pkg.scale.setScalar(
          Math.sin(flow * Math.PI) > 0.15
            ? 1
            : Math.max(0.01, Math.sin(flow * Math.PI) * 6)
        );
      });

      // ----------------------------------------------------------------------
      // 3. SCENE 2: 3D NEXT CARD, ORBITING COINS, PULSE RINGS & FOUNTAIN ORBS
      // ----------------------------------------------------------------------
      s2Group.visible = s2Enter > 0.01;
      const cardFloat = Math.sin(animTime * 2.6) * 0.16;
      const cardX = lerp(-0.5, -2.5, s4Progress);
      const cardY =
        lerp(6.8, 3.25, easeOutBack(s2Enter)) + s4Progress * 2.6 + cardFloat;
      const cardZ = lerp(-0.4, -2.8, s4Progress);
      nextCardMesh.position.set(cardX, cardY, cardZ);
      nextCardMesh.rotation.set(
        lerp(0.45, 0.25, s2Enter) + Math.cos(animTime * 1.8) * 0.05,
        lerp(-0.35, 0.2, p) + Math.sin(animTime * 1.5) * 0.12,
        lerp(-0.15, -0.05, s2Enter)
      );
      const cScale = lerp(0.01, 1, s2Enter) * lerp(1, 0.78, s4Progress);
      nextCardMesh.scale.setScalar(Math.max(0.001, cScale));

      // Orbiting 3D Coins spinning around the NEXT Card
      const coinVis = clamp(s2Enter * (1 - s2Exit * 0.75), 0, 1);
      coins.forEach((coin, i) => {
        const angle = (i / coins.length) * Math.PI * 2 + animTime * 1.8;
        const radius = 2.15;
        coin.position.set(
          cardX + Math.cos(angle) * radius,
          cardY + Math.sin(angle * 2 + animTime) * 0.35,
          cardZ + Math.sin(angle) * radius * 0.75
        );
        coin.rotation.z = animTime * 3 + i;
        coin.scale.setScalar(Math.max(0.001, coinVis));
      });

      // Rising Liquidity Fountain Orbs
      energyOrbs.forEach((orb, i) => {
        const cycle = (animTime * 0.65 + i * 0.19) % 1;
        const angle = i * 1.7 + animTime * 0.8;
        const rad = 0.6 + (i % 3) * 0.45;
        orb.position.set(
          cardX + Math.cos(angle) * rad,
          0.2 + cycle * 3.4,
          cardZ + Math.sin(angle) * rad
        );
        const fade = Math.sin(cycle * Math.PI) * coinVis;
        orb.scale.setScalar(Math.max(0.001, fade));
      });

      // Floor Pulse Rings expanding outward
      pulseRings.forEach((pr, idx) => {
        const ringCycle = (animTime * 0.55 + idx * 0.5) % 1;
        pr.mesh.scale.setScalar(0.5 + ringCycle * 2.2);
        pr.mat.opacity = (1 - ringCycle) * coinVis * 0.65;
      });

      cardPointLight.position.set(cardX, cardY - 0.5, cardZ);
      cardPointLight.intensity = s2Enter * (1 - s2Exit * 0.4) * 5.0;

      // ----------------------------------------------------------------------
      // 4. SCENE 3: ANIMATED ROBOTS, EXTENDED BELT, AGV FORKLIFT & OPERATORS
      // ----------------------------------------------------------------------
      s3Group.visible = p > 0.42;
      s3Modules.forEach((m) => {
        const localT = smoothstep(m.startP, m.endP, p);
        const eased = easeOutBack(localT);
        m.obj.visible = localT > 0.01;
        m.obj.scale.setScalar(Math.max(0.001, localT));
        m.obj.position.y = m.targetY + (1 - eased) * 2.8;
      });

      // Extended Conveyor Packages continuously flowing
      s3Packages.forEach((pkg, idx) => {
        pkg.visible = s3Progress > 0.2;
        const flow = (animTime * 0.42 + idx / s3Packages.length) % 1;
        pkg.position.x = -0.5 + flow * 4.2;
      });

      // Robotic Arms actively swiveling, dipping down to assemble, and flashing their emerald tip!
      robots.forEach((rob, idx) => {
        const phase = animTime * 3.2 + idx * 2.1;
        rob.turret.rotation.y = Math.sin(phase) * 0.65;
        rob.forearm.rotation.x = Math.max(0, Math.sin(phase * 2)) * 0.42;
        const flash = Math.pow(Math.max(0, Math.sin(phase * 2)), 4);
        rob.spark.scale.setScalar(0.8 + flash * 1.1);
      });

      // Autonomous AGV Forklift gliding back and forth between the conveyor and storage racks
      agvForklift.visible = s3Progress > 0.35;
      const agvCycle = (Math.sin(animTime * 1.4) + 1) * 0.5;
      agvForklift.position.x = lerp(1.1, 2.75, agvCycle);
      agvForklift.position.z = lerp(0.55, 1.15, agvCycle);
      agvForklift.rotation.y = Math.cos(animTime * 1.4) * 0.25;

      // Operators actively moving their arms and heads while working
      operators.forEach((op, idx) => {
        const wPhase = animTime * 3.5 + idx * 1.7;
        op.rightArm.rotation.x = -0.5 + Math.sin(wPhase) * 0.35;
        op.leftArm.rotation.x = -0.3 - Math.sin(wPhase) * 0.25;
        op.headGroup.rotation.y = Math.sin(wPhase * 0.6) * 0.28;
      });

      // ----------------------------------------------------------------------
      // 5. SCENE 4: CONSOLIDATED TOWER, BEACON, MOVING TRUCK & GROWTH BARS
      // ----------------------------------------------------------------------
      s4Group.visible = p > 0.68;
      s4Modules.forEach((m) => {
        const localT = smoothstep(m.startP, m.endP, p);
        const eased = easeOutBack(localT);
        m.obj.visible = localT > 0.01;
        m.obj.scale.setScalar(Math.max(0.001, localT));
        m.obj.position.y = m.targetY + (1 - eased) * 3.2;
      });

      towerBeacon.rotation.y = animTime * 2.2;

      // Delivery Truck glides into loading position and idles with subtle suspension bounce
      truckGroup.visible = s4Progress > 0.02;
      truckGroup.position.x =
        lerp(6.8, 1.5, easeOutBack(s4Progress)) +
        Math.sin(animTime * 1.8) * 0.18;
      truckGroup.position.y = 0.03 + Math.abs(Math.sin(animTime * 12)) * 0.015;

      growthBars.forEach((bar, idx) => {
        const bT = smoothstep(0.73 + idx * 0.04, 0.92 + idx * 0.02, p);
        bar.visible = bT > 0.01;
        const pulse = 1 + Math.sin(animTime * 3 + idx) * 0.04;
        const finalScale = Math.max(0.001, bT * pulse);
        bar.scale.y = finalScale;
        bar.position.y = ((1.15 + idx * 0.82) * finalScale) / 2;
      });

      // ----------------------------------------------------------------------
      // 6. ENTREPRENEUR PROTAGONIST LIVELY ANIMATION ACROSS ALL 4 SCENES
      // ----------------------------------------------------------------------
      const entY = lerp(0.02, 0.56, smoothstep(0.75, 0.87, p));
      const entX = lerp(lerp(-1.25, 0.0, s3Progress), -1.25, s4Progress);
      const entZ = lerp(1.35, 1.55, s4Progress);
      entrepreneur.root.position.set(entX, entY, entZ);
      entrepreneur.root.rotation.y = lerp(
        Math.PI * 0.2,
        Math.PI * 0.26,
        s4Progress
      );

      // Lively breathing, head looking around, and enthusiastic arm gestures
      entrepreneur.bodyGroup.position.y = Math.sin(animTime * 3.2) * 0.02;
      entrepreneur.headGroup.rotation.y = Math.sin(animTime * 1.6) * 0.22;
      entrepreneur.headGroup.rotation.x =
        s2Enter > 0.2 && s3Progress < 0.5 ? -0.22 : 0; // Looks up at the floating NEXT Card in Scene 2!

      const gestureWeight = clamp(
        s2Enter * (1 - s3Progress * 0.5) + s4Progress,
        0.15,
        1
      );
      entrepreneur.rightArm.rotation.x =
        lerp(-0.2, -1.15, gestureWeight) + Math.sin(animTime * 4.5) * 0.18;
      entrepreneur.rightArm.rotation.z =
        -0.2 + Math.cos(animTime * 4.5) * 0.1;
      entrepreneur.leftArm.rotation.x = Math.sin(animTime * 2.8) * 0.15;

      renderer.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handlePointerMove);
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
      aria-label="Escena interactiva 3D de alta definición del crecimiento industrial con NEXT"
    />
  );
}
