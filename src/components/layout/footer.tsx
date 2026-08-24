import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { siteConfig, navLinks } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-24">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="font-display text-2xl italic">
            AVASYA Consultants
          </span>
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
