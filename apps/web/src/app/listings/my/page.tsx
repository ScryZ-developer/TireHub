'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAuthStore, useMyListingsStore } from '@/stores';
import { ListingCard } from '@/components/listings/listing-card';
import { formatPrice } from '@/lib/format';
import { FadeIn } from '@/components/ui/motion';

export default function MyListingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const getListings = useMyListingsStore((s) => s.getListings);
  const removeListing = useMyListingsStore((s) => s.removeListing);

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  if (!user) return null;

  const listings = getListings(user.id);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Мои объявления</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Управляйте своими объявлениями на маркетплейсе
            </p>
          </div>
          <Link href="/listings/new" className="btn-primary gap-1.5">
            <Plus className="h-4 w-4" />
            Разместить
          </Link>
        </div>
      </FadeIn>

      {listings.length === 0 ? (
        <FadeIn delay={0.1}>
          <div className="card mt-8 flex flex-col items-center py-16 text-center">
            <p className="text-4xl opacity-30">📋</p>
            <p className="mt-4 font-medium text-text-primary">У вас пока нет объявлений</p>
            <p className="mt-1 text-sm text-text-secondary">
              Разместите первое объявление — это бесплатно
            </p>
            <Link href="/listings/new" className="btn-primary mt-6 gap-1.5">
              <Plus className="h-4 w-4" />
              Разместить объявление
            </Link>
          </div>
        </FadeIn>
      ) : (
        <div className="mt-6 space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="flex gap-4">
              <div className="flex-1">
                <ListingCard listing={listing} compact />
              </div>
              <div className="flex flex-col items-end justify-between py-2">
                <span className="text-lg font-bold text-accent">{formatPrice(listing.price)}</span>
                <button
                  onClick={() => removeListing(user.id, listing.id)}
                  className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                  Снять
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
