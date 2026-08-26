import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Building2, Inbox } from 'lucide-react';
import { getCurrentAdmin } from '@/lib/session';
import { AdminLogoutButton } from '@/components/admin/logout-button';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');

  const links = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/properties', label: 'Properties', icon: Building2 },
    { href: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-surface">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-border">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-accent-light font-display italic">
            A
          </span>
          <span className="font-display text-primary">AVASYA</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-ink/75 hover:bg-primary/5 hover:text-primary transition-colors"
            >
              <Icon className="h-4.5 w-4.5" /> {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted mb-2 truncate">{admin.email}</p>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-surface border-b border-border flex items-center justify-between px-4">
        <span className="font-display text-primary text-sm">
          AVASYA — Admin
        </span>
        <AdminLogoutButton compact />
      </div>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-surface border-t border-border flex items-center justify-around">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 text-[0.65rem] text-ink/70"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex-1 pt-14 pb-20 md:pt-0 md:pb-0">
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
