'use client';

import { ArrowRight, LoaderCircle, Paperclip } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useRecaptcha } from '@/components/recaptcha';

type Result = { ok?: boolean; error?: string; message?: string; reference?: string; challengeRequired?: boolean };
type FormStatus = { kind: 'idle' | 'success' | 'error'; text: string };

async function jsonResult(response: Response) {
  return (await response.json().catch(() => ({}))) as Result;
}

function StatusMessage({ status }: { status: FormStatus }) {
  if (status.kind === 'idle' || !status.text) return null;
  return <p className={`form-status form-status--${status.kind}`} role={status.kind === 'error' ? 'alert' : 'status'}>{status.text}</p>;
}

function CaptchaFields({ captcha }: { captcha: ReturnType<typeof useRecaptcha> }) {
  return <div className="captcha-wrap"><p className="captcha-note">Protected by reCAPTCHA. Google <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">Privacy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noreferrer">Terms</a> apply.</p>{captcha.challenge}</div>;
}

export function QuoteForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle', text: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const captcha = useRecaptcha('quote');

  const validateBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const input = event.currentTarget;
    const message = !input.checkValidity() ? (input.validity.typeMismatch ? 'Enter a valid email address.' : 'This field is required.') : '';
    setErrors((current) => ({ ...current, [input.name]: message }));
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const formData = new FormData(form);
    const values = Object.fromEntries(formData.entries());
    setStatus({ kind: 'idle', text: '' });
    setErrors({});
    setBusy(true);
    try {
      const token = await captcha.getToken();
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, ...token }),
      });
      const result = await jsonResult(response);
      if (captcha.handleCaptchaResponse(result)) {
        setStatus({ kind: 'error', text: result.error || 'Complete the extra security check, then submit again.' });
        return;
      }
      if (!response.ok || !result.ok) throw new Error(result.error || 'We could not submit your quote request.');
      setStatus({ kind: 'success', text: `${result.message || 'Quote request received.'} Reference ${result.reference}.` });
      captcha.resetChallenge();
      form.reset();
    } catch (error) {
      setStatus({ kind: 'error', text: error instanceof Error ? error.message : 'We could not submit your quote request.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="quote-form form-card" onSubmit={submit} noValidate>
      <div className="form-heading-row">
        <div><span className="eyebrow eyebrow--orange">Start a shipment</span><h3>Request a freight quote</h3></div>
        <span className="form-label-writing" aria-hidden="true">Let’s plan it well</span>
      </div>
      <div className="form-grid">
        <label className="field"><span>Origin city <b>*</b></span><input name="origin" autoComplete="address-level2" placeholder="e.g. Nairobi" required aria-invalid={Boolean(errors.origin)} aria-describedby={errors.origin ? 'quote-origin-error' : undefined} onBlur={validateBlur} onChange={() => setErrors((current) => ({ ...current, origin: '' }))} />{errors.origin && <small id="quote-origin-error" className="field-error">{errors.origin}</small>}</label>
        <label className="field"><span>Destination city <b>*</b></span><input name="destination" placeholder="e.g. Mombasa" required aria-invalid={Boolean(errors.destination)} aria-describedby={errors.destination ? 'quote-destination-error' : undefined} onBlur={validateBlur} onChange={() => setErrors((current) => ({ ...current, destination: '' }))} />{errors.destination && <small id="quote-destination-error" className="field-error">{errors.destination}</small>}</label>
        <label className="field"><span>Cargo type <b>*</b></span><select name="cargoType" defaultValue="" required aria-invalid={Boolean(errors.cargoType)} onBlur={validateBlur} onChange={() => setErrors((current) => ({ ...current, cargoType: '' }))}><option value="" disabled>Select cargo type</option><option>General goods</option><option>Refrigerated / perishables</option><option>Construction materials</option><option>E-commerce parcels</option><option>Machinery / oversized</option><option>Other</option></select></label>
        <div className="field-pair">
          <label className="field"><span>Weight <small>(kg)</small></span><input name="weightKg" type="number" min="0" step="1" placeholder="0" inputMode="decimal" /></label>
          <label className="field"><span>Volume <small>(cbm)</small></span><input name="volumeCbm" type="number" min="0" step="0.1" placeholder="0.0" inputMode="decimal" /></label>
        </div>
        <label className="field"><span>Pickup date</span><input name="pickupDate" type="date" /></label>
        <label className="field"><span>Contact name <b>*</b></span><input name="contactName" autoComplete="name" placeholder="Your name" required aria-invalid={Boolean(errors.contactName)} onBlur={validateBlur} onChange={() => setErrors((current) => ({ ...current, contactName: '' }))} /></label>
        <label className="field"><span>Phone <b>*</b></span><input name="phone" type="tel" autoComplete="tel" placeholder="+254 712 345 678" required aria-invalid={Boolean(errors.phone)} onBlur={validateBlur} onChange={() => setErrors((current) => ({ ...current, phone: '' }))} /></label>
        <label className="field"><span>Email <b>*</b></span><input name="email" type="email" autoComplete="email" placeholder="you@company.co.ke" required aria-invalid={Boolean(errors.email)} onBlur={validateBlur} onChange={() => setErrors((current) => ({ ...current, email: '' }))} /></label>
        <label className="field field--wide"><span>Notes <small>(optional)</small></span><textarea name="notes" rows={3} placeholder="Handling needs, delivery windows, or anything else we should know." maxLength={1500} /></label>
      </div>
      <CaptchaFields captcha={captcha} />
      <div className="form-submit-row"><p className="form-consent">By submitting, you agree to our <a href="/legal/privacy-policy">Privacy Policy</a>.</p><button className="button button--clay" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={16} /> Sending request</> : <>Send quote request <ArrowRight size={16} aria-hidden="true" /></>}</button></div>
      <StatusMessage status={status} />
    </form>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle', text: '' });
  const [busy, setBusy] = useState(false);
  const captcha = useRecaptcha('contact');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: 'idle', text: '' });
    setBusy(true);
    try {
      const token = await captcha.getToken();
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, ...token }) });
      const result = await jsonResult(response);
      if (captcha.handleCaptchaResponse(result)) {
        setStatus({ kind: 'error', text: result.error || 'Complete the extra security check, then submit again.' });
        return;
      }
      if (!response.ok || !result.ok) throw new Error(result.error || 'We could not send your enquiry.');
      setStatus({ kind: 'success', text: result.message || 'Thanks — our team will be in touch.' });
      captcha.resetChallenge();
      form.reset();
    } catch (error) {
      setStatus({ kind: 'error', text: error instanceof Error ? error.message : 'We could not send your enquiry.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="form-grid form-grid--two">
        <label className="field"><span>Your name <b>*</b></span><input name="name" autoComplete="name" placeholder="Full name" required /></label>
        <label className="field"><span>Phone</span><input name="phone" type="tel" autoComplete="tel" placeholder="+254 ..." /></label>
        <label className="field field--wide"><span>Email <b>*</b></span><input name="email" type="email" autoComplete="email" placeholder="you@company.co.ke" required /></label>
        <label className="field field--wide"><span>How can we help? <b>*</b></span><textarea name="message" rows={4} maxLength={2500} placeholder="Tell us about your route or delivery need…" required /></label>
      </div>
      <CaptchaFields captcha={captcha} />
      <button className="button button--primary" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={16} /> Sending</> : <>Send enquiry <ArrowRight size={16} aria-hidden="true" /></>}</button>
      <StatusMessage status={status} />
    </form>
  );
}

export function PartnerForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle', text: '' });
  const [busy, setBusy] = useState(false);
  const captcha = useRecaptcha('partner');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus({ kind: 'idle', text: '' });
    setBusy(true);
    try {
      const token = await captcha.getToken();
      data.append('captchaToken', token.captchaToken);
      data.append('captchaType', token.captchaType);
      const response = await fetch('/api/partner', { method: 'POST', body: data });
      const result = await jsonResult(response);
      if (captcha.handleCaptchaResponse(result)) {
        setStatus({ kind: 'error', text: result.error || 'Complete the extra security check, then submit again.' });
        return;
      }
      if (!response.ok || !result.ok) throw new Error(result.error || 'We could not submit your application.');
      setStatus({ kind: 'success', text: `${result.message || 'Application received.'} Reference ${result.reference}.` });
      captcha.resetChallenge();
      form.reset();
    } catch (error) {
      setStatus({ kind: 'error', text: error instanceof Error ? error.message : 'We could not submit your application.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="partner-form form-card" onSubmit={submit}>
      <div className="form-heading-row"><div><span className="eyebrow eyebrow--orange">Grow with us</span><h3>Join the Gideon Fleet Network</h3></div><span className="partner-badge">Driver or owner</span></div>
      <p className="muted">We’re building a dependable network for drivers and fleet partners across East Africa.</p>
      <div className="form-grid form-grid--two">
        <label className="field"><span>Name <b>*</b></span><input name="name" autoComplete="name" required placeholder="Full name" /></label>
        <label className="field"><span>Phone <b>*</b></span><input name="phone" type="tel" autoComplete="tel" required placeholder="+254 712 345 678" /></label>
        <label className="field"><span>Email <b>*</b></span><input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label>
        <label className="field"><span>Vehicle type <b>*</b></span><select name="vehicleType" defaultValue="" required><option value="" disabled>Select a vehicle</option><option>Motorcycle</option><option>Pickup / van</option><option>3-ton truck</option><option>7-ton truck</option><option>Prime mover / trailer</option><option>Refrigerated vehicle</option></select></label>
        <label className="field"><span>Registration number <b>*</b></span><input name="registration" required placeholder="KDA 123A" /></label>
        <label className="field"><span>Years of driving <b>*</b></span><input name="experience" type="number" min="0" max="70" required placeholder="Years" /></label>
        <label className="field field--wide file-field"><span>Driving licence <b>*</b></span><span className="file-control"><Paperclip size={15} aria-hidden="true" /><span>Choose PDF, JPG, or PNG · max 2 MB</span><input type="file" name="drivingLicence" accept="application/pdf,image/jpeg,image/png" required /></span></label>
        <label className="field field--wide file-field"><span>Vehicle logbook <b>*</b></span><span className="file-control"><Paperclip size={15} aria-hidden="true" /><span>Choose PDF, JPG, or PNG · max 2 MB</span><input type="file" name="vehicleLogbook" accept="application/pdf,image/jpeg,image/png" required /></span></label>
      </div>
      <p className="document-privacy">Your documents are uploaded to private storage and reviewed only by our fleet team.</p>
      <CaptchaFields captcha={captcha} />
      <button className="button button--clay" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="spin" size={16} /> Sending application</> : <>Submit partner application <ArrowRight size={16} /></>}</button>
      <StatusMessage status={status} />
    </form>
  );
}

export function NewsletterForm() {
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle', text: '' });
  const [busy, setBusy] = useState(false);
  const captcha = useRecaptcha('newsletter');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get('email') || '').trim();
    setStatus({ kind: 'idle', text: '' });
    setBusy(true);
    try {
      const token = await captcha.getToken();
      const response = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, ...token }) });
      const result = await jsonResult(response);
      if (captcha.handleCaptchaResponse(result)) {
        setStatus({ kind: 'error', text: result.error || 'Complete the extra security check, then submit again.' });
        return;
      }
      if (!response.ok || !result.ok) throw new Error(result.error || 'Please try again.');
      setStatus({ kind: 'success', text: result.message || 'You are subscribed.' });
      captcha.resetChallenge();
      form.reset();
    } catch (error) {
      setStatus({ kind: 'error', text: error instanceof Error ? error.message : 'Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <div className="newsletter-input"><input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder="Your work email" required /><button type="submit" aria-label="Subscribe to fleet updates" disabled={busy}>{busy ? <LoaderCircle className="spin" size={16} /> : <ArrowRight size={17} />}</button></div>
      <CaptchaFields captcha={captcha} />
      <StatusMessage status={status} />
    </form>
  );
}
