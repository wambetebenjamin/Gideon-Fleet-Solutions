'use client';

import Link from 'next/link';
import { Check, Settings2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Preferences = { necessary: true; functional: boolean; analytics: boolean; marketing: boolean };
const KEY = 'gideon-fleet-cookie-consent-v1';
const defaults: Preferences = { necessary: true, functional: false, analytics: false, marketing: false };

export function CookieConsent() {
  const [visible, setVisible] = useState(true);
  const [manageOpen, setManageOpen] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaults);
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wantsManage = new URLSearchParams(window.location.search).get('cookie-settings') === 'open';
    try {
      const saved = window.localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Preferences;
        setPreferences({ ...defaults, ...parsed, necessary: true });
      }
      setVisible(!saved || wantsManage);
      setManageOpen(wantsManage);
      if (wantsManage) window.history.replaceState({}, '', window.location.pathname + window.location.hash);
    } catch {
      try { window.localStorage.removeItem(KEY); } catch { /* Storage is optional; the banner remains available. */ }
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!manageOpen) return;
    const modal = modalRef.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () => modal?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])') ?? [];
    const first = focusable()[0];
    first?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setManageOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(focusable());
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
        event.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', trapFocus);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [manageOpen]);

  const persist = (next: Preferences) => {
    setPreferences(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ ...next, necessary: true, savedAt: new Date().toISOString() }));
    } catch { /* The consent choice still applies for this page if storage is unavailable. */ }
    setVisible(false);
    setManageOpen(false);
  };

  if (!visible) return null;

  return (
    <>
      <aside className="cookie-banner" aria-label="Cookie consent">
        <div className="cookie-copy">
          <span className="cookie-icon" aria-hidden="true"><Settings2 size={18} /></span>
          <p>Gideon Fleet Solutions uses cookies to remember your preferences, protect forms, and support optional analytics. See our <Link href="/legal/cookie-policy">Cookie Policy</Link>.</p>
        </div>
        <div className="cookie-actions">
          <button className="button button--quiet" type="button" onClick={() => setManageOpen(true)}>Manage Preferences</button>
          <button className="button button--dark" type="button" onClick={() => persist({ necessary: true, functional: true, analytics: true, marketing: true })}>Accept All <Check aria-hidden="true" size={15} /></button>
        </div>
      </aside>

      {manageOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setManageOpen(false); }}>
          <section className="cookie-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="cookie-title" tabIndex={-1}>
            <button className="modal-close" type="button" aria-label="Close preferences" onClick={() => setManageOpen(false)}><X size={19} /></button>
            <span className="eyebrow">Your privacy matters</span>
            <h2 id="cookie-title">Cookie preferences</h2>
            <p className="muted">Choose which optional cookies Gideon Fleet Solutions may use. Necessary cookies keep the site and shipment tools working.</p>
            <div className="preference-list">
              {([
                ['necessary', 'Necessary', 'Always active · required for core site functions'],
                ['functional', 'Functional', 'Remember your preferences and waybill searches'],
                ['analytics', 'Analytics', 'Help us understand how people use our services'],
                ['marketing', 'Marketing', 'Support relevant service updates and offers'],
              ] as const).map(([key, label, detail]) => (
                <label className="preference-row" key={key}>
                  <span><strong>{label}</strong><small>{detail}</small></span>
                  <input
                    type="checkbox"
                    checked={preferences[key]}
                    disabled={key === 'necessary'}
                    onChange={(event) => setPreferences((current) => ({ ...current, [key]: event.target.checked, necessary: true }))}
                    aria-label={`${label} cookies`}
                  />
                </label>
              ))}
            </div>
            <div className="modal-actions">
              <button className="button button--quiet" type="button" onClick={() => persist(defaults)}>Necessary only</button>
              <button className="button button--primary" type="button" onClick={() => persist(preferences)}>Save preferences <Check size={15} /></button>
            </div>
            <p className="privacy-note">Preferences are stored in this browser in accordance with Kenya&apos;s Data Protection Act, 2019. <Link href="/legal/privacy-policy">Read our Privacy Policy</Link>.</p>
          </section>
        </div>
      )}
    </>
  );
}
