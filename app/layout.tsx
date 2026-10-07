import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AmbientParticles } from '@/components/ambient-particles';
import { CookieConsent } from '@/components/cookie-consent';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SplashScreen } from '@/components/splash-screen';
import { WhatsAppButton } from '@/components/whatsapp-button';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gideonfleet.co.ke';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Gideon Fleet Solutions | Freight that moves us',
    template: '%s | Gideon Fleet Solutions',
  },
  description: 'Freight, last-mile delivery, and fleet management solutions built for East African roads. Based in Nairobi, Kenya.',
  applicationName: 'Gideon Fleet Solutions',
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: siteUrl,
    siteName: 'Gideon Fleet Solutions',
    title: 'Gideon Fleet Solutions | Freight that moves us',
    description: 'Freight, last-mile delivery, and fleet management solutions built for East African roads.',
    images: [{ url: '/images/tanzania-freight-road.jpg', width: 1200, height: 630, alt: 'East African road freight by Gideon Fleet Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gideon Fleet Solutions | Freight that moves us',
    description: 'Freight, last-mile delivery, and fleet management solutions built for East African roads.',
    images: ['/images/tanzania-freight-road.jpg'],
  },
  icons: { icon: '/brand/gideon-mark.svg', shortcut: '/brand/gideon-mark.svg' },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#001D38',
  colorScheme: 'light',
};

const businessSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FreightForwarder',
      '@id': `${siteUrl}/#freight-forwarder`,
      name: 'Gideon Fleet Solutions',
      url: siteUrl,
      telephone: '+254112272061',
      description: 'Nairobi-based freight, last-mile delivery, and fleet management for East African roads.',
      address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
      areaServed: [
        { '@type': 'Country', name: 'Kenya' },
        { '@type': 'Country', name: 'Uganda' },
        { '@type': 'Country', name: 'Tanzania' },
        { '@type': 'Country', name: 'Rwanda' },
      ],
      serviceType: ['Road freight', 'Last-mile delivery', 'Refrigerated transport', 'Fleet management'],
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${siteUrl}/#local-business`,
      name: 'Gideon Fleet Solutions',
      url: siteUrl,
      telephone: '+254112272061',
      address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google.com" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <SplashScreen />
        <AmbientParticles />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
        <CookieConsent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema).replace(/</g, '\\u003c') }} />
      </body>
    </html>
  );
}
