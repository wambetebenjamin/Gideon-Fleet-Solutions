'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void; 'expired-callback'?: () => void }) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadRecaptchaScript(siteKey?: string) {
  if (window.grecaptcha) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = 'google-recaptcha-script';
    script.async = true;
    script.defer = true;
    script.src = siteKey
      ? `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
      : 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Google reCAPTCHA could not be loaded.'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export type CaptchaPayload = { captchaToken: string; captchaType: 'v2' | 'v3' };

export function useRecaptcha(action: string) {
  const [challengeRequired, setChallengeRequired] = useState(false);
  const [challengeToken, setChallengeToken] = useState('');
  const [challengeError, setChallengeError] = useState('');

  const getToken = async (): Promise<CaptchaPayload> => {
    if (challengeRequired) {
      if (!challengeToken) throw new Error('Complete the visible security challenge to continue.');
      return { captchaToken: challengeToken, captchaType: 'v2' };
    }
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) return { captchaToken: 'local-preview-bypass', captchaType: 'v3' };
    await loadRecaptchaScript(siteKey);
    const token = await new Promise<string>((resolve, reject) => {
      if (!window.grecaptcha) return reject(new Error('Google reCAPTCHA is not ready.'));
      window.grecaptcha.ready(() => {
        window.grecaptcha?.execute(siteKey, { action }).then(resolve).catch(reject);
      });
    });
    return { captchaToken: token, captchaType: 'v3' };
  };

  const handleCaptchaResponse = (response: { challengeRequired?: boolean; error?: string }) => {
    if (!response.challengeRequired) return false;
    setChallengeRequired(true);
    setChallengeToken('');
    setChallengeError(response.error || 'Please complete the security check below.');
    return true;
  };

  const setVisibleChallengeToken = useCallback((token: string) => {
    setChallengeToken(token);
    setChallengeError('');
  }, []);
  const resetChallenge = useCallback(() => {
    setChallengeRequired(false);
    setChallengeToken('');
    setChallengeError('');
  }, []);

  const challenge = (
    <CaptchaChallenge
      required={challengeRequired}
      error={challengeError}
      onToken={setVisibleChallengeToken}
    />
  );

  return { getToken, challengeRequired, handleCaptchaResponse, resetChallenge, challenge };
}

function CaptchaChallenge({ required, error, onToken }: { required: boolean; error: string; onToken: (token: string) => void }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<number | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY;

  useEffect(() => {
    if (!required) {
      if (widgetRef.current !== null) {
        window.grecaptcha?.reset(widgetRef.current);
        widgetRef.current = null;
      }
      return;
    }
    if (!siteKey || !elementRef.current || widgetRef.current !== null) return;
    let cancelled = false;
    loadRecaptchaScript().then(() => {
      if (cancelled || !elementRef.current || !window.grecaptcha) return;
      widgetRef.current = window.grecaptcha.render(elementRef.current, {
        sitekey: siteKey,
        callback: onToken,
        'expired-callback': () => onToken(''),
      });
    }).catch(() => undefined);
    return () => { cancelled = true; };
  }, [required, siteKey, onToken]);

  if (!required) return null;
  return (
    <div className="captcha-challenge" aria-live="polite">
      <div className="captcha-challenge__heading"><ShieldCheck size={16} aria-hidden="true" /><span>Additional security check</span></div>
      {siteKey ? <div ref={elementRef} /> : <p role="alert">The visible reCAPTCHA v2 challenge needs `NEXT_PUBLIC_RECAPTCHA_V2_SITE_KEY` configured.</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
