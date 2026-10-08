# Gideon Fleet Solutions

Production-oriented freight, delivery-contract, fleet-partner, and tracking website built with Next.js App Router. The visual system follows the uploaded Logistico theme: Poppins, navy `#001D38`, orange `#FF3414`, warm-orange accents, pale-blue surfaces, source spacing, and source shadow/border values. See [`SOURCE-AUDIT.md`](./SOURCE-AUDIT.md) for the source ZIP audit and [`image-credits.md`](./image-credits.md) for local-photo provenance.

## Runtime and pinned stack

- Node.js `24.0.0` (`.nvmrc`); package engine `node >=24.0.0`.
- Next.js `15.5.27` App Router, React / React DOM `19.0.8`, TypeScript `5.7.2`. Next.js 15.1.0 was upgraded because it is affected by CVE-2025-66478 (RCE), CVE-2025-55184 (DoS), and CVE-2025-55183 (source exposure); `15.5.27` is the patched 15.x release.
- Lucide React `0.468.0`, Three.js `0.171.0`, `@vercel/blob` `2.8.1`, and Nodemailer `10.0.16`.
- Exact dependency versions are pinned in `package.json` and `package-lock.json`; Nodemailer includes its own TypeScript definitions. The `postcss` `8.5.29` and `sharp` `0.35.5` overrides keep those transitive runtime packages on patched releases.

```bash
nvm use
npm ci
npm run dev
```

Run `npm run typecheck`, `npm run lint`, and `npm run build` before deployment. `npm audit --omit=dev` reports no critical or high advisories for the runtime dependency tree after the Next.js and React upgrade. The full development audit still flags five high-severity findings in the `fast-glob`/`micromatch`/`braces` chain pulled in by `eslint-config-next`; these are dev-only (lint tooling), and the `braces` override already resolves to the newest published release (`3.0.3`).

## Routes

- `/` — homepage: hero, tracking board, scrollytelling, services, about, motion/effect gallery, quote form, regional route preview, fleet rail/dashboard/brochure, partner application, illustrative testimonials, news, and contact.
- `/about`, `/fleet`, `/tracking`, `/contact` — focused service pages. Tracking renders dynamically; fleet uses 300-second ISR.
- `/news`, `/news/[slug]` — MDX-backed articles and metadata; ISR is 300 seconds.
- `/legal/privacy-policy`, `/legal/terms`, `/legal/cookie-policy` — legal pages.
- `app/not-found.tsx` and `app/error.tsx` provide branded 404/500 experiences.
- `app/sitemap.ts` builds a sitemap from pages and MDX metadata; `app/robots.ts` blocks API routes from indexing.

## API contracts

Every user-submission endpoint verifies a reCAPTCHA token server-side. The v3 action must match the endpoint. Scores below `0.5` return `403` with `challengeRequired: true`; the client then displays the v2 checkbox challenge. Set both public site keys and the server-only secret in production.

| Route | Method | Request | Success | Storage / behavior |
|---|---|---|---|---|
| `/api/quote` | `POST` JSON | `origin`, `destination`, `cargoType`, `contactName`, `phone`, `email`; optional `weightKg`, `volumeCbm`, `pickupDate`, `notes`; plus `captchaToken`, `captchaType` | `{ ok, reference, message, stored, emailSent, whatsappSent }` | Stores `quotes:<reference>` in KV for one year; attempts a reference email and ops WhatsApp notification. |
| `/api/track` | `POST` JSON | `waybill`, `captchaToken`, `captchaType` | `{ ok, shipment }` or a 404 not-found response | Reads `tracking:<waybill>` from KV. `GFS-24851` is explicitly marked a demo record; it is not live customer data. |
| `/api/partner` | `POST` multipart/form-data | `name`, `phone`, `email`, `vehicleType`, `registration`, `experience`, `drivingLicence`, `vehicleLogbook`, `captchaToken`, `captchaType` | `{ ok, reference, documentsStored, message }` | Uploads documents to private Vercel Blob and stores application metadata in KV. PDFs, JPGs, and PNGs up to 2 MB each are accepted. |
| `/api/contact` | `POST` JSON | `name`, `email`, `message`; optional `phone`; plus CAPTCHA fields | `{ ok, reference, emailSent, whatsappSent, message }` | Attempts SMTP delivery and an ops WhatsApp notification. |
| `/api/newsletter` | `POST` JSON | `email`, `captchaToken`, `captchaType` | `{ ok, message }` | Adds an address to KV set `newsletter:subscribers`; ops WhatsApp notification is optional. |
| `/api/news` | `GET` | — | `{ articles }` | Static MDX article metadata; 300-second revalidation. |
| `/api/captcha` | `POST` JSON | `token`, optional `action` (default `form`), `type` (`v2` or `v3`) | `{ ok, score }` or `{ ok: false, error, challengeRequired }` | Standalone verification endpoint. Form handlers also verify their own CAPTCHA fields directly. |
| `/api/ws` | `GET` | WebSocket upgrade attempt | `426 Upgrade Required` with a JSON explanation | Deliberate fallback. Same-browser tabs use `BroadcastChannel`; cross-user presence requires a managed WebSocket and `NEXT_PUBLIC_TRACKING_WS_URL`. |

KV and delivery integrations return a safe configuration error in production when required credentials are missing. Optional notification delivery failures do not prevent quote/contact requests from being accepted. Configure the exact variable names in [`.env.example`](./.env.example); do not commit real credentials.

## Production checks before launch

1. Confirm the canonical domain in `NEXT_PUBLIC_SITE_URL`; it currently defaults to `https://gideonfleet.co.ke` as a proposed brand-domain value.
2. Confirm the operations email (`OPS_EMAIL` / `SMTP_FROM`), Nairobi street address, service hours, social accounts, current vehicle specifications/capacities, and real fleet availability.
3. Replace the sample tracking waybill, sample dashboard figures, and illustrative testimonials with approved production data. A WebSocket service is still needed for cross-user tracking presence.
4. Verify the exact Pexels photo-page URLs/creator credits in `image-credits.md`.
5. Have Kenyan counsel/privacy lead approve `/legal/privacy-policy` and `/legal/terms`; page copy is a production-oriented draft, not legal advice.
6. Provision KV, private Blob storage, reCAPTCHA v3/v2 keys, WhatsApp Cloud API, and SMTP before enabling production forms.
