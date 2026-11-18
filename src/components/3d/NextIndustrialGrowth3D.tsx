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
  /** Pixelation resolution mode ("retro" = 3.2x pixel, "hd-pixel" = 2.2x pixel, "voxel-crisp" = 1x) */
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

/**
 * Elastic ease-out for voxel blocks dropping & snapping into place
 */
function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  const p = clamp(x, 0, 1);
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
}

/**
 * Creates a crisp Pixel-Art CanvasTexture (with NearestFilter) for the 3D NEXT Corporate Card
 */
function createPixelArtCardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  // Low-res pixel-art canvas (128x80) scaled with NearestFilter for authentic pixel-art typography!
  canvas.width = 128;
  canvas.height = 80;
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = false;

  // Deep Navy Background
  ctx.fillStyle = "#081C45";
  ctx.fillRect(0, 0, 128, 80);

  // Stepped Pixel-Art Diagonal Sky-Blue Gradient Bands
  const bands = [
    { color: "#0C2D6B", x: 35, w: 30 },
    { color: "#0369A1", x: 60, w: 28 },
    { color: "#0284C7", x: 84, w: 26 },
    { color: "#38BDF8", x: 104, w: 24 },
  ];
  bands.forEach((b) => {
    ctx.fillStyle = b.color;
    for (let y = 0; y < 80; y += 2) {
      const shift = Math.floor(y * 0.45);
      ctx.fillRect(b.x - shift, y, b.w, 2);
    }
  });

  // Outer Pixel Border (Light Sky Blue)
  ctx.fillStyle = "#7DD3FC";
  ctx.fillRect(2, 2, 124, 2);
  ctx.fillRect(2, 76, 124, 2);
  ctx.fillRect(2, 2, 2, 76);
  ctx.fillRect(124, 2, 2, 76);

  // Corner Pixel Rivets
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(4, 4, 2, 2);
  ctx.fillRect(122, 4, 2, 2);
  ctx.fillRect(4, 74, 2, 2);
  ctx.fillRect(122, 74, 2, 2);

  // Pixel EMV Gold Chip (Left)
  ctx.fillStyle = "#F59E0B";
  ctx.fillRect(10, 26, 18, 14);
  ctx.fillStyle = "#FDE68A";
  ctx.fillRect(12, 28, 14, 10);
  ctx.fillStyle = "#B45309";
  ctx.fillRect(18, 26, 2, 14);
  ctx.fillRect(10, 32, 18, 2);

  // Pixel-Art "NEXT" Logo Text
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 18px monospace";
  ctx.fillText("NE", 34, 39);
  ctx.fillStyle = "#38BDF8";
  ctx.fillText(">", 56, 39);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("XT", 67, 39);

  // Bottom Pixel Label
  ctx.fillStyle = "#BAE6FD";
  ctx.font = "bold 8px monospace";
  ctx.fillText("CREDITO EMPRESAS", 10, 58);

  // Bottom White Pixel Number Blocks
  ctx.fillStyle = "#FFFFFF";
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(10 + i * 16, 64, 12, 3);
  }

  // Pixel Mastercard-style Overlapping Squares/Circles Bottom Right
  ctx.fillStyle = "#38BDF8";
  ctx.fillRect(96, 56, 12, 12);
  ctx.fillStyle = "#10B981";
  ctx.fillRect(104, 56, 12, 12);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(104, 56, 4, 12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Builds a charming 3D Voxel Character (Entrepreneur or Operator) out of crisp pixel cubes!
 */
function buildVoxelCharacter(options: {
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
  const u = 0.09; // Base voxel unit size

  const suitMat = new THREE.MeshStandardMaterial({
    color: options.suitColor,
    roughness: 0.4,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xf1c29d,
    roughness: 0.5,
  });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: options.shirtColor,
    roughness: 0.35,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.4,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
  });

  // Voxel Shoes & Legs
  const legGeo = new THREE.BoxGeometry(u * 1.3, u * 3.8, u * 1.4);
  const shoeGeo = new THREE.BoxGeometry(u * 1.4, u * 0.9, u * 1.9);

  const leftLeg = new THREE.Mesh(legGeo, suitMat);
  leftLeg.position.set(-u * 0.85, u * 2.3, 0);
  leftLeg.castShadow = true;
  root.add(leftLeg);

  const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
  leftShoe.position.set(-u * 0.85, u * 0.45, u * 0.25);
  root.add(leftShoe);

  const rightLeg = new THREE.Mesh(legGeo, suitMat);
  rightLeg.position.set(u * 0.85, u * 2.3, 0);
  rightLeg.castShadow = true;
  root.add(rightLeg);

  const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
  rightShoe.position.set(u * 0.85, u * 0.45, u * 0.25);
  root.add(rightShoe);

  // Voxel Torso (Blazer)
  const torsoGeo = new THREE.BoxGeometry(u * 3.4, u * 4.4, u * 2.0);
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.position.set(0, u * 6.2, 0);
  torso.castShadow = true;
  root.add(torso);

  // Voxel Shirt Front
  const shirtGeo = new THREE.BoxGeometry(u * 1.4, u * 3.6, u * 0.3);
  const shirt = new THREE.Mesh(shirtGeo, shirtMat);
  shirt.position.set(0, u * 6.4, u * 0.95);
  root.add(shirt);

  // Voxel Sky-Blue Tie for the Entrepreneur
  if (options.tieColor) {
    const tieMat = new THREE.MeshStandardMaterial({
      color: options.tieColor,
      emissive: options.tieColor,
      emissiveIntensity: 0.28,
      roughness: 0.25,
    });
    const tieGeo = new THREE.BoxGeometry(u * 0.65, u * 2.8, u * 0.38);
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, u * 6.2, u * 1.02);
    root.add(tie);
  }

  // Voxel Head Group
  const headGroup = new THREE.Group();
  headGroup.position.set(0, u * 10.4, 0);
  root.add(headGroup);

  const headCube = new THREE.Mesh(
    new THREE.BoxGeometry(u * 3.2, u * 3.2, u * 3.0),
    skinMat
  );
  headCube.castShadow = true;
  headGroup.add(headCube);

  // Voxel Eyes
  const eyeGeo = new THREE.BoxGeometry(u * 0.45, u * 0.55, u * 0.2);
  const leftEye = new THREE.Mesh(eyeGeo, darkMat);
  leftEye.position.set(-u * 0.7, u * 0.2, u * 1.52);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, darkMat);
  rightEye.position.set(u * 0.7, u * 0.2, u * 1.52);
  headGroup.add(rightEye);

  // Voxel Executive Glasses for the Entrepreneur
  if (options.hasGlasses) {
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.2,
    });
    const glassBridge = new THREE.Mesh(
      new THREE.BoxGeometry(u * 2.6, u * 0.22, u * 0.28),
      frameMat
    );
    glassBridge.position.set(0, u * 0.45, u * 1.58);
    headGroup.add(glassBridge);
  }

  // Voxel Hair or Safety Hardhat
  if (options.hardhatColor) {
    const hatMat = new THREE.MeshStandardMaterial({
      color: options.hardhatColor,
      roughness: 0.25,
    });
    const hatMain = new THREE.Mesh(
      new THREE.BoxGeometry(u * 3.5, u * 1.2, u * 3.4),
      hatMat
    );
    hatMain.position.set(0, u * 1.8, 0);
    headGroup.add(hatMain);

    const hatVisor = new THREE.Mesh(
      new THREE.BoxGeometry(u * 3.5, u * 0.35, u * 0.8),
      hatMat
    );
    hatVisor.position.set(0, u * 1.35, u * 1.8);
    headGroup.add(hatVisor);
  } else {
    // Layered Voxel Hair for Entrepreneur
    const hairTop = new THREE.Mesh(
      new THREE.BoxGeometry(u * 3.5, u * 1.0, u * 3.3),
      darkMat
    );
    hairTop.position.set(0, u * 1.8, -u * 0.05);
    headGroup.add(hairTop);

    const hairBack = new THREE.Mesh(
      new THREE.BoxGeometry(u * 3.4, u * 2.4, u * 0.8),
      darkMat
    );
    hairBack.position.set(0, u * 0.6, -u * 1.35);
    headGroup.add(hairBack);
  }

  // Voxel Arms
  const armGeo = new THREE.BoxGeometry(u * 1.1, u * 3.6, u * 1.2);
  const handGeo = new THREE.BoxGeometry(u * 1.0, u * 0.9, u * 1.0);

  const leftArm = new THREE.Group();
  leftArm.position.set(-u * 2.3, u * 8.0, 0);
  const leftArmMesh = new THREE.Mesh(armGeo, suitMat);
  leftArmMesh.position.set(0, -u * 1.6, 0);
  leftArmMesh.castShadow = true;
  leftArm.add(leftArmMesh);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.position.set(0, -u * 3.6, 0);
  leftArm.add(leftHand);
  root.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(u * 2.3, u * 8.0, 0);
  const rightArmMesh = new THREE.Mesh(armGeo, suitMat);
  rightArmMesh.position.set(0, -u * 1.6, 0);
  rightArmMesh.castShadow = true;
  rightArm.add(rightArmMesh);
  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.position.set(0, -u * 3.6, 0);
  rightArm.add(rightHand);
  root.add(rightArm);

  return { root, rightArm, leftArm, headGroup };
}

/**
 * Helper to create a Voxel Tree (Adds charm and scale to the isometric industrial campus)
 */
function createVoxelTree(
  trunkMat: THREE.Material,
  leafMat1: THREE.Material,
  leafMat2: THREE.Material
): THREE.Group {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.55, 0.22), trunkMat);
  trunk.position.y = 0.275;
  trunk.castShadow = true;
  tree.add(trunk);

  const crown1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.75), leafMat1);
  crown1.position.y = 0.72;
  crown1.castShadow = true;
  tree.add(crown1);

  const crown2 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.55), leafMat2);
  crown2.position.y = 1.1;
  crown2.castShadow = true;
  tree.add(crown2);

  const crown3 = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.32), leafMat1);
  crown3.position.y = 1.4;
  crown3.castShadow = true;
  tree.add(crown3);

  return tree;
}

export default function NextIndustrialGrowth3D({
  progress,
  activeScene,
  reducedMotion = false,
  pixelMode = "hd-pixel",
}: NextIndustrialGrowth3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  const progressRef = useRef<number>(progress);
  progressRef.current = progress;

  const reducedMotionRef = useRef<boolean>(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const pixelModeRef = useRef<PixelResolutionMode>(pixelMode);
  pixelModeRef.current = pixelMode;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false, // Disabled for crisp pixel-art edges!
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(1); // Controlled via offscreen pixel-art render target
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.BasicShadowMap; // Crisp pixel-art shadows!
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
    } catch {
      setWebglSupported(false);
      return;
    }

    container.innerHTML = "";
    // Force crisp-edges CSS rendering on the WebGL canvas
    renderer.domElement.style.imageRendering = "pixelated";
    container.appendChild(renderer.domElement);

    // ========================================================================
    // 1. POST-PROCESSING PIXEL-ART RENDER TARGET & SHADER PASS
    // ========================================================================
    const getPixelFactor = (mode: PixelResolutionMode, width: number) => {
      const mobileAdjust = width < 640 ? 0.85 : 1;
      if (mode === "retro") return 3.4 * mobileAdjust;
      if (mode === "hd-pixel") return 2.25 * mobileAdjust;
      return 1.15;
    };

    const initFactor = getPixelFactor(pixelModeRef.current, container.clientWidth);
    const rtWidth = Math.max(
      160,
      Math.floor(container.clientWidth / initFactor)
    );
    const rtHeight = Math.max(
      120,
      Math.floor(container.clientHeight / initFactor)
    );

    const pixelRenderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      generateMipmaps: false,
    });

    // Full-screen quad scene for crisp Pixel-Art presentation + subtle color pop
    const postScene = new THREE.Scene();
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postMaterial = new THREE.ShaderMaterial({
      uniforms: {
        tDiffuse: { value: pixelRenderTarget.texture },
        uResolution: { value: new THREE.Vector2(rtWidth, rtHeight) },
        uPixelGridStrength: { value: 0.045 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 uResolution;
        uniform float uPixelGridStrength;
        varying vec2 vUv;

        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);

          // Neighbor texel sampling for subtle pixel-art edge crispness
          vec2 px = 1.0 / uResolution;
          vec4 n = texture2D(tDiffuse, vUv + vec2(0.0, px.y));
          vec4 e = texture2D(tDiffuse, vUv + vec2(px.x, 0.0));
          float edge = length(texel.rgb - n.rgb) + length(texel.rgb - e.rgb);

          // Quantize color levels slightly for authentic HD-2D pixel art feel
          vec3 col = floor(texel.rgb * 36.0 + 0.5) / 36.0;
          col = mix(col, col * 0.86, clamp(edge * 0.45, 0.0, 0.25));

          // Ultra-subtle pixel grid bevel
          vec2 cellUv = fract(vUv * uResolution);
          float gridLine = step(0.92, max(cellUv.x, cellUv.y));
          col -= gridLine * uPixelGridStrength * texel.a;

          gl_FragColor = vec4(col, texel.a);
        }
      `,
      transparent: true,
    });
    const postQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      postMaterial
    );
    postScene.add(postQuad);

    // ========================================================================
    // 2. TRUE ORTHOGRAPHIC ISOMETRIC CAMERA & SCENE
    // ========================================================================
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

    // Crisp Isometric Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xbae6fd, 1.45);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(10, 18, 8);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    const d = 10;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(-12, 10, -10);
    scene.add(rimLight);

    const cardPointLight = new THREE.PointLight(0x38bdf8, 0, 14);
    scene.add(cardPointLight);

    // ========================================================================
    // 3. VOXEL PALETTE MATERIALS
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
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 })
    );
    const matIce = mat(
      new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.4 })
    );
    const matSkyLight = mat(
      new THREE.MeshStandardMaterial({ color: 0x7dd3fc, roughness: 0.3 })
    );
    const matSky = mat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.25,
        roughness: 0.25,
      })
    );
    const matRoyal = mat(
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 })
    );
    const matNavy = mat(
      new THREE.MeshStandardMaterial({ color: 0x0f243c, roughness: 0.35 })
    );
    const matSlate = mat(
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.45 })
    );
    const matRoad = mat(
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 })
    );
    const matEmerald = mat(
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x059669,
        emissiveIntensity: 0.3,
        roughness: 0.3,
      })
    );
    const matGold = mat(
      new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        emissive: 0xd97706,
        emissiveIntensity: 0.35,
        roughness: 0.25,
      })
    );
    const matLeaf1 = mat(
      new THREE.MeshStandardMaterial({ color: 0x34d399, roughness: 0.5 })
    );
    const matLeaf2 = mat(
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 })
    );
    const matTrunk = mat(
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 })
    );

    // ========================================================================
    // 4. LAYERED VOXEL DIORAMA ISLAND BASE
    // ========================================================================
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Bottom Navy Bedrock Slab
    const bedrock = new THREE.Mesh(
      geo(new THREE.BoxGeometry(12.4, 0.45, 10.4)),
      matNavy
    );
    bedrock.position.set(0, -0.68, 0);
    worldGroup.add(bedrock);

    // Middle Glowing Sky-Blue Circuit Rim
    const circuitSlab = new THREE.Mesh(
      geo(new THREE.BoxGeometry(12.1, 0.22, 10.1)),
      matSky
    );
    circuitSlab.position.set(0, -0.35, 0);
    worldGroup.add(circuitSlab);

    // Top White & Ice Voxel Platform
    const topSlab = new THREE.Mesh(
      geo(new THREE.BoxGeometry(11.8, 0.26, 9.8)),
      matWhite
    );
    topSlab.position.set(0, -0.13, 0);
    topSlab.receiveShadow = true;
    worldGroup.add(topSlab);

    // Voxel Logistics Road along the Front Edge (+ Dashed Pixel Lane Markings)
    const roadMesh = new THREE.Mesh(
      geo(new THREE.BoxGeometry(11.8, 0.04, 1.5)),
      matRoad
    );
    roadMesh.position.set(0, 0.02, 3.6);
    roadMesh.receiveShadow = true;
    worldGroup.add(roadMesh);

    for (let i = -5; i <= 5; i++) {
      const dash = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.55, 0.06, 0.12)),
        matWhite
      );
      dash.position.set(i * 1.0, 0.03, 3.6);
      worldGroup.add(dash);
    }

    // Voxel Checkerboard Floor Tiles on Factory Plaza
    const tileGeo = geo(new THREE.BoxGeometry(0.95, 0.03, 0.95));
    for (let gx = -5; gx <= 5; gx++) {
      for (let gz = -4; gz <= 2; gz++) {
        if ((gx + gz) % 2 === 0) {
          const tile = new THREE.Mesh(tileGeo, matIce);
          tile.position.set(gx * 1.0, 0.015, gz * 1.0);
          tile.receiveShadow = true;
          worldGroup.add(tile);
        }
      }
    }

    // 4 Voxel Trees framing the Isometric Plaza
    const treeCoords: [number, number][] = [
      [-5.1, 2.3],
      [-5.1, -3.8],
      [5.1, 2.3],
      [5.1, -3.8],
    ];
    treeCoords.forEach(([tx, tz]) => {
      const t = createVoxelTree(matTrunk, matLeaf1, matLeaf2);
      t.position.set(tx, 0, tz);
      worldGroup.add(t);
    });

    // ========================================================================
    // 5. SCENE 1 (0% – 25%): INITIAL SMALL MANUFACTURING WORKSHOP
    // ========================================================================
    const s1Group = new THREE.Group();
    s1Group.position.set(-2.3, 0, -0.8);
    worldGroup.add(s1Group);

    // Stepped Voxel Back & Side Cutaway Walls
    const s1BackWall = new THREE.Mesh(
      geo(new THREE.BoxGeometry(3.6, 2.2, 0.3)),
      matWhite
    );
    s1BackWall.position.set(0, 1.1, -1.5);
    s1BackWall.castShadow = true;
    s1BackWall.receiveShadow = true;
    s1Group.add(s1BackWall);

    const s1SideWall = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.3, 2.2, 3.0)),
      matWhite
    );
    s1SideWall.position.set(-1.65, 1.1, -0.15);
    s1SideWall.castShadow = true;
    s1SideWall.receiveShadow = true;
    s1Group.add(s1SideWall);

    // Voxel Saw-Tooth Roof Cornice Blocks (Navy & Sky Blue)
    const s1RoofRim = new THREE.Mesh(
      geo(new THREE.BoxGeometry(3.7, 0.35, 0.42)),
      matNavy
    );
    s1RoofRim.position.set(0, 2.25, -1.48);
    s1Group.add(s1RoofRim);

    const s1SideRim = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.42, 0.35, 3.1)),
      matNavy
    );
    s1SideRim.position.set(-1.65, 2.25, -0.15);
    s1Group.add(s1SideRim);

    // Glowing Pixel Window Blocks on Initial Workshop Wall
    for (let w = 0; w < 3; w++) {
      const win = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.65, 0.65, 0.36)),
        matSky
      );
      win.position.set(-0.95 + w * 0.95, 1.4, -1.5);
      s1Group.add(win);
    }

    // Voxel CNC Machine #1 + Spinning Voxel Gear
    const cncBody = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.95, 1.25, 0.95)),
      matSlate
    );
    cncBody.position.set(-0.9, 0.625, -0.45);
    cncBody.castShadow = true;
    s1Group.add(cncBody);

    const cncHeader = new THREE.Mesh(
      geo(new THREE.BoxGeometry(1.02, 0.25, 1.02)),
      matRoyal
    );
    cncHeader.position.set(-0.9, 1.32, -0.45);
    s1Group.add(cncHeader);

    // Voxel Gear attached to CNC Machine (Rotates with scroll)
    const voxelGear = new THREE.Group();
    voxelGear.position.set(-0.9, 0.75, 0.08);
    const gearBar1 = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.55, 0.16, 0.12)),
      matGold
    );
    const gearBar2 = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.16, 0.55, 0.12)),
      matGold
    );
    voxelGear.add(gearBar1, gearBar2);
    s1Group.add(voxelGear);

    // Initial Short Voxel Conveyor Belt
    const s1Belt = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.1, 0.4, 0.65)),
      matNavy
    );
    s1Belt.position.set(0.55, 0.2, -0.45);
    s1Belt.castShadow = true;
    s1Group.add(s1Belt);

    // Voxel Product Cubes on Initial Belt
    const prodBoxGeo = geo(new THREE.BoxGeometry(0.38, 0.38, 0.38));
    const s1Boxes: THREE.Mesh[] = [];
    for (let i = 0; i < 2; i++) {
      const b = new THREE.Mesh(prodBoxGeo, matSkyLight);
      b.position.set(0.0 + i * 0.85, 0.59, -0.45);
      b.castShadow = true;
      s1Group.add(b);
      s1Boxes.push(b);
    }

    // THE VOXEL ENTREPRENEUR PROTAGONIST (Consistent across all 4 scenes!)
    const entrepreneur = buildVoxelCharacter({
      suitColor: 0x0f243c,
      shirtColor: 0xffffff,
      tieColor: 0x38bdf8,
      hasGlasses: true,
    });
    entrepreneur.root.position.set(-1.3, 0.02, 1.35);
    entrepreneur.root.rotation.y = Math.PI * 0.2;
    worldGroup.add(entrepreneur.root);

    // ========================================================================
    // 6. SCENE 2 (25% – 50%): 3D PIXEL-ART NEXT CARD & VOXEL COINS CASCADE
    // ========================================================================
    const s2CardGroup = new THREE.Group();
    worldGroup.add(s2CardGroup);

    const cardTexture = createPixelArtCardTexture();
    const cardTopMat = mat(
      new THREE.MeshStandardMaterial({
        map: cardTexture,
        roughness: 0.25,
        metalness: 0.2,
      })
    );
    const cardEdgeMat = mat(
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35,
      })
    );

    const cardMaterials = [
      cardEdgeMat,
      cardEdgeMat,
      cardTopMat,
      cardTopMat,
      cardEdgeMat,
      cardEdgeMat,
    ];
    const nextCardMesh = new THREE.Mesh(
      geo(new THREE.BoxGeometry(3.5, 0.16, 2.2)),
      cardMaterials
    );
    nextCardMesh.castShadow = true;
    s2CardGroup.add(nextCardMesh);

    // Orbiting Voxel Coins / Liquidity Blocks around the NEXT Card
    const voxelCoins: THREE.Mesh[] = [];
    const coinGeo = geo(new THREE.BoxGeometry(0.32, 0.32, 0.12));
    for (let c = 0; c < 8; c++) {
      const coin = new THREE.Mesh(
        coinGeo,
        c % 2 === 0 ? matGold : matEmerald
      );
      coin.castShadow = true;
      s2CardGroup.add(coin);
      voxelCoins.push(coin);
    }

    // Stepped Voxel Energy Square on the Floor beneath the Card
    const energySquare = new THREE.Mesh(
      geo(new THREE.BoxGeometry(3.8, 0.05, 2.6)),
      matSky
    );
    energySquare.position.set(-0.5, 0.03, -0.5);
    worldGroup.add(energySquare);

    // ========================================================================
    // 7. SCENE 3 (50% – 75%): VOXEL BLOCK-BY-BLOCK FACTORY EXPANSION
    // ========================================================================
    const s3Group = new THREE.Group();
    worldGroup.add(s3Group);

    // We store individual expandable voxel modules so each drops in with staggered scroll timing!
    const s3Modules: {
      obj: THREE.Object3D;
      targetY: number;
      startP: number;
      endP: number;
    }[] = [];

    // Module A: Middle Production Hall Back Wall & Skylight Roof
    const hall2Wall = new THREE.Mesh(
      geo(new THREE.BoxGeometry(4.6, 2.6, 0.3)),
      matWhite
    );
    hall2Wall.position.set(1.8, 1.3, -2.3);
    hall2Wall.castShadow = true;
    hall2Wall.receiveShadow = true;
    s3Group.add(hall2Wall);
    s3Modules.push({ obj: hall2Wall, targetY: 1.3, startP: 0.44, endP: 0.56 });

    const hall2Cornice = new THREE.Mesh(
      geo(new THREE.BoxGeometry(4.7, 0.38, 0.42)),
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

    // Module B: Extended Long Voxel Conveyor Line
    const longBelt = new THREE.Mesh(
      geo(new THREE.BoxGeometry(4.8, 0.4, 0.7)),
      matNavy
    );
    longBelt.position.set(1.6, 0.2, -0.45);
    longBelt.castShadow = true;
    s3Group.add(longBelt);
    s3Modules.push({ obj: longBelt, targetY: 0.2, startP: 0.48, endP: 0.58 });

    // Module C: 3 Articulated Voxel Robotic Assembly Arms
    const robotArms: THREE.Group[] = [];
    for (let r = 0; r < 3; r++) {
      const rGroup = new THREE.Group();
      rGroup.position.set(0.1 + r * 1.45, 0, -1.35);

      const baseBlock = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.55, 0.55, 0.55)),
        matSlate
      );
      baseBlock.position.y = 0.275;
      baseBlock.castShadow = true;
      rGroup.add(baseBlock);

      const pivot = new THREE.Group();
      pivot.position.y = 0.55;

      const mast = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.24, 0.95, 0.24)),
        matSky
      );
      mast.position.y = 0.45;
      mast.castShadow = true;
      pivot.add(mast);

      const boom = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.22, 0.22, 0.75)),
        matGold
      );
      boom.position.set(0, 0.85, 0.3);
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

    // Module D: Moving Packages on Extended Belt
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

    // Module E: High-Bay Voxel Warehouse Racks (Right Wing)
    const warehouseGroup = new THREE.Group();
    warehouseGroup.position.set(3.8, 0, 1.0);
    for (let lvl = 0; lvl < 3; lvl++) {
      const rackShelf = new THREE.Mesh(
        geo(new THREE.BoxGeometry(1.9, 0.1, 0.95)),
        matSlate
      );
      rackShelf.position.y = 0.45 + lvl * 0.68;
      rackShelf.castShadow = true;
      warehouseGroup.add(rackShelf);

      for (let c = 0; c < 2; c++) {
        const crate = new THREE.Mesh(
          geo(new THREE.BoxGeometry(0.6, 0.46, 0.6)),
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

    // Module F: 3 Voxel Operators in Sky-Blue Hardhats
    const opPositions: [number, number, number][] = [
      [0.4, 0.45, Math.PI],
      [1.85, 0.45, Math.PI * 0.9],
      [2.6, 1.5, -Math.PI * 0.35],
    ];
    opPositions.forEach(([ox, oz, rot], idx) => {
      const op = buildVoxelCharacter({
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
    // 8. SCENE 4 (75% – 100%): CONSOLIDATED VOXEL SMART INDUSTRY & TOWER
    // ========================================================================
    const s4Group = new THREE.Group();
    worldGroup.add(s4Group);

    const s4Modules: {
      obj: THREE.Object3D;
      targetY: number;
      startP: number;
      endP: number;
    }[] = [];

    // Consolidated Voxel Corporate Skyscraper Tower (Rear-Left)
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-2.5, 0, -2.9);

    const towerBody = new THREE.Mesh(
      geo(new THREE.BoxGeometry(3.0, 4.8, 2.2)),
      matNavy
    );
    towerBody.position.y = 2.4;
    towerBody.castShadow = true;
    towerBody.receiveShadow = true;
    towerGroup.add(towerBody);

    // Pixel Grid Windows on Corporate Tower
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        const winBlock = new THREE.Mesh(
          geo(new THREE.BoxGeometry(0.62, 0.52, 0.12)),
          (row + col) % 2 === 0 ? matSky : matSkyLight
        );
        winBlock.position.set(-0.8 + col * 0.8, 0.85 + row * 0.82, 1.12);
        towerGroup.add(winBlock);
      }
    }

    // Rooftop Crown & Solar Array on Tower
    const towerCrown = new THREE.Mesh(
      geo(new THREE.BoxGeometry(3.15, 0.35, 2.35)),
      matSky
    );
    towerCrown.position.y = 4.95;
    towerGroup.add(towerCrown);

    s4Group.add(towerGroup);
    s4Modules.push({ obj: towerGroup, targetY: 0, startP: 0.72, endP: 0.86 });

    // Executive Command Sky-Balcony (Where Entrepreneur directs the industry in Scene 4)
    const commandPlatform = new THREE.Group();
    commandPlatform.position.set(-1.3, 0, 1.55);
    const podBase = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.1, 0.55, 1.35)),
      matWhite
    );
    podBase.position.y = 0.275;
    podBase.castShadow = true;
    commandPlatform.add(podBase);

    const podRim = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.18, 0.12, 1.42)),
      matSky
    );
    podRim.position.y = 0.58;
    commandPlatform.add(podRim);

    s4Group.add(commandPlatform);
    s4Modules.push({
      obj: commandPlatform,
      targetY: 0,
      startP: 0.74,
      endP: 0.86,
    });

    // Voxel Logistics Delivery Truck on the Front Road
    const voxelTruck = new THREE.Group();
    voxelTruck.position.set(1.5, 0.04, 3.55);

    const trailerBox = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.2, 1.05, 0.92)),
      matWhite
    );
    trailerBox.position.set(0, 0.65, 0);
    trailerBox.castShadow = true;
    voxelTruck.add(trailerBox);

    const trailerBand = new THREE.Mesh(
      geo(new THREE.BoxGeometry(2.24, 0.22, 0.95)),
      matSky
    );
    trailerBand.position.set(0, 0.72, 0);
    voxelTruck.add(trailerBand);

    const truckCab = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.85, 0.85, 0.88)),
      matNavy
    );
    truckCab.position.set(-1.58, 0.55, 0);
    truckCab.castShadow = true;
    voxelTruck.add(truckCab);

    const truckWindshield = new THREE.Mesh(
      geo(new THREE.BoxGeometry(0.12, 0.38, 0.76)),
      matSkyLight
    );
    truckWindshield.position.set(-1.98, 0.68, 0);
    voxelTruck.add(truckWindshield);

    // 6 Voxel Wheels
    const wheelGeo = geo(new THREE.BoxGeometry(0.32, 0.32, 0.98));
    [-1.55, -0.55, 0.65].forEach((wx) => {
      const wheel = new THREE.Mesh(wheelGeo, matRoad);
      wheel.position.set(wx, 0.16, 0);
      voxelTruck.add(wheel);
    });

    s4Group.add(voxelTruck);

    // 4 Ascending Voxel Financial Growth Bars (Rear-Right)
    const growthBars: THREE.Mesh[] = [];
    for (let b = 0; b < 4; b++) {
      const bh = 1.1 + b * 0.85;
      const bar = new THREE.Mesh(
        geo(new THREE.BoxGeometry(0.55, bh, 0.55)),
        b === 3 ? matEmerald : b === 2 ? matSky : matRoyal
      );
      bar.position.set(3.1 + b * 0.72, bh / 2, -2.5);
      bar.castShadow = true;
      s4Group.add(bar);
      growthBars.push(bar);
    }

    // ========================================================================
    // 9. RESIZE & VISIBILITY HANDLERS
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

      // Adjust Orthographic Camera frustum for mobile vs desktop
      const fSize = w < 640 ? 13.5 : w < 1024 ? 12.2 : 11.2;
      camera.left = (-fSize * asp) / 2;
      camera.right = (fSize * asp) / 2;
      camera.top = fSize / 2;
      camera.bottom = -fSize / 2;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);

      const pFactor = getPixelFactor(pixelModeRef.current, w);
      const rtw = Math.max(160, Math.floor(w / pFactor));
      const rth = Math.max(120, Math.floor(h / pFactor));
      pixelRenderTarget.setSize(rtw, rth);
      postMaterial.uniforms.uResolution.value.set(rtw, rth);
      postMaterial.uniforms.uPixelGridStrength.value =
        pixelModeRef.current === "voxel-crisp" ? 0.015 : 0.05;
    };

    window.addEventListener("resize", updateSizes);
    updateSizes();

    // ========================================================================
    // 10. DETERMINISTIC SCROLL-CONTROLLED RENDER LOOP
    // ========================================================================
    let rafId: number;
    let lastMode = pixelModeRef.current;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      if (!isVisible) return;

      if (lastMode !== pixelModeRef.current) {
        lastMode = pixelModeRef.current;
        updateSizes();
      }

      const elapsed = clock.getElapsedTime();
      const p = clamp(progressRef.current, 0, 1);
      const isReduced = reducedMotionRef.current;

      const s2Enter = smoothstep(0.18, 0.34, p);
      const s2Exit = smoothstep(0.52, 0.66, p);
      const s3Progress = smoothstep(0.44, 0.74, p);
      const s4Progress = smoothstep(0.7, 0.94, p);

      // 1. Subtle Orthographic Camera Pan & Zoom across the 4 stages
      const targetZoom = lerp(1.18, 0.96, smoothstep(0.2, 0.88, p));
      camera.zoom = targetZoom;
      const panX = lerp(-1.2, 0.35, smoothstep(0.22, 0.82, p));
      const panY = lerp(1.0, 1.55, smoothstep(0.35, 0.9, p));
      const azimuth = lerp(0.76, 0.84, p);
      camera.position.set(
        Math.cos(azimuth) * 18,
        14.2,
        Math.sin(azimuth) * 18
      );
      camera.lookAt(panX, panY, 0);
      camera.updateProjectionMatrix();

      // 2. Scene 1 Voxel Gear & Conveyor Cubes (100% Scroll-Synced)
      voxelGear.rotation.z = -p * Math.PI * 16;
      s1Boxes.forEach((box, idx) => {
        const travel = ((p * 5 + idx * 0.5) % 1) * 1.5;
        box.position.x = -0.2 + travel;
      });

      // 3. Scene 2: 3D Pixel-Art NEXT Card & Orbiting Voxel Coins
      s2CardGroup.visible = s2Enter > 0.01;
      const stepBob = isReduced
        ? 0
        : Math.round(Math.sin(elapsed * 3) * 3) * 0.04; // Quantized pixel bobbing!
      const cardX = lerp(-0.5, -2.5, s4Progress);
      const cardY = lerp(6.8, 3.3, easeOutBack(s2Enter)) + s4Progress * 2.55 + stepBob;
      const cardZ = lerp(-0.4, -2.9, s4Progress);
      nextCardMesh.position.set(cardX, cardY, cardZ);
      nextCardMesh.rotation.set(
        lerp(0.45, 0.25, s2Enter),
        lerp(-0.35, 0.15, p),
        lerp(-0.15, -0.05, s2Enter)
      );
      const cScale = lerp(0.01, 1, s2Enter) * lerp(1, 0.76, s4Progress);
      nextCardMesh.scale.setScalar(Math.max(0.001, cScale));

      // Orbiting Voxel Coins around the NEXT Card
      const coinVis = clamp(s2Enter * (1 - s2Exit * 0.8), 0, 1);
      voxelCoins.forEach((coin, i) => {
        const angle = (i / voxelCoins.length) * Math.PI * 2 + p * Math.PI * 10;
        const radius = 2.15;
        coin.position.set(
          cardX + Math.cos(angle) * radius,
          cardY + Math.sin(angle * 2) * 0.35,
          cardZ + Math.sin(angle) * radius * 0.75
        );
        coin.rotation.y = angle;
        coin.scale.setScalar(Math.max(0.001, coinVis));
      });

      energySquare.visible = s2Enter > 0.02 && s2Exit < 0.98;
      energySquare.scale.setScalar(
        Math.max(0.001, s2Enter * (1 - s2Exit * 0.9))
      );
      cardPointLight.position.set(cardX, cardY - 0.6, cardZ);
      cardPointLight.intensity = s2Enter * (1 - s2Exit * 0.5) * 5.0;

      // 4. Scene 3: Voxel Modules Dropping & Snapping into Place
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
        const travel = ((p * 7 + idx * 0.25) % 1) * 4.1;
        box.position.x = -0.4 + travel;
      });

      robotArms.forEach((arm, idx) => {
        // Stepped quantized robotic rotation for pixel-art feel
        const rawAngle = Math.sin(p * Math.PI * 10 + idx * 1.5) * 0.7;
        arm.rotation.y = Math.round(rawAngle * 8) / 8;
      });

      // 5. Scene 4: Consolidated Tower, Command Pod, Truck & Growth Bars
      s4Group.visible = p > 0.68;
      s4Modules.forEach((m) => {
        const localT = smoothstep(m.startP, m.endP, p);
        const eased = easeOutBack(localT);
        m.obj.visible = localT > 0.01;
        m.obj.scale.setScalar(Math.max(0.001, localT));
        m.obj.position.y = m.targetY + (1 - eased) * 3.2;
      });

      // Logistics Truck drives along the front pixel highway
      voxelTruck.visible = s4Progress > 0.02;
      voxelTruck.position.x = lerp(6.8, 1.5, easeOutBack(s4Progress));

      // Monument Voxel Growth Bars rise in stepped blocks
      growthBars.forEach((bar, idx) => {
        const bT = smoothstep(0.73 + idx * 0.04, 0.93 + idx * 0.02, p);
        bar.visible = bT > 0.01;
        bar.scale.y = Math.max(0.001, bT);
        bar.position.y = ((1.1 + idx * 0.85) * bT) / 2;
      });

      // 6. Entrepreneur Protagonist Journey across all 4 scenes
      const entY = lerp(0.02, 0.64, smoothstep(0.76, 0.88, p));
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

      // Render Pass 1: 3D Voxel World -> Low-Res Nearest-Neighbor Pixel Target
      renderer.setRenderTarget(pixelRenderTarget);
      renderer.clear();
      renderer.render(scene, camera);

      // Render Pass 2: Pixel-Art Post Shader -> Screen Canvas
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCamera);
    };

    rafId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updateSizes);
      io.disconnect();

      cardTexture.dispose();
      pixelRenderTarget.dispose();
      postMaterial.dispose();
      postQuad.geometry.dispose();
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
        <div className="w-16 h-16 rounded-2xl bg-[#0F243C] text-[#38BDF8] flex items-center justify-center font-black text-xl mb-4 shadow-lg font-mono">
          NE➔XT
        </div>
        <h4 className="text-lg font-extrabold text-[#0F243C]">
          Etapa {activeScene + 1} de 4 • Evolución Voxel NEXT
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
      className="w-full h-full relative"
      style={{ imageRendering: "pixelated" }}
      aria-label="Animación interactiva 3D estilo Pixel Art Voxel del crecimiento industrial con NEXT"
    />
  );
}
