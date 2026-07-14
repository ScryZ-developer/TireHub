'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Phone,
  ShoppingCart,
  Check,
  MapPin,
  Store,
  User,
  BadgeCheck,
} from 'lucide-react';
import { SellerType, ListingCondition } from '@tirehub/shared';
import type { Listing } from '@tirehub/shared';
import { useCartStore, useAddedToCart } from '@/stores';
import { formatPrice } from '@/lib/format';
import { formatListingDate } from '@/lib/marketplace';
import { springTransition } from '@/components/ui/motion';
import clsx from 'clsx';

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
}

const seasonLabels: Record<string, string> = {
  summer: 'Летние',
  winter: 'Зимние',
  all_season: 'Всесезонные',
};

export function ListingCard({ listing, compact }: ListingCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { listingId, setAdded } = useAddedToCart();
  const justAdded = listingId === listing.id;
  const seller = listing.seller;
  const imageUrl = listing.imageUrls[0];
  const isShop = seller?.type === SellerType.SHOP;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!seller) return;
    addItem({
      listingId: listing.id,
      sellerId: listing.sellerId,
      sellerName: seller.name,
      name: listing.title,
      price: listing.price,
      imageUrl,
    });
    setAdded(listing.id);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (seller?.phone) window.open(`tel:${seller.phone.replace(/\D/g, '')}`);
  };

  return (
    <Link href={`/listing/${listing.id}`}>
      <motion.article
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={springTransition}
        className="card group flex h-full flex-col overflow-hidden"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {listing.condition === ListingCondition.USED && (
            <span className="absolute left-2 top-2 z-10 rounded-chip bg-accent px-2 py-0.5 text-xs font-medium text-white">
              Б/у
            </span>
          )}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col p-3">
          <p className="text-lg font-bold text-accent">{formatPrice(listing.price)}</p>

          <h3 className="mt-1 line-clamp-2 text-sm font-medium text-text-primary">
            {listing.title}
          </h3>

          {!compact && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {listing.attributes?.season && (
                <span className="rounded-chip bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                  {seasonLabels[listing.attributes.season] ?? listing.attributes.season}
                </span>
              )}
              {listing.attributes?.pcd && (
                <span className="rounded-chip bg-gray-100 px-1.5 py-0.5 text-xs text-text-secondary">
                  {listing.attributes.pcd}
                </span>
              )}
            </div>
          )}

          {seller && (
            <div className="mt-2 flex items-center gap-1.5">
              <div
                className={clsx(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                  isShop ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-secondary',
                )}
              >
                {isShop ? <Store className="h-3 w-3" /> : <User className="h-3 w-3" />}
              </div>
              <span className="truncate text-xs text-text-secondary">
                {seller.name}
                {seller.isVerified && (
                  <BadgeCheck className="ml-0.5 inline h-3 w-3 text-primary" />
                )}
              </span>
            </div>
          )}

          <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{listing.city}</span>
            <span className="text-gray-300">·</span>
            <span className="shrink-0">{formatListingDate(listing.createdAt)}</span>
          </div>

          <div className="mt-auto flex gap-2 pt-3">
            <motion.button
              onClick={handleAdd}
              disabled={listing.quantity <= 0}
              whileTap={{ scale: 0.96 }}
              className={clsx(
                'btn-primary relative flex-1 gap-1 text-xs disabled:opacity-50',
                justAdded && 'bg-green-600 hover:bg-green-600',
              )}
            >
              <AnimatePresence mode="wait">
                {justAdded ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-3.5 w-3.5" />
                    В корзине
                  </motion.span>
                ) : (
                  <motion.span
                    key="cart"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-1"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    В корзину
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            {seller?.phone && (
              <motion.button
                onClick={handleCall}
                whileTap={{ scale: 0.96 }}
                className="btn-outline px-2.5"
                title="Позвонить продавцу"
              >
                <Phone className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export function SellerBadge({ seller }: { seller: NonNullable<Listing['seller']> }) {
  const isShop = seller.type === SellerType.SHOP;
  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx(
          'flex h-8 w-8 items-center justify-center rounded-full',
          isShop ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-secondary',
        )}
      >
        {isShop ? <Store className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-text-primary">{seller.name}</span>
          {seller.isVerified && <BadgeCheck className="h-4 w-4 text-primary" />}
          <span
            className={clsx(
              'rounded-chip px-1.5 py-0.5 text-xs',
              isShop ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-secondary',
            )}
          >
            {isShop ? 'Магазин' : 'Частник'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <Star className="h-3 w-3 fill-accent text-accent" />
          <span>{seller.rating}</span>
          <span>·</span>
          <span>{seller.listingsCount} объявлений</span>
        </div>
      </div>
    </div>
  );
}
