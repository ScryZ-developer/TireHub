'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Phone, MapPin, BadgeCheck } from 'lucide-react';
import { SellerType } from '@tirehub/shared';
import { getSellerById, getListingsBySeller } from '@/lib/marketplace';
import { ListingCard } from '@/components/listings/listing-card';
import { FadeIn, StaggerGrid, StaggerItem } from '@/components/ui/motion';
import clsx from 'clsx';

export default function SellerPage() {
  const params = useParams();
  const seller = getSellerById(params.id as string);
  const listings = seller ? getListingsBySeller(seller.id) : [];

  if (!seller) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-text-secondary">Продавец не найден</p>
        <Link href="/catalog" className="btn-primary mt-4 inline-flex">К каталогу</Link>
      </div>
    );
  }

  const isShop = seller.type === SellerType.SHOP;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12">
      <FadeIn>
        <div className="card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-text-primary">{seller.name}</h1>
                {seller.isVerified && <BadgeCheck className="h-6 w-6 text-primary" />}
              </div>
              <span
                className={clsx(
                  'mt-1 inline-block rounded-chip px-2 py-0.5 text-xs font-medium',
                  isShop ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-secondary',
                )}
              >
                {isShop ? 'Магазин' : 'Частное лицо'}
              </span>
              <div className="mt-2 flex items-center gap-1 text-sm text-text-secondary">
                <MapPin className="h-4 w-4" />
                {seller.city}
              </div>
              {seller.description && (
                <p className="mt-3 max-w-xl text-sm text-text-secondary">{seller.description}</p>
              )}
            </div>
            {seller.phone && (
              <a href={`tel:${seller.phone.replace(/\D/g, '')}`} className="btn-primary gap-2 shrink-0">
                <Phone className="h-4 w-4" />
                {seller.phone}
              </a>
            )}
          </div>
          <div className="mt-4 flex gap-6 border-t border-gray-100 pt-4 text-sm">
            <div>
              <span className="font-bold text-text-primary">{seller.rating}</span>
              <span className="ml-1 text-text-secondary">рейтинг</span>
            </div>
            <div>
              <span className="font-bold text-text-primary">{listings.length}</span>
              <span className="ml-1 text-text-secondary">объявлений</span>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-text-primary">Объявления продавца</h2>
        {listings.length > 0 ? (
          <StaggerGrid className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {listings.map((listing) => (
              <StaggerItem key={listing.id}>
                <ListingCard listing={listing} compact />
              </StaggerItem>
            ))}
          </StaggerGrid>
        ) : (
          <p className="text-text-secondary">Нет активных объявлений</p>
        )}
      </FadeIn>
    </div>
  );
}
