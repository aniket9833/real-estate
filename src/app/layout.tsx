import type { Metadata } from 'next';
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFloatingButton } from '@/components/shared/whatsapp-floating-button';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
  weight: ['400', '500'],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://akolarealty.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AVASYA Consultants | Trusted Land & Home Deals in Akola',
    template: '%s | AVASYA Consultants',
  },
  description:
    'Verified plots, honest guidance, clear documentation. Helping you invest safely in your dream property in Akola, Maharashtra.',
  keywords: [
    'Akola plots',
    'Akola real estate',
    'land for sale Akola',
    'property consultant Akola',
    'verified plots Akola',
    'Malkapur plots',
  ],
  openGraph: {
    title: 'AVASYA Consultants | Trusted Land & Home Deals in Akola',
    description: 'Verified plots, honest guidance, clear documentation.',
    url: siteUrl,
    siteName: 'AVASYA Consultants',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="font-sans flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  );
}
