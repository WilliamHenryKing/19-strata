import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { type MaterialId, materials } from "./data";

type SceneControls = { select: (id: MaterialId) => void; motion: (enabled: boolean) => void };
type Diagnostics = {
  ready: boolean;
  fallback: boolean;
  frames: number;
  active: boolean;
  visible: boolean;
  material: MaterialId;
  motion: boolean;
  dpr: number;
  geometries: number;
  textures: number;
  drawCalls: number;
  triangles: number;
  disposed: boolean;
  pose: { rotation: number; lift: number; spread: number };
};
declare global {
  interface Window {
    __STRATA_DIAGNOSTICS__?: Diagnostics;
  }
}

function makeTexture(kind: MaterialId) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas texture unavailable");
  const image = ctx.createImageData(512, 512);
  let seed = 49381;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let y = 0; y < 512; y++) {
    for (let x = 0; x < 512; x++) {
      const n = random();
      let shade = 1;
      let r = 220,
        g = 208,
        b = 184;
      if (kind === "travertine") {
        shade = 0.87 + Math.sin(y * 0.08 + Math.sin(x * 0.015) * 1.5) * 0.045 + n * 0.095;
        if (n < 0.026) shade -= 0.23;
      } else if (kind === "clay") {
        r = 176;
        g = 90;
        b = 60;
        shade = 0.95 + n * 0.13 + Math.sin(x * 0.035 + y * 0.008) * Math.sin(y * 0.025) * 0.05;
      } else if (kind === "walnut") {
        r = 108;
        g = 66;
        b = 42;
        const grain = Math.sin(x * 0.23 + Math.sin(y * 0.009 + x * 0.006) * 7);
        shade = 0.78 + grain * 0.2 + Math.sin(x * 0.8) * 0.07 + n * 0.15;
      } else {
        r = 193;
        g = 187;
        b = 177;
        shade = 0.89 + Math.sin(y * 8.13) * 0.065 + n * 0.07;
      }
      const i = (y * 512 + x) * 4;
      image.data[i] = r * shade;
      image.data[i + 1] = g * shade;
      image.data[i + 2] = b * shade;
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function archGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-1.48, -1.55);
  shape.lineTo(-1.48, 0.24);
  shape.absarc(0, 0.24, 1.48, Math.PI, 0, true);
  shape.lineTo(1.48, -1.55);
  shape.lineTo(0.8, -1.55);
  shape.lineTo(0.8, 0.24);
  shape.absarc(0, 0.24, 0.8, 0, Math.PI, false);
  shape.lineTo(-0.8, -1.55);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.43,
    steps: 1,
    bevelEnabled: true,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    bevelSegments: 3,
    curveSegments: 48,
  });
  geometry.center();
  return geometry;
}

export function MaterialScene({
  selected,
  motion,
  compact = false,
}: {
  selected: MaterialId;
  motion: boolean;
  compact?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const controls = useRef<SceneControls | null>(null);
  const initial = useRef({ selected, motion });
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: THREE.WebGLRenderer;
    const diag: Diagnostics = {
      ready: false,
      fallback: false,
      frames: 0,
      active: false,
      visible: true,
      material: initial.current.selected,
      motion: initial.current.motion,
      dpr: 1,
      geometries: 0,
      textures: 0,
      drawCalls: 0,
      triangles: 0,
      disposed: false,
      pose: { rotation: -0.26, lift: 0, spread: 0 },
    };
    window.__STRATA_DIAGNOSTICS__ = diag;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      diag.fallback = true;
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    diag.dpr = renderer.getPixelRatio();
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.27;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-hidden", "true");
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.1, 40);
    camera.position.set(6, 3.45, 9);
    camera.lookAt(0, 0.0, 0);
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentTarget = pmrem.fromScene(environment, 0.04);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 0.65;
    environment.dispose();
    pmrem.dispose();

    const textureSet = Object.fromEntries(
      materials.map((m) => [m.id, makeTexture(m.id)]),
    ) as Record<MaterialId, THREE.CanvasTexture>;
    const surface = (id: MaterialId) =>
      new THREE.MeshStandardMaterial({
        map: textureSet[id],
        roughness: id === "aluminium" ? 0.34 : id === "walnut" ? 0.62 : 0.89,
        metalness: id === "aluminium" ? 0.9 : 0,
        bumpMap: textureSet[id],
        bumpScale: id === "travertine" ? 0.045 : id === "clay" ? 0.025 : 0.012,
      });
    const surfaces = {
      travertine: surface("travertine"),
      clay: surface("clay"),
      walnut: surface("walnut"),
      aluminium: surface("aluminium"),
    };
    const sculpture = new THREE.Group();
    sculpture.rotation.y = -0.26;
    scene.add(sculpture);
    const pieces: THREE.Mesh[] = [];
    function piece(
      geometry: THREE.BufferGeometry,
      mat: THREE.Material,
      position: [number, number, number],
      rotation: [number, number, number] = [0, 0, 0],
    ) {
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      sculpture.add(mesh);
      pieces.push(mesh);
      return mesh;
    }
    const pedestal = piece(
      new RoundedBoxGeometry(4.9, 0.22, 2.7, 3, 0.045),
      surfaces.clay,
      [0, -1.85, 0],
    );
    const arch = piece(archGeometry(), surfaces.travertine, [-0.43, -0.08, -0.45]);
    const timber = piece(
      new RoundedBoxGeometry(0.9, 2.54, 0.85, 3, 0.035),
      surfaces.walnut,
      [1.28, -0.46, -0.11],
      [0, -0.14, 0],
    );
    const slab = piece(
      new RoundedBoxGeometry(3.12, 0.22, 1.68, 3, 0.028),
      surfaces.aluminium,
      [0.15, -0.67, 0.45],
      [0, 0.13, 0],
    );
    const drum = piece(
      new THREE.CylinderGeometry(0.61, 0.61, 0.62, 72),
      surfaces.clay,
      [-1.47, -1.42, 0.92],
    );
    const cap = piece(
      new THREE.CylinderGeometry(0.65, 0.65, 0.13, 72),
      surfaces.travertine,
      [-1.47, -1.02, 0.92],
    );
    const orb = piece(
      new THREE.SphereGeometry(0.43, 40, 28),
      surfaces.aluminium,
      [0.18, -0.08, 0.57],
    );
    const littleSlab = piece(
      new RoundedBoxGeometry(1.07, 0.16, 0.84, 3, 0.024),
      surfaces.travertine,
      [1.32, 0.96, -0.11],
      [0, -0.28, 0],
    );
    // Narrow, repeated timber grooves remain geometry-local and share one material.
    const grooves: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      grooves.push(
        piece(
          new RoundedBoxGeometry(0.047, 2.53, 0.045, 2, 0.012),
          surfaces.walnut,
          [0.91 + i * 0.104, -0.46, 0.336],
          [0, -0.14, 0],
        ),
      );
    }
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ color: 0x3b1827, opacity: 0.2 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.985;
    floor.receiveShadow = true;
    scene.add(floor);
    const key = new THREE.DirectionalLight(0xffe9cd, 3.5);
    key.position.set(-4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, {
      left: -5,
      right: 5,
      top: 5,
      bottom: -5,
      near: 0.5,
      far: 25,
    });
    key.shadow.normalBias = 0.025;
    key.shadow.bias = -0.0003;
    key.shadow.radius = 3;
    scene.add(key, new THREE.HemisphereLight(0xffedde, 0x51313a, 0.8));
    const rim = new THREE.DirectionalLight(0xffffff, 1.25);
    rim.position.set(4, 3, -3);
    scene.add(rim);

    const target = { rotation: -0.26, lift: 0, spread: 0 };
    const current = {
      rotation: -0.26,
      lift: initial.current.motion ? 0.8 : 0,
      spread: initial.current.motion ? 0.4 : 0,
    };
    const pointer = { x: 0, y: 0 };
    let enabled = initial.current.motion;
    let visible = true;
    let alive = true;
    let raf = 0;
    let budgetUntil = 0;
    let last: number | null = null;
    const render = (now: number) => {
      raf = 0;
      if (!alive || !visible || document.hidden) {
        diag.active = false;
        return;
      }
      // RAF timestamps can predate performance.now() captured during synchronous setup.
      // Never feed a negative delta into exponential damping; it amplifies displacement.
      const delta = last === null ? 1 / 60 : THREE.MathUtils.clamp((now - last) / 1000, 0, 0.05);
      last = now;
      const ease = enabled ? 1 - Math.exp(-delta * 6.5) : 1;
      current.rotation +=
        (target.rotation + (enabled ? pointer.x * 0.11 : 0) - current.rotation) * ease;
      current.lift += (target.lift - current.lift) * ease;
      current.spread += (target.spread - current.spread) * ease;
      sculpture.rotation.y = current.rotation;
      sculpture.rotation.x = enabled ? pointer.y * 0.025 : 0;
      arch.position.y = -0.08 + current.lift * 0.7;
      arch.position.z = -0.45 - current.spread * 0.75;
      timber.position.x = 1.28 + current.spread * 0.35;
      for (let i = 0; i < grooves.length; i++) {
        const groove = grooves[i];
        if (groove) groove.position.x = 0.91 + i * 0.104 + current.spread * 0.35;
      }
      slab.position.y = -0.67 + current.lift * 0.35;
      slab.rotation.y = 0.13 + current.spread * 0.35;
      cap.position.y = -1.02 + current.lift * 0.35;
      littleSlab.position.y = 0.96 + current.lift * 0.6;
      orb.position.y = -0.08 + current.lift * 0.45;
      diag.pose = { ...current };
      renderer.render(scene, camera);
      diag.frames++;
      diag.active = false;
      diag.geometries = renderer.info.memory.geometries;
      diag.textures = renderer.info.memory.textures;
      diag.drawCalls = renderer.info.render.calls;
      diag.triangles = renderer.info.render.triangles;
      if (enabled && now < budgetUntil) {
        diag.active = true;
        raf = requestAnimationFrame(render);
      }
    };
    const wake = (duration = 1600) => {
      if (!alive || !visible || document.hidden) return;
      budgetUntil = enabled ? Math.max(budgetUntil, performance.now() + duration) : 0;
      if (!raf) {
        last = null;
        raf = requestAnimationFrame(render);
      }
    };
    const select = (id: MaterialId) => {
      const index = materials.findIndex((m) => m.id === id);
      diag.material = id;
      target.rotation = [-0.26, 0.16, -0.48, 0.06][index] ?? -0.26;
      target.lift = [0, 0.3, 0.09, 0.43][index] ?? 0;
      target.spread = [0, 0.28, 0.12, 0.55][index] ?? 0;
      arch.material = surfaces[id];
      pedestal.material = id === "clay" ? surfaces.travertine : surfaces.clay;
      drum.material = id === "walnut" ? surfaces.travertine : surfaces.clay;
      orb.material = id === "aluminium" ? surfaces.clay : surfaces.aluminium;
      wake(1900);
    };
    controls.current = {
      select,
      motion: (value) => {
        enabled = value;
        diag.motion = value;
        pointer.x = 0;
        pointer.y = 0;
        wake(500);
      },
    };
    const resize = () => {
      const width = element.clientWidth,
        height = element.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;
      const span = aspect < 0.9 ? 3.65 : 3.05;
      camera.left = -span * aspect;
      camera.right = span * aspect;
      camera.top = span;
      camera.bottom = -span;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      wake(100);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
        diag.visible = visible;
        if (visible) wake(200);
        else {
          cancelAnimationFrame(raf);
          raf = 0;
          diag.active = false;
        }
      },
      { rootMargin: "60px" },
    );
    intersection.observe(element);
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !enabled) return;
      const bounds = element.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
      pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
      wake(450);
    };
    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
      wake(1000);
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        diag.active = false;
      } else wake(150);
    };
    const onLost = (event: Event) => {
      event.preventDefault();
      diag.fallback = true;
      diag.ready = false;
      cancelAnimationFrame(raf);
      raf = 0;
      setFailed(true);
    };
    element.addEventListener("pointermove", onPointer);
    element.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    resize();
    select(initial.current.selected);
    wake(2200);
    diag.ready = true;
    setReady(true);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      controls.current = null;
      observer.disconnect();
      intersection.disconnect();
      element.removeEventListener("pointermove", onPointer);
      element.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      for (const mesh of pieces) mesh.geometry.dispose();
      for (const material of Object.values(surfaces)) material.dispose();
      for (const texture of Object.values(textureSet)) texture.dispose();
      floor.geometry.dispose();
      floor.material.dispose();
      key.shadow.dispose();
      environmentTarget.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      diag.disposed = true;
      diag.active = false;
    };
  }, []);

  useEffect(() => {
    controls.current?.select(selected);
  }, [selected]);
  useEffect(() => {
    controls.current?.motion(motion);
  }, [motion]);

  return (
    <div
      className={`material-scene ${compact ? "is-compact" : ""} ${ready && !failed ? "is-ready" : ""}`}
      ref={host}
      role="img"
      aria-label={`Sculptural architectural assembly in ${materials.find((m) => m.id === selected)?.name ?? "natural materials"}. Choose a material below to change the study.`}
    >
      <div className={`scene-fallback surface-${selected}`} aria-hidden="true">
        <span className="fallback-arch" />
        <span className="fallback-column" />
        <span className="fallback-table" />
        <span className="fallback-disc" />
      </div>
      {failed && <span className="fallback-label">Material study · still view</span>}
    </div>
  );
}
