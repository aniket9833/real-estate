'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import {
  Pencil,
  Eye,
  EyeOff,
  Star,
  Trash2,
  Loader2,
  type LucideIcon,
} from 'lucide-react';
import {
  deletePropertyAction,
  togglePublishAction,
  toggleFeaturedAction,
  changeStatusAction,
} from '@/actions/property.actions';
import { cn } from '@/lib/utils';

interface Props {
  id: string;
  title: string;
  isPublished: boolean;
  isFeatured: boolean;
  status: string;
}

export function PropertyRowActions({
  id,
  title,
  isPublished,
  isFeatured,
  status,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deletePropertyAction(id);
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Could not delete this property. Please try again.',
      );
      setDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        defaultValue={status}
        disabled={isPending}
        onChange={(e) =>
          startTransition(() =>
            changeStatusAction(
              id,
              e.target.value as 'available' | 'reserved' | 'sold',
            ),
          )
        }
        className="text-xs rounded-lg border border-border bg-background px-2 py-1.5"
        aria-label={`Status for ${title}`}
      >
        <option value="available">Available</option>
        <option value="reserved">Reserved</option>
        <option value="sold">Sold</option>
      </select>

      <IconToggle
        active={isPublished}
        onClick={() =>
          startTransition(() => togglePublishAction(id, !isPublished))
        }
        activeIcon={Eye}
        inactiveIcon={EyeOff}
        title={isPublished ? 'Unpublish' : 'Publish'}
      />
      <IconToggle
        active={isFeatured}
        onClick={() =>
          startTransition(() => toggleFeaturedAction(id, !isFeatured))
        }
        activeIcon={Star}
        inactiveIcon={Star}
        title={isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
        activeClass="text-accent fill-accent"
      />

      <Link
        href={`/admin/properties/${id}/edit`}
        className="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-primary/5"
        aria-label={`Edit ${title}`}
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>

      <AlertDialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialog.Trigger asChild>
          <button
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-status-sold hover:bg-status-sold/5"
            aria-label={`Delete ${title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-90 bg-primary/50 backdrop-blur-sm" />
          <AlertDialog.Content className="fixed z-91 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-surface p-6 shadow-soft">
            <AlertDialog.Title className="font-display text-lg text-primary">
              Delete this property?
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-2 text-sm text-muted">
              &quot;{title}&quot; and all of its photos will be permanently
              deleted. This cannot be undone.
            </AlertDialog.Description>
            {deleteError && (
              <p className="mt-2 text-sm text-status-sold">{deleteError}</p>
            )}
            <div className="mt-6 flex gap-3 justify-end">
              <AlertDialog.Cancel asChild>
                <button
                  className="rounded-xl border border-border px-4 py-2 text-sm"
                  disabled={deleting}
                >
                  Cancel
                </button>
              </AlertDialog.Cancel>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="rounded-xl bg-status-sold text-white px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-60"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete Permanently
              </button>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
}

function IconToggle({
  active,
  onClick,
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
  title,
  activeClass,
}: {
  active: boolean;
  onClick: () => void;
  activeIcon: LucideIcon;
  inactiveIcon: LucideIcon;
  title: string;
  activeClass?: string;
}) {
  const Icon = active ? ActiveIcon : InactiveIcon;
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        'h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-primary/5',
        active && (activeClass || 'text-primary'),
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
