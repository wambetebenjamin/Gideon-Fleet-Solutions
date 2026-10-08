'use client';

import * as THREE from 'three';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

function makeMaterial(color: string, roughness = 0.55, metalness = 0.08) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function buildTruck(scene: THREE.Scene) {
  const truck = new THREE.Group();
  const materials: THREE.Material[] = [];
  const geometries: THREE.BufferGeometry[] = [];
  const material = (color: string, roughness = 0.55, metalness = 0.08) => {
    const value = makeMaterial(color, roughness, metalness);
    materials.push(value);
    return value;
  };
  const box = (size: [number, number, number], color: string | THREE.MeshStandardMaterial, position: [number, number, number], options?: { roughness?: number; metalness?: number }) => {
    const geometry = new THREE.BoxGeometry(...size);
    geometries.push(geometry);
    const boxMaterial = typeof color === 'string' ? material(color, options?.roughness, options?.metalness) : color;
    const mesh = new THREE.Mesh(geometry, boxMaterial);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    truck.add(mesh);
    return mesh;
  };

  const navy = material('#001D38', 0.38, 0.22);
  const rubber = material('#303030', 0.94, 0.01);
  const steel = material('#bebebe', 0.35, 0.72);
  const glass = material('#F5FBFF', 0.17, 0.32);
  const white = material('#ffffff', 0.48, 0.06);
  const orange = material('#ff5e13', 0.48, 0.12);
  const lamp = material('#FDAE5C', 0.22, 0.2);

  // Chassis and cargo body.
  box([4.35, 0.24, 1.52], '#001D38', [-0.05, 0.76, 0]);
  const cargo = box([2.72, 1.78, 1.54], '#ffffff', [-0.62, 1.85, 0]);
  cargo.material = white;
  box([2.74, 0.12, 1.58], orange, [-0.62, 1.12, 0]);
  box([2.67, 0.08, 1.56], '#ffffff', [-0.62, 2.55, 0]);
  for (let x = -1.75; x < 0.52; x += 0.24) {
    box([0.035, 1.28, 0.015], '#E8E8E8', [x, 1.86, 0.78]);
  }
  // Cab, bonnet, roof marker lights.
  box([1.14, 1.12, 1.44], orange, [1.52, 1.58, 0]);
  box([0.78, 0.73, 1.35], '#fdae5c', [1.76, 1.83, 0]);
  box([0.54, 0.52, 1.37], glass, [2.05, 1.89, 0]);
  box([0.75, 0.10, 1.47], '#FF8B23', [1.72, 1.04, 0]);
  box([0.12, 0.62, 0.10], '#001D38', [1.35, 1.75, 0.75]);
  box([0.12, 0.62, 0.10], '#001D38', [1.35, 1.75, -0.75]);
  box([0.11, 0.12, 0.5], '#E8E8E8', [2.39, 1.25, 0]);
  box([0.08, 0.12, 0.24], '#001D38', [2.44, 1.45, 0]);
  box([0.08, 0.16, 0.22], '#FD8E5E', [2.42, 1.76, 0.57]);
  box([0.08, 0.16, 0.22], '#FD8E5E', [2.42, 1.76, -0.57]);
  box([0.09, 0.18, 0.26], '#ffffff', [2.43, 1.31, 0.58]);
  box([0.09, 0.18, 0.26], '#ffffff', [2.43, 1.31, -0.58]);
  box([0.18, 0.16, 0.2], '#001D38', [2.05, 1.18, 0.76]);
  box([0.18, 0.16, 0.2], '#001D38', [2.05, 1.18, -0.76]);
  box([0.12, 0.07, 0.28], '#FDAE5C', [0.96, 2.36, 0.54]);
  box([0.12, 0.07, 0.28], '#FDAE5C', [0.96, 2.36, -0.54]);

  // Axles, tyres and polished wheel hubs.
  const wheelGeometry = new THREE.CylinderGeometry(0.36, 0.36, 0.22, 28);
  geometries.push(wheelGeometry);
  const hubGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.24, 24);
  geometries.push(hubGeometry);
  const wheelPositions = [-1.46, 0.06, 1.78];
  for (const x of wheelPositions) {
    for (const z of [-0.79, 0.79]) {
      const wheel = new THREE.Mesh(wheelGeometry, rubber);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.39, z);
      wheel.castShadow = true;
      truck.add(wheel);
      const hub = new THREE.Mesh(hubGeometry, steel);
      hub.rotation.x = Math.PI / 2;
      hub.position.set(x, 0.39, z * 1.035);
      truck.add(hub);
      const hubCap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.25, 20), navy);
      hubCap.geometry.computeVertexNormals();
      geometries.push(hubCap.geometry);
      hubCap.rotation.x = Math.PI / 2;
      hubCap.position.set(x, 0.39, z * 1.05);
      truck.add(hubCap);
    }
  }
  box([0.08, 0.11, 0.08], '#fdae5c', [0.42, 0.84, 0.79]);
  box([0.08, 0.11, 0.08], '#fdae5c', [0.42, 0.84, -0.79]);

  // Trailer rear marking and subtle reflective details.
  box([0.04, 0.28, 1.5], '#FF3414', [-2, 1.74, 0]);
  box([0.045, 0.07, 0.65], lamp, [-2.03, 1.36, 0.34]);
  box([0.045, 0.07, 0.65], lamp, [-2.03, 1.36, -0.34]);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(2.7, 48),
    new THREE.MeshBasicMaterial({ color: '#00101b', transparent: true, opacity: 0.24, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.015;
  shadow.scale.set(1.25, 0.5, 1);
  truck.add(shadow);
  truck.rotation.y = -0.26;
  scene.add(truck);
  return { truck, materials, geometries };
}

export function HeroTruck() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [poster, setPoster] = useState(false);

  useEffect(() => {
    const host = containerRef.current;
    if (!host) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || window.innerWidth <= 768) {
      setPoster(true);
      return;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    let frame = 0;
    let dragging = false;
    let previous = { x: 0, y: 0 };
    let targetX = -0.16;
    let targetY = -0.26;
    let resizeObserver: ResizeObserver | undefined;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 80);
      camera.position.set(5.5, 3.2, 7.8);
      camera.lookAt(0, 0.8, 0);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
      renderer.setSize(host.clientWidth, host.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.appendChild(renderer.domElement);

      const ambient = new THREE.HemisphereLight('#F5FBFF', '#303030', 2.2);
      scene.add(ambient);
      const key = new THREE.DirectionalLight('#ffffff', 3.4);
      key.position.set(4, 8, 6);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      scene.add(key);
      const fill = new THREE.PointLight('#FDAE5C', 18, 16);
      fill.position.set(-4, 2, 2);
      scene.add(fill);
      const { truck, materials, geometries } = buildTruck(scene);

      const resize = () => {
        if (!renderer || !host) return;
        const width = Math.max(1, host.clientWidth);
        const height = Math.max(1, host.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);

      const onPointerDown = (event: PointerEvent) => {
        dragging = true;
        previous = { x: event.clientX, y: event.clientY };
        host.setPointerCapture(event.pointerId);
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!dragging) return;
        targetY += (event.clientX - previous.x) * 0.006;
        targetX = THREE.MathUtils.clamp(targetX + (event.clientY - previous.y) * 0.003, -0.38, 0.12);
        previous = { x: event.clientX, y: event.clientY };
      };
      const onPointerUp = () => { dragging = false; };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') targetY -= 0.16;
        if (event.key === 'ArrowRight') targetY += 0.16;
        if (event.key === 'ArrowUp') targetX = THREE.MathUtils.clamp(targetX - 0.08, -0.38, 0.12);
        if (event.key === 'ArrowDown') targetX = THREE.MathUtils.clamp(targetX + 0.08, -0.38, 0.12);
      };
      host.addEventListener('pointerdown', onPointerDown);
      host.addEventListener('pointermove', onPointerMove);
      host.addEventListener('pointerup', onPointerUp);
      host.addEventListener('pointercancel', onPointerUp);
      host.addEventListener('keydown', onKeyDown);

      const render = (time: number) => {
        frame = window.requestAnimationFrame(render);
        if (document.visibilityState !== 'visible') return;
        truck.rotation.y += (targetY - truck.rotation.y) * 0.045;
        truck.rotation.x += (targetX - truck.rotation.x) * 0.045;
        if (!dragging) truck.rotation.y += Math.sin(time * 0.00018) * 0.0005;
        renderer?.render(scene, camera);
      };
      frame = window.requestAnimationFrame(render);

      return () => {
        window.cancelAnimationFrame(frame);
        resizeObserver?.disconnect();
        host.removeEventListener('pointerdown', onPointerDown);
        host.removeEventListener('pointermove', onPointerMove);
        host.removeEventListener('pointerup', onPointerUp);
        host.removeEventListener('pointercancel', onPointerUp);
        host.removeEventListener('keydown', onKeyDown);
        materials.forEach((item) => item.dispose());
        geometries.forEach((item) => item.dispose());
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    } catch {
      setPoster(true);
      return () => {
        if (renderer) {
          renderer.dispose();
          renderer.domElement.remove();
        }
      };
    }
  }, []);

  return (
    <div className={`hero-truck ${poster ? 'hero-truck--poster' : ''}`} ref={containerRef} role="group" tabIndex={0} aria-label="Interactive 3D freight truck. Drag to orbit, or use the arrow keys.">
      {poster && <Image className="hero-truck__poster" src="/images/tanzania-freight-road.jpg" alt="Freight trucks moving along a rural East African road" width={500} height={333} priority />}
      <span className="truck-orbit-hint"><span className="orbit-dot" /> Drag to look around</span>
    </div>
  );
}
