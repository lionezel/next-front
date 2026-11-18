"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type PixelResolutionMode = "retro" | "hd-pixel" | "voxel-crisp";

export interface NextIndustrialGrowth3DProps {
  /** Normalized scroll progress from 0.0 to 1.0 */
  progress: number;
  /** Active scene index (0, 1, 2, 3) */
  activeScene: number;
  /** Reduced motion preference */
  reducedMotion?: boolean;
  /** Resolution mode */
  pixelMode?: PixelResolutionMode;
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
 * Creates a smooth 3D Rounded Box Geometry (Soft clay/beveled aesthetic, zero harsh square edges!)
 */
function createRoundedBox(
  width: number,
  height: number,
  depth: number,
  radius: number = 0.08,
  smoothness: number = 5
): THREE.BufferGeometry {
  const r = Math.min(radius, width * 0.35, height * 0.35, depth * 0.35);
  const w = Math.max(0.01, width - r * 2);
  const h = Math.max(0.01, height - r * 2);
  const d = Math.max(0.01, depth - r * 2);

  const shape = new THREE.Shape();
  const hw = w / 2;
  const hh = h / 2;
  shape.moveTo(-hw, -hh + r);
  shape.lineTo(-hw, hh - r);
  shape.quadraticCurveTo(-hw, hh, -hw + r, hh);
  shape.lineTo(hw - r, hh);
  shape.quadraticCurveTo(hw, hh, hw, hh - r);
  shape.lineTo(hw, -hh + r);
  shape.quadraticCurveTo(hw, -hh, hw - r, -hh);
  shape.lineTo(-hw + r, -hh);
  shape.quadraticCurveTo(-hw, -hh, -hw, -hh + r);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: true,
    bevelSegments: smoothness,
    steps: 1,
    bevelSize: r,
    bevelThickness: r,
    curveSegments: smoothness * 2,
  });

  geom.center();
  geom.computeVertexNormals();
  return geom;
}

/**
 * High-Resolution CanvasTexture with smooth curves for the 3D NEXT Corporate Card
 */
function createSmoothCardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 640;
  const ctx = canvas.getContext("2d")!;

  // Smooth Deep Navy to Sky-Blue Gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 640);
  grad.addColorStop(0, "#081C45");
  grad.addColorStop(0.55, "#0D3270");
  grad.addColorStop(1, "#0284C7");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, 1024, 640, 64);
  ctx.fill();

  // Soft Curved Light Wave
  ctx.fillStyle = "rgba(125, 211, 252, 0.16)";
  ctx.beginPath();
  ctx.arc(820, 120, 420, 0, Math.PI * 2);
  ctx.fill();

  // Rounded Inner Rim
  ctx.strokeStyle = "rgba(125, 211, 252, 0.55)";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.roundRect(24, 24, 976, 592, 48);
  ctx.stroke();

  // Rounded Gold EMV Chip
  ctx.fillStyle = "#F59E0B";
  ctx.beginPath();
  ctx.roundRect(88, 215, 136, 102, 24);
  ctx.fill();
  ctx.fillStyle = "#FDE68A";
  ctx.beginPath();
  ctx.roundRect(102, 229, 108, 74, 16);
  ctx.fill();

  // Smooth "NE➔XT" Logo
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "900 104px system-ui, -apple-system, sans-serif";
  ctx.fillText("NE", 268, 305);
  ctx.fillStyle = "#38BDF8";
  ctx.fillText("➔", 418, 303);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("XT", 522, 305);

  // Subtitle
  ctx.fillStyle = "#BAE6FD";
  ctx.font = "700 30px system-ui, -apple-system, sans-serif";
  ctx.fillText("CRÉDITO EMPRESARIAL", 88, 465);

  // Pill Dots
  ctx.fillStyle = "#FFFFFF";
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.roundRect(88 + i * 125, 505, 92, 18, 9);
    ctx.fill();
  }

  // Circular Mastercard-style Dual Rings Bottom Right
  ctx.fillStyle = "#38BDF8";
  ctx.beginPath();
  ctx.arc(820, 500, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#10B981";
  ctx.globalAlpha = 0.88;
  ctx.beginPath();
  ctx.arc(888, 500, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Builds an Organic, Smooth, Rounded 3D Character (Capsule & Sphere geometry — NOT boxy!)
 */
function buildSmoothCharacter(options: {
  suitColor: number;
  shirtColor: number;
  tieColor?: number;
  hardhatColor?: number;
  hasGlasses?: boolean;
}): {
  root: THREE.Group;
  rightArm: THREE.Group;
  leftArm: THREE.Group;
  headGroup: THREE.Group;
} {
  const root = new THREE.Group();

  const suitMat = new THREE.MeshStandardMaterial({
    color: options.suitColor,
    roughness: 0.32,
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

  // Smooth Capsule Legs & Rounded Shoes
  const legGeo = new THREE.CapsuleGeometry(0.068, 0.24, 10, 16);
  const shoeGeo = new THREE.SphereGeometry(0.082, 16, 12);

  const leftLeg = new THREE.Mesh(legGeo, suitMat);
  leftLeg.position.set(-0.085, 0.22, 0);
  leftLeg.castShadow = true;
  root.add(leftLeg);

  const leftShoe = new THREE.Mesh(shoeGeo, darkMat);
  leftShoe.scale.set(0.95, 0.65, 1.35);
  leftShoe.position.set(-0.085, 0.05, 0.03);
  root.add(leftShoe);

  const rightLeg = new THREE.Mesh(legGeo, suitMat);
  rightLeg.position.set(0.085, 0.22, 0);
  rightLeg.castShadow = true;
  root.add(rightLeg);

  const rightShoe = new THREE.Mesh(shoeGeo, darkMat);
  rightShoe.scale.set(0.95, 0.65, 1.35);
  rightShoe.position.set(0.085, 0.05, 0.03);
  root.add(rightShoe);

  // Smooth Sculpted Capsule Torso
  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.165, 0.28, 14, 24),
    suitMat
  );
  torso.position.set(0, 0.58, 0);
  torso.scale.set(1.08, 1, 0.78);
  torso.castShadow = true;
  root.add(torso);

  // Rounded Shirt & Sky-Blue Tie
  const shirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.06, 0.24, 16),
    shirtMat
  );
  shirt.position.set(0, 0.65, 0.07);
  root.add(shirt);

  if (options.tieColor) {
    const tieMat = new THREE.MeshStandardMaterial({
      color: options.tieColor,
      emissive: options.tieColor,
      emissiveIntensity: 0.28,
      roughness: 0.22,
    });
    const tie = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.026, 0.18, 8, 12),
      tieMat
    );
    tie.position.set(0, 0.6, 0.135);
    root.add(tie);
  }

  // Smooth Spherical Head Group
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.96, 0);
  root.add(headGroup);

  const headSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.165, 28, 28),
    skinMat
  );
  headSphere.castShadow = true;
  headGroup.add(headSphere);

  // Round Eyes
  const eyeGeo = new THREE.SphereGeometry(0.024, 12, 12);
  const leftEye = new THREE.Mesh(eyeGeo, darkMat);
  leftEye.position.set(-0.058, 0.02, 0.148);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, darkMat);
  rightEye.position.set(0.058, 0.02, 0.148);
  headGroup.add(rightEye);

  // Smooth Rounded Glasses
  if (options.hasGlasses) {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
    });
    const leftLensRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.042, 0.008, 10, 24),
      frameMat
    );
    leftLensRim.position.set(-0.058, 0.025, 0.155);
    headGroup.add(leftLensRim);

    const rightLensRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.042, 0.008, 10, 24),
      frameMat
    );
    rightLensRim.position.set(0.058, 0.025, 0.155);
    headGroup.add(rightLensRim);
  }

  // Smooth Dome Hardhat or Sculpted Hair
  if (options.hardhatColor) {
    const hatMat = new THREE.MeshStandardMaterial({
      color: options.hardhatColor,
      roughness: 0.2,
    });
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.18,
        24,
        16,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.54
      ),
      hatMat
    );
    dome.position.set(0, 0.02, 0);
    headGroup.add(dome);
  } else {
    const hairDome = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.176,
        24,
        18,
        0,
        Math.PI * 2,
        0,
        Math.PI * 0.62
      ),
      darkMat
    );
    hairDome.position.set(0, 0.03, -0.015);
    hairDome.rotation.x = -0.18;
    headGroup.add(hairDome);
  }

  // Smooth Capsule Arms & Spherical Hands
  const armGeo = new THREE.CapsuleGeometry(0.052, 0.24, 10, 16);
  const handGeo = new THREE.SphereGeometry(0.052, 14, 14);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.22, 0.72, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, suitMat);
  leftArmMesh.position.set(0, -0.12, 0);
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.set(0, -0.26, 0);
  leftArm.add(leftHand);
  root.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.22, 0.72, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, suitMat);
  rightArmMesh.position.set(0, -0.12, 0);
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.set(0, -0.26, 0);
  rightArm.add(rightHand);
  root.add(rightArm);

  return { root, rightArm, leftArm, headGroup };
}

/**
 * Helper to create an Organic Lush Tree with Smooth Spherical Canopy & Cylindrical Trunk
 */
function createOrganicTree(
  trunkMat: THREE.Material,
  leafMat1: THREE.Material,
  leafMat2: THREE.Material
): THREE.Group {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.13, 0.55, 16),
    trunkMat
  );
  trunk.position.y = 0.275;
  trunk.castShadow = true;
  tree.add(trunk);

  const crown1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 24, 24),
    leafMat1
  );
  crown1.position.set(0, 0.75, 0);
  crown1.castShadow = true;
  tree.add(crown1);

  const crown2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.32, 22, 22),
    leafMat2
  );
  crown2.position.set(0.16, 1.05, 0.1);
  crown2.castShadow = true;
  tree.add(crown2);

  const crown3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.26, 20, 20),
    leafMat1
  );
  crown3.position.set(-0.14, 1.15, -0.08);
  crown3.castShadow = true;
  tree.add(crown3);

  return tree;
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
      renderer.toneMappingExposure = 1.1;
    } catch {
      setWebglSupported(false);
      return;
    }

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    const frustumSize = 11.5;
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

    // Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbae6fd, 1.45);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(10, 18, 8);
    dirLight.castShadow = true;
    const shadowRes = window.innerWidth < 768 ? 1024 : 2048;
    dirLight.shadow.mapSize.width = shadowRes;
    dirLight.shadow.mapSize.height = shadowRes;
    const d = 10.5;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(-12, 10, -10);
    scene.add(rimLight);

    const cardPointLight = new THREE.PointLight(0x38bdf8, 0, 14);
    scene.add(cardPointLight);

    // ========================================================================
    // MATERIALS & ROUNDED GEOMETRIES
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
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.26 })
    );
    const matIce = mat(
      new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.32 })
    );
    const matSkyLight = mat(
      new THREE.MeshStandardMaterial({ color: 0x7dd3fc, roughness: 0.25 })
    );
    const matSky = mat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.25,
        roughness: 0.2,
      })
    );
    const matRoyal = mat(
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.26 })
    );
    const matNavy = mat(
      new THREE.MeshStandardMaterial({ color: 0x0f243c, roughness: 0.3 })
    );
    const matSlate = mat(
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.35 })
    );
    const matRoad = mat(
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 })
    );
    const matEmerald = mat(
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.3,
        roughness: 0.25,
      })
    );
    const matGold = mat(
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xd97706,
        emissiveIntensity: 0.35,
        roughness: 0.22,
      })
    );
    const matLeaf1 = mat(
      new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.4 })
    );
    const matLeaf2 = mat(
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 })
    );
    const matTrunk = mat(
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
    );

    // ========================================================================
    // ROUNDED SQUIRCLE DIORAMA ISLAND BASE
    // ========================================================================
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Rounded Squircle Island Layers (Rotated so flat face is horizontal)
    const bedrockGeo = geo(createRoundedBox(12.4, 10.4, 0.45, 0.85, 6));
    bedrockGeo.rotateX(Math.PI / 2);
    const bedrock = new THREE.Mesh(bedrockGeo, matNavy);
    bedrock.position.set(0, -0.68, 0);
    worldGroup.add(bedrock);

    const circuitGeo = geo(createRoundedBox(12.1, 10.1, 0.22, 0.8, 6));
    circuitGeo.rotateX(Math.PI / 2);
    const circuitSlab = new THREE.Mesh(circuitGeo, matSky);
    circuitSlab.position.set(0, -0.35, 0);
    worldGroup.add(circuitSlab);

    const topSlabGeo = geo(createRoundedBox(11.8, 9.8, 0.26, 0.75, 6));
    topSlabGeo.rotateX(Math.PI / 2);
    const topSlab = new THREE.Mesh(topSlabGeo, matWhite);
    topSlab.position.set(0, -0.13, 0);
    topSlab.receiveShadow = true;
    worldGroup.add(topSlab);

    // Rounded Avenue Strip
    const roadGeo = geo(createRoundedBox(11.2, 1.45, 0.04, 0.35, 4));
    roadGeo.rotateX(Math.PI / 2);
    const roadMesh = new THREE.Mesh(roadGeo, matRoad);
    roadMesh.position.set(0, 0.02, 3.6);
    roadMesh.receiveShadow = true;
    worldGroup.add(roadMesh);

    const dashGeo = geo(new THREE.CapsuleGeometry(0.05, 0.42, 6, 12));
    dashGeo.rotateZ(Math.PI / 2);
    for (let i = -5; i <= 5; i++) {
      const dash = new THREE.Mesh(dashGeo, matWhite);
      dash.position.set(i * 1.0, 0.03, 3.6);
      worldGroup.add(dash);
    }

    // Soft Circular Plaza Dots instead of harsh square grid tiles
    const dotGeo = geo(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 20));
    for (let gx = -4; gx <= 4; gx += 2) {
      for (let gz = -3; gz <= 2; gz += 2) {
        const dot = new THREE.Mesh(dotGeo, matIce);
        dot.position.set(gx * 1.0, 0.01, gz * 1.0);
        dot.receiveShadow = true;
        worldGroup.add(dot);
      }
    }

    // 4 Organic Spherical Trees
    const treeCoords: [number, number][] = [
      [-5.0, 2.2],
      [-5.0, -3.7],
      [5.0, 2.2],
      [5.0, -3.7],
    ];
    treeCoords.forEach(([tx, tz]) => {
      const t = createOrganicTree(matTrunk, matLeaf1, matLeaf2);
      t.position.set(tx, 0, tz);
      worldGroup.add(t);
    });

    // ========================================================================
    // SCENE 1 (0% – 25%): ROUNDED INITIAL MANUFACTURING WORKSHOP
    // ========================================================================
    const s1Group = new THREE.Group();
    s1Group.position.set(-2.3, 0, -0.8);
    worldGroup.add(s1Group);

    const s1BackWall = new THREE.Mesh(
      geo(createRoundedBox(3.6, 2.2, 0.32, 0.12, 5)),
      matWhite
    );
    s1BackWall.position.set(0, 1.1, -1.5);
    s1BackWall.castShadow = true;
    s1BackWall.receiveShadow = true;
    s1Group.add(s1BackWall);

    const s1SideWall = new THREE.Mesh(
      geo(createRoundedBox(0.32, 2.2, 3.0, 0.12, 5)),
      matWhite
    );
    s1SideWall.position.set(-1.65, 1.1, -0.15);
    s1SideWall.castShadow = true;
    s1SideWall.receiveShadow = true;
    s1Group.add(s1SideWall);

    const s1RoofRim = new THREE.Mesh(
      geo(createRoundedBox(3.72, 0.36, 0.44, 0.14, 5)),
      matNavy
    );
    s1RoofRim.position.set(0, 2.25, -1.48);
    s1Group.add(s1RoofRim);

    const s1SideRim = new THREE.Mesh(
      geo(createRoundedBox(0.44, 0.36, 3.12, 0.14, 5)),
      matNavy
    );
    s1SideRim.position.set(-1.65, 2.25, -0.15);
    s1Group.add(s1SideRim);

    // Porthole / Rounded Windows on Initial Workshop Wall
    const winGeo = geo(createRoundedBox(0.65, 0.65, 0.38, 0.18, 5));
    for (let w = 0; w < 3; w++) {
      const win = new THREE.Mesh(winGeo, matSky);
      win.position.set(-0.95 + w * 0.95, 1.4, -1.5);
      s1Group.add(win);
    }

    // Rounded CNC Machine + Circular Spinning Gear
    const cncBody = new THREE.Mesh(
      geo(createRoundedBox(0.96, 1.25, 0.96, 0.16, 5)),
      matSlate
    );
    cncBody.position.set(-0.9, 0.625, -0.45);
    cncBody.castShadow = true;
    s1Group.add(cncBody);

    const cncDome = new THREE.Mesh(
      geo(new THREE.CylinderGeometry(0.36, 0.42, 0.25, 24)),
      matRoyal
    );
    cncDome.position.set(-0.9, 1.32, -0.45);
    s1Group.add(cncDome);

    // Circular Gear Wheel
    const voxelGear = new THREE.Group();
    voxelGear.position.set(-0.9, 0.75, 0.08);
    const gearRing = new THREE.Mesh(
      geo(new THREE.TorusGeometry(0.2, 0.055, 12, 24)),
      matGold
    );
    const gearSpoke1 = new THREE.Mesh(
      geo(new THREE.CapsuleGeometry(0.04, 0.38, 6, 12)),
      matGold
    );
    const gearSpoke2 = new THREE.Mesh(
      geo(new THREE.CapsuleGeometry(0.04, 0.38, 6, 12)),
      matGold
    );
    gearSpoke2.rotation.z = Math.PI / 2;
    voxelGear.add(gearRing, gearSpoke1, gearSpoke2);
    s1Group.add(voxelGear);

    // Rounded Capsule-shaped Conveyor Belt
    const s1Belt = new THREE.Mesh(
      geo(createRoundedBox(2.15, 0.4, 0.68, 0.18, 5)),
      matNavy
    );
    s1Belt.position.set(0.55, 0.2, -0.45);
    s1Belt.castShadow = true;
    s1Group.add(s1Belt);

    // Rounded Product Packages
    const prodBoxGeo = geo(createRoundedBox(0.4, 0.38, 0.4, 0.1, 4));
    const s1Boxes: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const b = new THREE.Mesh(prodBoxGeo, matSkyLight);
      b.position.set(0.0 + i * 0.85, 0.59, -0.45);
      b.castShadow = true;
      s1Group.add(b);
      s1Boxes.push(b);
    }

    // THE ENTREPRENEUR PROTAGONIST (Smooth organic character)
    const entrepreneur = buildSmoothCharacter({
      suitColor: 0x0f243c,
      shirtColor: 0xffffff,
      tieColor: 0x38bdf8,
      hasGlasses: true,
    });
    entrepreneur.root.position.set(-1.3, 0.02, 1.35);
    entrepreneur.root.rotation.y = Math.PI * 0.2;
    worldGroup.add(entrepreneur.root);

    // ========================================================================
    // SCENE 2 (25% – 50%): ROUNDED 3D NEXT CARD & CIRCULAR COINS
    // ========================================================================
    const s2CardGroup = new THREE.Group();
    worldGroup.add(s2CardGroup);

    const cardTexture = createSmoothCardTexture();
    const cardMat = mat(
      new THREE.MeshPhysicalMaterial({
        map: cardTexture,
        roughness: 0.18,
        metalness: 0.25,
        clearcoat: 0.7,
        clearcoatRoughness: 0.15,
      })
    );
    const cardGeom = geo(createRoundedBox(3.5, 2.2, 0.14, 0.22, 6));
    cardGeom.rotateX(Math.PI / 2);
    const nextCardMesh = new THREE.Mesh(cardGeom, cardMat);
    nextCardMesh.castShadow = true;
    s2CardGroup.add(nextCardMesh);

    // True Round 3D Coins orbiting the NEXT Card
    const voxelCoins: THREE.Mesh[] = [];
    const coinGeo = geo(new THREE.CylinderGeometry(0.22, 0.22, 0.07, 28));
    coinGeo.rotateX(Math.PI / 2);
    for (let c = 0; c < 8; c++) {
      const coin = new THREE.Mesh(
        coinGeo,
        c % 2 === 0 ? matGold : matEmerald
      );
      coin.castShadow = true;
      s2CardGroup.add(coin);
      voxelCoins.push(coin);
    }

    // Circular Glowing Halo on the Floor beneath the Card
    const energyHalo = new THREE.Mesh(
      geo(new THREE.RingGeometry(1.3, 1.58, 48)),
      matSky
    );
    energyHalo.rotation.x = -Math.PI / 2;
    energyHalo.position.set(-0.5, 0.03, -0.5);
    worldGroup.add(energyHalo);

    // ========================================================================
    // SCENE 3 (50% – 75%): SMOOTH ROUNDED FACTORY EXPANSION & CYLINDRICAL ROBOTS
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
      geo(createRoundedBox(4.6, 2.6, 0.32, 0.14, 5)),
      matWhite
    );
    hall2Wall.position.set(1.8, 1.3, -2.3);
    hall2Wall.castShadow = true;
    hall2Wall.receiveShadow = true;
    s3Group.add(hall2Wall);
    s3Modules.push({ obj: hall2Wall, targetY: 1.3, startP: 0.44, endP: 0.56 });

    const hall2Cornice = new THREE.Mesh(
      geo(createRoundedBox(4.72, 0.38, 0.44, 0.16, 5)),
      matRoyal
    );
    hall2Cornice.position.set(1.8, 2.65, -2.28);
    s3Group.add(hall2Cornice);
    s3Modules.push({
      obj: hall2Cornice,
      targetY: 2.65,
      startP: 0.47,
      endP: 0.58,
    });

    const longBelt = new THREE.Mesh(
      geo(createRoundedBox(4.8, 0.4, 0.72, 0.18, 5)),
      matNavy
    );
    longBelt.position.set(1.6, 0.2, -0.45);
    longBelt.castShadow = true;
    s3Group.add(longBelt);
    s3Modules.push({ obj: longBelt, targetY: 0.2, startP: 0.48, endP: 0.58 });

    // Cylindrical & Capsule Robotic Arms
    const robotArms: THREE.Group[] = [];
    for (let r = 0; r < 3; r++) {
      const rGroup = new THREE.Group();
      rGroup.position.set(0.1 + r * 1.45, 0, -1.35);

      const baseCyl = new THREE.Mesh(
        geo(new THREE.CylinderGeometry(0.26, 0.32, 0.52, 24)),
        matSlate
      );
      baseCyl.position.y = 0.26;
      baseCyl.castShadow = true;
      rGroup.add(baseCyl);

      const pivot = new THREE.Group();
      pivot.position.y = 0.52;

      const mast = new THREE.Mesh(
        geo(new THREE.CapsuleGeometry(0.11, 0.72, 10, 16)),
        matSky
      );
      mast.position.y = 0.45;
      mast.castShadow = true;
      pivot.add(mast);

      const jointSphere = new THREE.Mesh(
        geo(new THREE.SphereGeometry(0.15, 16, 16)),
        matNavy
      );
      jointSphere.position.set(0, 0.85, 0);
      pivot.add(jointSphere);

      const boom = new THREE.Mesh(
        geo(new THREE.CapsuleGeometry(0.09, 0.55, 10, 16)),
        matGold
      );
      boom.rotation.x = Math.PI / 2;
      boom.position.set(0, 0.85, 0.32);
      boom.castShadow = true;
      pivot.add(boom);

      rGroup.add(pivot);
      s3Group.add(rGroup);
      robotArms.push(pivot);
      s3Modules.push({
        obj: rGroup,
        targetY: 0,
        startP: 0.5 + r * 0.04,
        endP: 0.62 + r * 0.04,
      });
    }

    const s3Boxes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const box = new THREE.Mesh(
        prodBoxGeo,
        i % 2 === 0 ? matSky : matEmerald
      );
      box.position.set(-0.2 + i * 1.1, 0.59, -0.45);
      box.castShadow = true;
      s3Group.add(box);
      s3Boxes.push(box);
    }

    // Rounded Storage Racks & Rounded Cargo Pods
    const warehouseGroup = new THREE.Group();
    warehouseGroup.position.set(3.8, 0, 1.0);
    const shelfGeo = geo(createRoundedBox(1.9, 0.1, 0.95, 0.04, 4));
    const crateGeo = geo(createRoundedBox(0.6, 0.46, 0.6, 0.12, 5));
    for (let lvl = 0; lvl < 3; lvl++) {
      const rackShelf = new THREE.Mesh(shelfGeo, matSlate);
      rackShelf.position.y = 0.45 + lvl * 0.68;
      rackShelf.castShadow = true;
      warehouseGroup.add(rackShelf);

      for (let c = 0; c < 2; c++) {
        const crate = new THREE.Mesh(
          crateGeo,
          lvl === 2 ? matEmerald : lvl === 1 ? matSkyLight : matGold
        );
        crate.position.set(-0.45 + c * 0.9, 0.73 + lvl * 0.68, 0);
        crate.castShadow = true;
        warehouseGroup.add(crate);
      }
    }
    s3Group.add(warehouseGroup);
    s3Modules.push({
      obj: warehouseGroup,
      targetY: 0,
      startP: 0.56,
      endP: 0.68,
    });

    // 3 Smooth Organic Operators
    const opPositions: [number, number, number][] = [
      [0.4, 0.45, Math.PI],
      [1.85, 0.45, Math.PI * 0.9],
      [2.6, 1.5, -Math.PI * 0.35],
    ];
    opPositions.forEach(([ox, oz, rot], idx) => {
      const op = buildSmoothCharacter({
        suitColor: 0x1e293b,
        shirtColor: 0x38bdf8,
        hardhatColor: 0x38bdf8,
      });
      op.root.position.set(ox, 0.02, oz);
      op.root.rotation.y = rot;
      s3Group.add(op.root);
      s3Modules.push({
        obj: op.root,
        targetY: 0.02,
        startP: 0.58 + idx * 0.03,
        endP: 0.7 + idx * 0.03,
      });
    });

    // ========================================================================
    // SCENE 4 (75% – 100%): CURVED CORPORATE TOWER, BALCONY & ROUNDED TRUCK
    // ========================================================================
    const s4Group = new THREE.Group();
    worldGroup.add(s4Group);

    const s4Modules: {
      obj: THREE.Object3D;
      targetY: number;
      startP: number;
      endP: number;
    }[] = [];

    // Curved-Corner Executive Tower
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-2.5, 0, -2.9);

    const towerBody = new THREE.Mesh(
      geo(createRoundedBox(3.0, 4.8, 2.2, 0.35, 6)),
      matNavy
    );
    towerBody.position.y = 2.4;
    towerBody.castShadow = true;
    towerBody.receiveShadow = true;
    towerGroup.add(towerBody);

    const winPillGeo = geo(createRoundedBox(0.62, 0.52, 0.14, 0.14, 4));
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        const winBlock = new THREE.Mesh(
          winPillGeo,
          (row + col) % 2 === 0 ? matSky : matSkyLight
        );
        winBlock.position.set(-0.8 + col * 0.8, 0.85 + row * 0.82, 1.1);
        towerGroup.add(winBlock);
      }
    }

    const towerCrown = new THREE.Mesh(
      geo(createRoundedBox(3.15, 0.36, 2.35, 0.16, 5)),
      matSky
    );
    towerCrown.position.y = 4.92;
    towerGroup.add(towerCrown);

    s4Group.add(towerGroup);
    s4Modules.push({ obj: towerGroup, targetY: 0, startP: 0.72, endP: 0.86 });

    // Circular / Oval Executive Command Pod Balcony
    const commandPlatform = new THREE.Group();
    commandPlatform.position.set(-1.3, 0, 1.55);
    const podBase = new THREE.Mesh(
      geo(new THREE.CylinderGeometry(0.95, 0.82, 0.55, 32)),
      matWhite
    );
    podBase.position.y = 0.275;
    podBase.castShadow = true;
    commandPlatform.add(podBase);

    const podRim = new THREE.Mesh(
      geo(new THREE.TorusGeometry(0.95, 0.06, 12, 36)),
      matSky
    );
    podRim.rotation.x = Math.PI / 2;
    podRim.position.y = 0.56;
    commandPlatform.add(podRim);

    s4Group.add(commandPlatform);
    s4Modules.push({
      obj: commandPlatform,
      targetY: 0,
      startP: 0.74,
      endP: 0.86,
    });

    // Streamlined Rounded Logistics Truck with Cylindrical Wheels
    const voxelTruck = new THREE.Group();
    voxelTruck.position.set(1.5, 0.04, 3.55);

    const trailerBox = new THREE.Mesh(
      geo(createRoundedBox(2.2, 1.05, 0.92, 0.18, 5)),
      matWhite
    );
    trailerBox.position.set(0, 0.65, 0);
    trailerBox.castShadow = true;
    voxelTruck.add(trailerBox);

    const trailerBand = new THREE.Mesh(
      geo(createRoundedBox(2.24, 0.22, 0.95, 0.08, 4)),
      matSky
    );
    trailerBand.position.set(0, 0.72, 0);
    voxelTruck.add(trailerBand);

    const truckCab = new THREE.Mesh(
      geo(createRoundedBox(0.88, 0.85, 0.88, 0.22, 5)),
      matNavy
    );
    truckCab.position.set(-1.55, 0.55, 0);
    truckCab.castShadow = true;
    voxelTruck.add(truckCab);

    // Cylindrical Wheels
    const wheelGeo = geo(new THREE.CylinderGeometry(0.18, 0.18, 0.98, 24));
    wheelGeo.rotateX(Math.PI / 2);
    [-1.55, -0.55, 0.65].forEach((wx) => {
      const wheel = new THREE.Mesh(wheelGeo, matRoad);
      wheel.position.set(wx, 0.18, 0);
      voxelTruck.add(wheel);
    });

    s4Group.add(voxelTruck);

    // Cylindrical / Capsule Financial Growth Columns (Back-Right)
    const growthBars: THREE.Mesh[] = [];
    for (let b = 0; b < 4; b++) {
      const bh = 1.1 + b * 0.85;
      const bar = new THREE.Mesh(
        geo(new THREE.CylinderGeometry(0.28, 0.28, bh, 28)),
        b === 3 ? matEmerald : b === 2 ? matSky : matRoyal
      );
      bar.position.set(3.1 + b * 0.72, bh / 2, -2.5);
      bar.castShadow = true;
      s4Group.add(bar);
      growthBars.push(bar);
    }

    // ========================================================================
    // RESIZE & VISIBILITY HANDLERS
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

    const updateSizes = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = Math.max(1, container.clientHeight);
      const asp = w / h;

      const fSize = w < 640 ? 13.5 : w < 1024 ? 12.0 : 10.8;
      camera.left = (-fSize * asp) / 2;
      camera.right = (fSize * asp) / 2;
      camera.top = fSize / 2;
      camera.bottom = -fSize / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    window.addEventListener("resize", updateSizes);
    updateSizes();

    // ========================================================================
    // SCROLL-CONTROLLED RENDER LOOP
    // ========================================================================
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();
      const p = clamp(progressRef.current, 0, 1);
      const isReduced = reducedMotionRef.current;

      const s2Enter = smoothstep(0.16, 0.34, p);
      const s2Exit = smoothstep(0.52, 0.66, p);
      const s3Progress = smoothstep(0.44, 0.74, p);
      const s4Progress = smoothstep(0.7, 0.94, p);

      const targetZoom = lerp(1.16, 0.98, smoothstep(0.15, 0.88, p));
      camera.zoom = targetZoom;
      const panX = lerp(-1.1, 0.35, smoothstep(0.2, 0.82, p));
      const panY = lerp(1.0, 1.5, smoothstep(0.3, 0.9, p));
      const azimuth = lerp(0.72, 0.86, p);
      camera.position.set(
        Math.cos(azimuth) * 18,
        14.2,
        Math.sin(azimuth) * 18
      );
      camera.lookAt(panX, panY, 0);
      camera.updateProjectionMatrix();

      voxelGear.rotation.z = -p * Math.PI * 16 - (isReduced ? 0 : elapsed * 2);
      s1Boxes.forEach((box, idx) => {
        const travel =
          ((p * 5 + idx * 0.5 + (isReduced ? 0 : elapsed * 0.25)) % 1) * 1.5;
        box.position.x = -0.2 + travel;
      });

      s2CardGroup.visible = s2Enter > 0.01;
      const floatBob = isReduced ? 0 : Math.sin(elapsed * 2.8) * 0.14;
      const cardX = lerp(-0.5, -2.5, s4Progress);
      const cardY =
        lerp(6.8, 3.3, easeOutBack(s2Enter)) + s4Progress * 2.55 + floatBob;
      const cardZ = lerp(-0.4, -2.9, s4Progress);
      nextCardMesh.position.set(cardX, cardY, cardZ);
      nextCardMesh.rotation.set(
        lerp(0.45, 0.25, s2Enter),
        lerp(-0.35, 0.15, p) +
          (isReduced ? 0 : Math.sin(elapsed * 1.4) * 0.08),
        lerp(-0.15, -0.05, s2Enter)
      );
      const cScale = lerp(0.01, 1, s2Enter) * lerp(1, 0.76, s4Progress);
      nextCardMesh.scale.setScalar(Math.max(0.001, cScale));

      const coinVis = clamp(s2Enter * (1 - s2Exit * 0.8), 0, 1);
      voxelCoins.forEach((coin, i) => {
        const angle =
          (i / voxelCoins.length) * Math.PI * 2 +
          p * Math.PI * 8 +
          (isReduced ? 0 : elapsed * 1.5);
        const radius = 2.15;
        coin.position.set(
          cardX + Math.cos(angle) * radius,
          cardY + Math.sin(angle * 2) * 0.35,
          cardZ + Math.sin(angle) * radius * 0.75
        );
        coin.rotation.y = angle;
        coin.scale.setScalar(Math.max(0.001, coinVis));
      });

      energyHalo.visible = s2Enter > 0.02 && s2Exit < 0.98;
      energyHalo.scale.setScalar(
        Math.max(0.001, s2Enter * (1 - s2Exit * 0.9))
      );
      cardPointLight.position.set(cardX, cardY - 0.6, cardZ);
      cardPointLight.intensity = s2Enter * (1 - s2Exit * 0.5) * 5.0;

      s3Group.visible = p > 0.42;
      s3Modules.forEach((m) => {
        const localT = smoothstep(m.startP, m.endP, p);
        const eased = easeOutBack(localT);
        m.obj.visible = localT > 0.01;
        m.obj.scale.setScalar(Math.max(0.001, localT));
        m.obj.position.y = m.targetY + (1 - eased) * 2.8;
      });

      s3Boxes.forEach((box, idx) => {
        box.visible = s3Progress > 0.25;
        const travel =
          ((p * 6 + idx * 0.25 + (isReduced ? 0 : elapsed * 0.2)) % 1) * 4.1;
        box.position.x = -0.4 + travel;
      });

      robotArms.forEach((arm, idx) => {
        arm.rotation.y =
          Math.sin(
            p * Math.PI * 10 + idx * 1.5 + (isReduced ? 0 : elapsed * 2.5)
          ) * 0.65;
      });

      s4Group.visible = p > 0.68;
      s4Modules.forEach((m) => {
        const localT = smoothstep(m.startP, m.endP, p);
        const eased = easeOutBack(localT);
        m.obj.visible = localT > 0.01;
        m.obj.scale.setScalar(Math.max(0.001, localT));
        m.obj.position.y = m.targetY + (1 - eased) * 3.2;
      });

      voxelTruck.visible = s4Progress > 0.02;
      voxelTruck.position.x = lerp(6.8, 1.5, easeOutBack(s4Progress));

      growthBars.forEach((bar, idx) => {
        const bT = smoothstep(0.73 + idx * 0.04, 0.93 + idx * 0.02, p);
        bar.visible = bT > 0.01;
        bar.scale.y = Math.max(0.001, bT);
        bar.position.y = ((1.1 + idx * 0.85) * bT) / 2;
      });

      const entY = lerp(0.02, 0.58, smoothstep(0.76, 0.88, p));
      const entX = lerp(lerp(-1.3, 0.0, s3Progress), -1.3, s4Progress);
      const entZ = lerp(1.35, 1.55, s4Progress);
      entrepreneur.root.position.set(entX, entY, entZ);
      entrepreneur.root.rotation.y = lerp(
        Math.PI * 0.2,
        Math.PI * 0.28,
        s4Progress
      );

      const armWave = clamp(s2Enter * (1 - s3Progress) + s4Progress, 0, 1);
      entrepreneur.rightArm.rotation.x = lerp(0, -1.1, armWave);
      entrepreneur.rightArm.rotation.z = lerp(0, -0.25, armWave);

      renderer.render(scene, camera);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateSizes);
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
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0F243C] text-[#38BDF8] flex items-center justify-center font-black text-xl mb-4 shadow-lg font-mono">
          NE➔XT
        </div>
        <h4 className="text-lg font-extrabold text-[#0F243C]">
          Etapa {activeScene + 1} de 4 • Evolución 3D NEXT
        </h4>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative"
      aria-label="Animación interactiva 3D con bordes redondeados del crecimiento industrial con NEXT"
    />
  );
}
