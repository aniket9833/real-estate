import type { Metadata } from 'next';
import '@/app/globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'AVASYA Consultants | Trusted Land & Home Deals in Akola',
  description:
    'Verified plots, honest guidance, and clear documentation for property in Akola.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
