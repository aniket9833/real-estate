import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { siteConfig, navLinks } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Image
            src="/images/logo.jpeg"
            alt="AVASYA Land and Home"
            width={112}
            height={112}
            className="h-28 w-28 object-cover"
          />
          <p className="mt-3 text-primary-foreground/70 text-sm max-w-sm leading-relaxed">
            {siteConfig.subTagline} {siteConfig.description}
          </p>
        </div>

        <div>
          <h3 className="eyebrow text-accent-light">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-primary-foreground/75 hover:text-accent-light transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow text-accent-light">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2.5">
              <Phone className="h-4 w-4 mt-0.5 shrink-0 text-accent-light" />
              <a href={`tel:${siteConfig.phoneNumber}`}>
                {siteConfig.phoneNumber}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="h-4 w-4 mt-0.5 shrink-0 text-accent-light" />
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
            <li className="flex gap-2.5">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-accent-light" />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Clock className="h-4 w-4 mt-0.5 shrink-0 text-accent-light" />
              <span>{siteConfig.officeHours}</span>
            </li>
            <li>
              <a
                href="https://www.instagram.com/avasyaproperty?utm_source=qr&igsh=MWg5NnY0Y3NiMWUzZQ=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex text-primary-foreground/80 hover:text-accent-light transition-colors"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-primary-foreground/55">
          <span>
            © {new Date().getFullYear()} AVASYA Consultants. All rights
            reserved.
          </span>
          <span>Serving Akola & surrounding areas, Maharashtra.</span>
        </div>
      </div>
    </footer>
  );
}
