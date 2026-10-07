'use client';

import { ArrowRight, Clock3, MapPin, PackageCheck, RefreshCw, ShieldCheck, Truck, UserRound, Wifi } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRecaptcha } from '@/components/recaptcha';

type Shipment = {
  waybill: string;
  status: string;
  currentLocation: string;
  driverName: string;
  estimatedArrival: string;
  latitude: number;
  longitude: number;
  origin: string;
  destination: string;
  lastUpdated: string;
  demo?: boolean;
};

type Peer = { id: string; x: number; y: number; color: string; at: number };
const cursorColors = ['#ff5e13', '#596672', '#ffbd78', '#183f5b'];
const waybillPattern = /^(GFS|GFS-EA)-[A-Z0-9]{4,12}$/i;

function useTrackingPresence() {
  const [peers, setPeers] = useState<Peer[]>([]);
  const [liveMode, setLiveMode] = useState<'local' | 'websocket' | 'alone'>('alone');
  const localId = useRef('');
  const channelRef = useRef<BroadcastChannel | null>(null);
  const color = useRef(cursorColors[Math.floor(Math.random() * cursorColors.length)]);

  useEffect(() => {
    localId.current = window.crypto?.randomUUID?.() || `visitor-${Date.now()}`;
    const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('gideon-tracking-presence') : null;
    channelRef.current = channel;
    let heartbeat: number | undefined;
    let socket: WebSocket | null = null;
    let reconnectTimer: number | undefined;
    let reconnectDelay = 1500;
    let stopped = false;
    const addPeer = (peer: Peer) => setPeers((current) => {
      const next = current.filter((item) => item.id !== peer.id);
      return [...next, peer].slice(-8);
    });
    const onMessage = (event: MessageEvent) => {
      const data = event.data as Partial<Peer> & { type?: string };
      if (data.id && data.id !== localId.current && typeof data.x === 'number' && typeof data.y === 'number' && typeof data.color === 'string') {
        addPeer({ id: data.id, x: data.x, y: data.y, color: data.color, at: Date.now() });
      }
    };

    if (channel) {
      channel.addEventListener('message', onMessage);
      const announce = () => channel.postMessage({ id: localId.current, x: 50, y: 50, color: color.current, at: Date.now() });
      announce();
      heartbeat = window.setInterval(announce, 5000);
      setLiveMode('local');
    }

    const socketUrl = process.env.NEXT_PUBLIC_TRACKING_WS_URL;
    const connect = () => {
      if (!socketUrl || stopped) return;
      try {
        const ws = new WebSocket(socketUrl);
        socket = ws;
        ws.onopen = () => {
          reconnectDelay = 1500;
          setLiveMode('websocket');
          ws.send(JSON.stringify({ type: 'join', id: localId.current, color: color.current, room: 'shipments' }));
        };
        ws.onmessage = (event) => {
          try { onMessage({ data: JSON.parse(String(event.data)) } as MessageEvent); } catch { /* Ignore malformed presence packets. */ }
        };
        ws.onclose = () => {
          if (stopped) return;
          setLiveMode(channel ? 'local' : 'alone');
          reconnectTimer = window.setTimeout(connect, reconnectDelay);
          reconnectDelay = Math.min(reconnectDelay * 2, 12000);
        };
        ws.onerror = () => ws.close();
      } catch {
        reconnectTimer = window.setTimeout(connect, reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 12000);
      }
    };
    connect();

    const prune = window.setInterval(() => setPeers((current) => current.filter((peer) => Date.now() - peer.at < 11000)), 3000);
    return () => {
      stopped = true;
      channel?.removeEventListener('message', onMessage);
      channel?.close();
      channelRef.current = null;
      if (heartbeat) window.clearInterval(heartbeat);
      window.clearInterval(prune);
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);

  const updateCursor = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100));
    channelRef.current?.postMessage({ id: localId.current, x, y, color: color.current, at: Date.now() });
  };

  return { peers, liveMode, updateCursor };
}

export function TrackingBoard() {
  const [waybill, setWaybill] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState(false);
  const captcha = useRecaptcha('track');
  const presence = useTrackingPresence();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanWaybill = waybill.trim().toUpperCase();
    if (!waybillPattern.test(cleanWaybill)) {
      setInvalid(true);
      setError('Enter a waybill like GFS-24851.');
      return;
    }
    setInvalid(false);
    setError('');
    setLoading(true);
    setShipment(null);
    try {
      const token = await captcha.getToken();
      const response = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waybill: cleanWaybill, ...token }),
      });
      const result = (await response.json()) as { shipment?: Shipment; error?: string; challengeRequired?: boolean };
      if (captcha.handleCaptchaResponse(result)) {
        setError(result.error || 'Complete the security check below, then try again.');
        return;
      }
      if (!response.ok || !result.shipment) throw new Error(result.error || 'We could not find that waybill.');
      setShipment(result.shipment);
      captcha.resetChallenge();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Tracking is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  }

  const mapUrl = shipment
    ? `https://maps.google.com/maps?q=${shipment.latitude},${shipment.longitude}&z=10&output=embed`
    : 'https://maps.google.com/maps?q=Nairobi%20Kenya&t=&z=7&ie=UTF8&iwloc=&output=embed';

  return (
    <section className="tracking-section section-shell" id="tracking-board" aria-labelledby="tracking-title">
      <div className="section-heading section-heading--split">
        <div><span className="eyebrow eyebrow--orange">Always in view</span><h2 id="tracking-title">Every delivery has a <em>next step.</em></h2></div>
        <p>Follow your consignment from first pickup to final handover. One waybill, clear updates, and a real person if plans change.</p>
      </div>
      <div className="tracking-panel">
        <div className="tracking-map-panel" onPointerMove={presence.updateCursor}>
          <div className="tracking-map-head"><div><span className="map-status-dot" /><span>{presence.liveMode === 'websocket' ? 'Connected presence service' : presence.liveMode === 'local' ? 'Same-browser tab presence' : 'Presence preview'}</span></div><span className="map-users"><span className="user-stacks"><i>G</i>{presence.peers.slice(0, 2).map((peer, index) => <i key={peer.id} style={{ background: peer.color }}>{index + 1}</i>)}</span>{presence.peers.length > 0 ? `${presence.peers.length + 1} viewing` : 'Just you for now'}</span></div>
          <div className="map-art" role="img" aria-label="Illustrative East African route overview with sample waybill GFS-24851">
            <svg className="map-lines" viewBox="0 0 700 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <path d="M-20 94C98 100 113 157 207 151s122-88 211-64 86 105 181 97 92-46 139-34M-30 248c111-12 137-92 226-84s114 98 216 89 129-40 196 6 70 70 138 66M80-10c-4 99 48 105 45 195s-56 86-47 220M342-30c23 69-5 130 21 195s69 68 67 147M574-20c-33 71-8 130 11 186s-10 122 12 228" />
              <path className="map-route" d="M146 262C185 220 228 203 281 184s83-22 125-45 59-41 106-63" />
            </svg>
            <span className="map-label map-label--nairobi"><i />Nairobi</span><span className="map-label map-label--nakuru"><i />Nakuru</span><span className="map-label map-label--mombasa"><i />Mombasa</span><span className="map-label map-label--kampala"><i />Kampala</span>
            <span className="map-truck-marker"><Truck size={18} /></span>
            <span className="map-live-pin"><i /><b>DEMO · GFS-24851</b></span>
            <span className="map-cursor-dot map-cursor-dot--one" /><span className="map-cursor-dot map-cursor-dot--two" />
            {presence.peers.map((peer) => <span key={peer.id} className="peer-cursor" style={{ left: `${peer.x}%`, top: `${peer.y}%`, backgroundColor: peer.color }} aria-hidden="true" />)}
            <span className="map-scale">EAST AFRICA · ROUTE VIEW</span>
          </div>
          <div className="tracking-map-footer"><span><i className="legend-dot legend-dot--orange" /> Sample route</span><span><i className="legend-dot legend-dot--teal" /> Regional hubs</span><span className="live-state"><Wifi size={13} /> {presence.liveMode === 'websocket' ? 'Presence connected' : presence.liveMode === 'local' ? 'This browser only' : 'Preview mode'}</span></div>
        </div>
        <div className="tracking-side-panel">
          <div className="tracking-side-top"><span className="mini-overline">SHIPMENT LOOKUP</span><span className="tracking-tag"><span className="live-signal"><i /></span> READY</span></div>
          <h3>Where should we look?</h3>
          <p>Enter the waybill number from your dispatch note.</p>
          <form className="tracking-form" onSubmit={submit} noValidate>
            <label htmlFor="waybill-number">Waybill number</label>
            <div className={`waybill-control ${invalid ? 'is-invalid' : ''}`}>
              <PackageCheck size={17} aria-hidden="true" />
              <input id="waybill-number" name="waybill" value={waybill} onChange={(event) => { setWaybill(event.target.value); setInvalid(false); setError(''); }} placeholder="e.g. GFS-24851" aria-invalid={invalid} aria-describedby={error ? 'waybill-error' : 'waybill-hint'} />
              <button type="submit" aria-label="Track shipment" disabled={loading}>{loading ? <RefreshCw className="spin" size={17} /> : <ArrowRight size={17} />}</button>
            </div>
            <span id="waybill-hint" className="field-hint">Try demo waybill GFS-24851</span>
            {error && <span id="waybill-error" className="field-error" role="alert">{error}</span>}
            {captcha.challenge}
          </form>
          <div className="tracking-side-promise"><span><ShieldCheck size={16} /></span><p><strong>Keep one reference.</strong><small>Use the waybill on your dispatch note.</small></p></div>
          <div className="tracking-service-stats"><span><MapPin size={14} /> Waybill lookup</span><span><Clock3 size={14} /> Nairobi operations</span></div>
        </div>
      </div>

      <div className="tracking-result-wrap" aria-busy={loading}>
        {loading && <div className="tracking-result skeleton-result"><div className="skeleton-map" /><div className="skeleton-details"><i /><i /><i /></div></div>}
        {shipment && !loading && (
          <div className="tracking-result">
            <div className="tracking-result__info">
              <div className="tracking-result__eyebrow"><span className="live-signal"><i /></span> Shipment status <span className="demo-label">{shipment.demo ? 'DEMO' : 'LIVE'}</span></div>
              <h3>{shipment.status}</h3>
              <p className="tracking-waybill">Waybill <strong>{shipment.waybill}</strong></p>
              <div className="tracking-facts">
                <div><MapPin size={15} /><span><small>Current location</small><strong>{shipment.currentLocation}</strong></span></div>
                <div><UserRound size={15} /><span><small>Driver</small><strong>{shipment.driverName}</strong></span></div>
                <div><Clock3 size={15} /><span><small>Estimated arrival</small><strong>{shipment.estimatedArrival}</strong></span></div>
              </div>
              <span className="last-updated">Updated {new Date(shipment.lastUpdated).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' })} EAT · {shipment.origin} to {shipment.destination}</span>
            </div>
            <div className="tracking-result__map"><iframe src={mapUrl} title={`Google Maps view of shipment location near ${shipment.currentLocation}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /><span className="google-map-marker"><MapPin size={16} fill="currentColor" /> {shipment.demo ? 'Demo location' : 'Current location'}</span></div>
          </div>
        )}
      </div>
    </section>
  );
}
