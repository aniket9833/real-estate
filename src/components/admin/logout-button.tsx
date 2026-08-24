'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/auth.actions';
import { Button } from '@/components/ui/button';

export function AdminLogoutButton({ compact }: { compact?: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    await logoutAction();
    router.push('/admin/login');
    router.refresh();
  }

  if (compact) {
    return (
      <button
        onClick={handleLogout}
        aria-label="Log out"
        className="text-ink/70"
      >
        <LogOut className="h-5 w-5" />
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" /> Log Out
    </Button>
  );
}
