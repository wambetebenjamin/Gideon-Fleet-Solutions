'use client';

import * as THREE from 'three';
import { ArrowDownLeft, ArrowUpRight, Compass, Move3d, Route, X } from 'lucide-react';
import { PointerEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

type XRSessionLike = {
  end: () => Promise<void>;
  addEventListener: (type: 'end', listener: () => void, options?: AddEventListenerOptions) => void;
};
type XRApi = {
  requestSession: (mode: 'immersive-ar', options: { optionalFeatures: string[]; domOverlay?: { root: HTMLElement } }) => Promise<XRSessionLike>;
};
type RouteGlobeHandle = {
  enterAR: () => Promise<'started' | 'unavailable' | 'reduced'>;
  exitAR: () => Promise<void>;
};
type RouteGlobeProps = {
  previewActive: boolean;
  reducedMotion: boolean;
  onARState: (active: boolean) => void;
  overlayRoot: () => HTMLElement | null;
};

function drawMapTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) return new THREE.CanvasTexture(canvas);
  context.fillStyle = '#F5FBFF';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = 'rgba(0,29,56,.10)';
  context.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 128) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, canvas.height); context.stroke(); }
  for (let y = 0; y <= canvas.height; y += 64) { context.beginPath(); context.moveTo(0, y); context.lineTo(canvas.width, y); context.stroke(); }
  const point = (lon: number, lat: number) => ({ x: ((lon + 180) / 360) * canvas.width, y: ((90 - lat) / 180) * canvas.height });
  const land = [
    [-17, 37], [-2, 36], [9, 32], [24, 31], [34, 28], [42, 18], [51, 10], [49, -2], [42, -12], [39, -22], [27, -34], [19, -35], [12, -28], [9, -16], [3, -5], [-5, 4], [-15, 14], [-17, 37],
  ];
  context.beginPath();
  land.forEach(([lon, lat], index) => { const p = point(lon, lat); if (index === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y); });
  context.closePath();
  context.fillStyle = '#f7f7f7';
  context.fill();
  context.strokeStyle = 'rgba(0,29,56,.16)';
  context.stroke();

  const cities = [
    { name: 'NAIROBI', lon: 36.82, lat: -1.29 },
    { name: 'KAMPALA', lon: 32.58, lat: 0.35 },
    { name: 'KIGALI', lon: 30.06, lat: -1.94 },
    { name: 'DAR ES SALAAM', lon: 39.21, lat: -6.79 },
    { name: 'MOMBASA', lon: 39.67, lat: -4.04 },
  ];
  const routePoints = [cities[0], cities[1], cities[2], cities[3]];
  context.beginPath();
  routePoints.forEach((city, index) => { const p = point(city.lon, city.lat); if (index === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y); });
  context.strokeStyle = '#ff5e13';
  context.lineWidth = 4;
  context.setLineDash([9, 7]);
  context.stroke();
  context.setLineDash([]);
  cities.forEach((city, index) => {
    const p = point(city.lon, city.lat);
    context.beginPath();
    context.arc(p.x, p.y, index === 0 ? 8 : 5, 0, Math.PI * 2);
    context.fillStyle = index === 0 ? '#ff5e13' : '#596672';
    context.fill();
    context.strokeStyle = '#fff';
    context.lineWidth = 3;
    context.stroke();
  });
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

const RouteGlobe = forwardRef<RouteGlobeHandle, RouteGlobeProps>(function RouteGlobe({ previewActive, reducedMotion, onARState, overlayRoot }, ref) {
  const mountRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ dragging: false, x: 0, y: 0 });
  const angleRef = useRef({ x: -0.12, y: -0.64 });
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sessionRef = useRef<XRSessionLike | null>(null);
  const reducedMotionRef = useRef(reducedMotion);
  const previewActiveRef = useRef(previewActive);
  const arActiveRef = useRef(false);
  const onARStateRef = useRef(onARState);
  const [ready, setReady] = useState(false);
  reducedMotionRef.current = reducedMotion;
  previewActiveRef.current = previewActive;
  onARStateRef.current = onARState;

  const enterAR = useCallback(async () => {
    if (reducedMotionRef.current) return 'reduced' as const;
    const xr = (navigator as unknown as { xr?: XRApi }).xr;
    const renderer = rendererRef.current;
    if (!xr || !renderer) return 'unavailable' as const;
    let requestedSession: XRSessionLike | null = null;
    try {
      const root = overlayRoot();
      // requestSession is invoked directly from the user's click gesture; unsupported browsers fall back to 360 mode.
      const session = await xr.requestSession('immersive-ar', {
        optionalFeatures: ['local-floor', 'dom-overlay'],
        ...(root ? { domOverlay: { root } } : {}),
      });
      requestedSession = session;
      sessionRef.current = session;
      const onEnd = () => {
        if (sessionRef.current === session) sessionRef.current = null;
        arActiveRef.current = false;
        onARStateRef.current(false);
      };
      session.addEventListener('end', onEnd, { once: true });
      await renderer.xr.setSession(session as Parameters<typeof renderer.xr.setSession>[0]);
      arActiveRef.current = true;
      onARStateRef.current(true);
      return 'started' as const;
    } catch {
      if (requestedSession) {
        try { await requestedSession.end(); } catch { /* The session may already be closed. */ }
      }
      sessionRef.current = null;
      arActiveRef.current = false;
      onARStateRef.current(false);
      return 'unavailable' as const;
    }
  }, [overlayRoot]);

  const exitAR = useCallback(async () => {
    const session = sessionRef.current;
    if (session) {
      try { await session.end(); } catch { /* The browser may already have ended the XR session. */ }
    }
    sessionRef.current = null;
    arActiveRef.current = false;
    onARStateRef.current(false);
  }, []);

  useImperativeHandle(ref, () => ({ enterAR, exitAR }), [enterAR, exitAR]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer | null = null;
    let observer: ResizeObserver | undefined;
    let globe: THREE.Group | null = null;
    const dispose: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = [];
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.set(0, 0.12, 6.7);
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.xr.enabled = true;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      mount.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      const sphere = new THREE.SphereGeometry(1.9, 64, 40);
      const texture = drawMapTexture();
      const earthMaterial = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.93, metalness: 0 });
      const earth = new THREE.Mesh(sphere, earthMaterial);
      globe = new THREE.Group();
      globe.add(earth);
      const atmosphereGeometry = new THREE.SphereGeometry(1.96, 48, 32);
      const atmosphereMaterial = new THREE.MeshBasicMaterial({ color: '#ff9d59', transparent: true, opacity: 0.12, side: THREE.BackSide });
      const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
      globe.add(atmosphere);
      scene.add(globe);
      dispose.push(sphere, texture, earthMaterial, atmosphereGeometry, atmosphereMaterial);
      const light = new THREE.HemisphereLight('#fff8ea', '#80969a', 2.3);
      scene.add(light);
      const key = new THREE.DirectionalLight('#fff5df', 3.2);
      key.position.set(-3, 3, 6);
      scene.add(key);
      const resize = () => {
        if (!renderer || !mount) return;
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      observer = new ResizeObserver(resize);
      observer.observe(mount);
      renderer.setAnimationLoop(() => {
        if (document.visibilityState !== 'visible') return;
        if (globe) {
          globe.rotation.y += (angleRef.current.y - globe.rotation.y) * 0.08;
          globe.rotation.x += (angleRef.current.x - globe.rotation.x) * 0.08;
          if (previewActiveRef.current && !dragRef.current.dragging && !arActiveRef.current && !reducedMotionRef.current) angleRef.current.y += 0.00018;
        }
        renderer?.render(scene, camera);
      });
      setReady(true);
      return () => {
        observer?.disconnect();
        void sessionRef.current?.end().catch(() => undefined);
        renderer?.setAnimationLoop(null);
        renderer?.dispose();
        renderer?.domElement.remove();
        rendererRef.current = null;
        dispose.forEach((item) => item.dispose());
      };
    } catch {
      setReady(false);
      return () => {
        observer?.disconnect();
        renderer?.setAnimationLoop(null);
        renderer?.dispose();
        renderer?.domElement.remove();
        rendererRef.current = null;
      };
    }
  }, []);

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest('button')) return;
    dragRef.current = { dragging: true, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.dragging) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    angleRef.current.y += dx * 0.008;
    angleRef.current.x = THREE.MathUtils.clamp(angleRef.current.x + dy * 0.006, -0.65, 0.65);
    dragRef.current.x = event.clientX;
    dragRef.current.y = event.clientY;
  };
  const pointerUp = () => { dragRef.current.dragging = false; };
  const keyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'ArrowLeft') angleRef.current.y -= 0.15;
    if (event.key === 'ArrowRight') angleRef.current.y += 0.15;
    if (event.key === 'ArrowUp') angleRef.current.x = THREE.MathUtils.clamp(angleRef.current.x - 0.1, -0.65, 0.65);
    if (event.key === 'ArrowDown') angleRef.current.x = THREE.MathUtils.clamp(angleRef.current.x + 0.1, -0.65, 0.65);
  };

  return (
    <div className={`route-globe ${ready ? 'is-ready' : ''}`} ref={mountRef} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onLostPointerCapture={pointerUp} onKeyDown={keyboard} role="group" aria-label="Interactive 3D map of East African freight routes. Drag to rotate, or use the arrow keys." tabIndex={0}>
      {!ready && <div className="route-globe-fallback" aria-hidden="true"><span className="fallback-map-grid" /><Route size={38} /><span>NAIROBI · KAMPALA · DAR</span></div>}
      <div className="globe-coordinates" aria-hidden="true"><span>01°17′S</span><span>36°49′E</span></div>
      {arActiveRef.current && <span className="globe-ar-chip"><Move3d size={13} /> AR session active</span>}
    </div>
  );
});

export function RouteExplorer() {
  const globeRef = useRef<RouteGlobeHandle>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [previewActive, setPreviewActive] = useState(false);
  const [arActive, setArActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);
    const changed = () => setReducedMotion(query.matches);
    query.addEventListener('change', changed);
    return () => query.removeEventListener('change', changed);
  }, []);

  const handleARState = useCallback((active: boolean) => {
    setArActive(active);
    if (!active && previewActive) setMessage('AR session ended. The draggable 360° preview is still available.');
  }, [previewActive]);

  useEffect(() => {
    if (!reducedMotion || !arActive) return;
    void globeRef.current?.exitAR();
    setMessage('Reduced motion is on. AR ended; the still, draggable 360° map is available.');
  }, [reducedMotion, arActive]);

  const enter = async () => {
    setPreviewActive(true);
    if (reducedMotion) {
      setMessage('Reduced motion is on. The static 360° map is ready to rotate by touch or arrow keys; AR stays off.');
      return;
    }
    setMessage('Opening an optional AR session. If it is unavailable, the draggable 360° map will remain ready.');
    const result = await globeRef.current?.enterAR();
    if (result === 'started') {
      setArActive(true);
      setMessage('AR view is active. Use the Exit control in this panel or your device’s system control to leave.');
    } else {
      setArActive(false);
      setMessage('AR is not available or permission was declined. Explore the draggable 360° map instead.');
    }
  };

  const exit = async () => {
    if (arActive) await globeRef.current?.exitAR();
    setPreviewActive(false);
    setArActive(false);
    setMessage('Route preview closed.');
  };

  return (
    <section className="route-section section-shell" id="routes" aria-labelledby="route-title">
      <div className="container route-demo-grid">
        <div className="route-demo-copy">
          <span className="eyebrow eyebrow--orange">A connected region</span>
          <h2 id="route-title">Explore our routes <em>in 3D.</em></h2>
          <p>From Nairobi, we connect businesses with customers and partners across Kenya and the wider East African corridor.</p>
          <ul className="route-list"><li><span><i />Nairobi</span><small>Operations hub</small></li><li><span><i />Mombasa</span><small>Coastal corridor</small></li><li><span><i />Kampala</span><small>Regional connection</small></li><li><span><i />Dar es Salaam</span><small>Cross-border network</small></li></ul>
          <button className="button button--primary route-enter" type="button" onClick={enter} disabled={previewActive && arActive}><Compass size={16} aria-hidden="true" /> {arActive ? 'AR View Active' : previewActive ? '360° View Ready' : reducedMotion ? 'Enter 360° View' : 'Enter AR View'} <ArrowUpRight size={15} aria-hidden="true" /></button>
          <p className="route-consent-note">The preview starts only when you choose to enter. {reducedMotion && 'Reduced-motion mode keeps this to a still, draggable map; AR remains off.'}</p>
          <span className="route-message" role="status" aria-live="polite">{message}</span>
        </div>
        <div className={`route-demo-visual ${previewActive ? 'is-preview-active' : ''}`} ref={visualRef}>
          <div className="route-demo-label"><span><Move3d size={15} /> EXPLORE OUR ROUTES IN 3D</span><span className="route-demo-index">02 / 06</span></div>
          <RouteGlobe ref={globeRef} previewActive={previewActive} reducedMotion={reducedMotion} onARState={handleARState} overlayRoot={() => visualRef.current} />
          {previewActive && <button className="route-exit" type="button" onClick={exit} aria-label={arActive ? 'Exit augmented reality route view' : 'Close 360 degree route preview'}><X size={14} aria-hidden="true" /> {arActive ? 'Exit AR' : 'Exit preview'}</button>}
          <div className="route-demo-legend"><span><i className="legend-dot legend-dot--orange" /> Frequent corridor</span><span><i className="legend-dot legend-dot--teal" /> Hub city</span><span className="drag-cue"><ArrowDownLeft size={13} /> DRAG TO ROTATE</span></div>
        </div>
      </div>
    </section>
  );
}
