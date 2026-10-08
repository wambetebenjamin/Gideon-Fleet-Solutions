'use client';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { useEffect, useRef } from 'react';

// Real vehicle models (glTF sample assets, CC BY 4.0 — see image-credits.md).
// `length` is the target footprint in scene units; `x`/`z` place each vehicle on the floor.
const vehicles = [
  { src: '/models/vehicles/cesium-milk-truck.glb', length: 4.4, x: -1.2, z: 0.6, yaw: -0.42, phase: 0 },
  { src: '/models/vehicles/concept-car.glb', length: 3.5, x: 2.45, z: 0.35, yaw: -0.42, phase: 2.1 },
] as const;

const HOVER_HEIGHT = 0.55;

function makeShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 12, 22, 0.7)');
    gradient.addColorStop(0.55, 'rgba(0, 12, 22, 0.28)');
    gradient.addColorStop(1, 'rgba(0, 12, 22, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(canvas);
}

function disposeObject(root: THREE.Object3D) {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    object.geometry.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) value.dispose();
      });
      material.dispose();
    });
  });
}

export function HeroVehicles() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Transparent renderer: the vehicles float over the hero photos with no panel behind them.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
    camera.position.set(0, 2.2, 12.5);
    camera.lookAt(0.35, 0.95, 0);

    scene.add(new THREE.HemisphereLight('#f4fbff', '#0b2236', 2.2));
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.4);
    keyLight.position.set(4, 7, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight('#FDAE5C', 1.5);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const root = new THREE.Group();
    scene.add(root);

    const shadowTexture = makeShadowTexture();
    const draco = new DRACOLoader();
    draco.setDecoderPath('/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    let disposed = false;
    const floats = vehicles.map((vehicle) => {
      const pivot = new THREE.Group();
      pivot.position.set(vehicle.x, 0, vehicle.z);
      root.add(pivot);

      const float = new THREE.Group();
      pivot.add(float);

      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.8 }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.01;
      shadow.scale.set(vehicle.length * 1.1, vehicle.length * 0.4, 1);
      pivot.add(shadow);

      loader.load(
        vehicle.src,
        (gltf) => {
          if (disposed) {
            disposeObject(gltf.scene);
            return;
          }
          const model = gltf.scene;
          // Scale so the longest horizontal side matches the target length, then centre it on the floor.
          const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
          model.scale.setScalar(vehicle.length / Math.max(size.x, size.z));
          const bounds = new THREE.Box3().setFromObject(model);
          const centre = bounds.getCenter(new THREE.Vector3());
          model.position.set(-centre.x, -bounds.min.y, -centre.z);
          model.rotation.y = vehicle.yaw;
          float.add(model);
        },
        undefined,
        () => {
          // A failed model simply leaves its shadow on the floor; the rest of the scene still renders.
        },
      );

      return { float, shadow, length: vehicle.length, phase: vehicle.phase };
    });

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    // Drag (or arrow keys) to turn the pair; a little inertia keeps it feeling physical.
    let dragging = false;
    let lastX = 0;
    let turn = 0;
    let velocity = 0;
    const pointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      host.setPointerCapture?.(event.pointerId);
      host.classList.add('is-dragging');
    };
    const pointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const delta = event.clientX - lastX;
      lastX = event.clientX;
      velocity = delta * 0.003;
      turn += velocity;
    };
    const pointerUp = () => {
      dragging = false;
      host.classList.remove('is-dragging');
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') turn -= 0.15;
      if (event.key === 'ArrowRight') turn += 0.15;
    };
    host.addEventListener('pointerdown', pointerDown);
    host.addEventListener('pointermove', pointerMove);
    host.addEventListener('pointerup', pointerUp);
    host.addEventListener('pointercancel', pointerUp);
    host.addEventListener('keydown', keyDown);

    // Pause rendering while the hero is off-screen.
    let visible = true;
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    intersection.observe(host);

    const clock = new THREE.Clock();
    let frame = 0;
    const tick = () => {
      frame = window.requestAnimationFrame(tick);
      if (!visible) return;
      const time = clock.getElapsedTime();

      if (!dragging) {
        turn += velocity;
        velocity *= 0.92;
      }
      root.rotation.y = (reducedMotion ? 0 : Math.sin(time * 0.35) * 0.2) + turn;

      floats.forEach((entry) => {
        const bob = reducedMotion ? 0 : Math.sin(time * 1.1 + entry.phase) * 0.12;
        const lift = HOVER_HEIGHT + bob;
        entry.float.position.y = lift;
        entry.float.rotation.z = reducedMotion ? 0 : Math.sin(time * 0.9 + entry.phase) * 0.015;
        // The shadow tightens as the vehicle rises, which sells the floating effect.
        const scale = 1 - (lift - HOVER_HEIGHT) * 0.35;
        entry.shadow.scale.set(entry.length * 1.1 * scale, entry.length * 0.4 * scale, 1);
        (entry.shadow.material as THREE.MeshBasicMaterial).opacity = 0.8 * scale;
      });

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      host.removeEventListener('pointerdown', pointerDown);
      host.removeEventListener('pointermove', pointerMove);
      host.removeEventListener('pointerup', pointerUp);
      host.removeEventListener('pointercancel', pointerUp);
      host.removeEventListener('keydown', keyDown);
      disposeObject(root);
      shadowTexture.dispose();
      draco.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div className="hero-vehicles" ref={hostRef} role="group" tabIndex={0} aria-label="Interactive 3D view of a freight truck and a car. Drag, or use the left and right arrow keys, to turn them.">
      <span className="truck-orbit-hint"><span className="orbit-dot" /> Drag to look around</span>
    </div>
  );
}
