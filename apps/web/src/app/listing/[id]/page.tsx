'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, Eye, ArrowLeft, ShoppingCart } from 'lucide-react';
import { ListingCondition } from '@tirehub/shared';
import { getListingById, formatListingDate } from '@/lib/marketplace';
import { SellerBadge } from '@/components/listings/listing-card';
import { ListingImage } from '@/components/listings/listing-image';
import { useAuthStore, useCartStore, useMyListingsStore } from '@/stores';
import { formatPrice } from '@/lib/format';
import { FadeIn } from '@/components/ui/motion';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const userId = useAuthStore((s) => s.user?.id);
  const getListings = useMyListingsStore((s) => s.getListings);
  const [activeImage, setActiveImage] = useState(0);

  const listing = useMemo(() => {
    const id = params.id as string;
    const fromMock = getListingById(id);
    if (fromMock) return fromMock;
    if (!userId) return undefined;
    return getListings(userId).find((l) => l.id === id);
  }, [params.id, userId, getListings]);

  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-text-secondary">Объявление не найдено</p>
        <Link href="/catalog" className="btn-primary mt-4 inline-flex">
          К объявлениям
        </Link>
      </div>
    );
  }

  const seller = listing.seller;
  const images = listing.imageUrls.length > 0 ? listing.imageUrls : [];
  const current = images[Math.min(activeImage, Math.max(0, images.length - 1))];

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12">
      <FadeIn>
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
        >
          <ArrowLeft className="h-4 w-4" />
          Назад
        </button>
      </FadeIn>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="card relative aspect-square overflow-hidden">
            {current && (
              <ListingImage
                src={current}
                alt={listing.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
            {listing.condition === ListingCondition.USED && (
              <span className="absolute left-4 top-4 rounded-chip bg-accent px-3 py-1 text-sm font-medium text-white">
                Б/у
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={`${i}-${src.slice(0, 24)}`}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={
                    i === activeImage
                      ? 'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 ring-primary'
                      : 'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-gray-200 opacity-80 hover:opacity-100'
                  }
                >
                  <ListingImage src={src} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <FadeIn delay={0.1}>
          <div>
            <p className="text-3xl font-bold text-accent">{formatPrice(listing.price)}</p>
            <h1 className="mt-2 text-xl font-bold text-text-primary">{listing.title}</h1>

            <div className="mt-3 flex flex-wrap gap-2 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {listing.city}
              </span>
              <span>·</span>
              <span>{formatListingDate(listing.createdAt)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {listing.viewsCount} просмотров
              </span>
            </div>

            {listing.description && (
              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {listing.description}
              </p>
            )}

            {listing.attributes && (
              <div className="mt-4 rounded-card bg-background p-4">
                <h3 className="mb-2 text-sm font-semibold text-text-primary">Характеристики</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {listing.brand && (
                    <>
                      <dt className="text-text-secondary">Бренд</dt>
                      <dd>{listing.brand}</dd>
                    </>
                  )}
                  {listing.attributes.width && (
                    <>
                      <dt className="text-text-secondary">Размер</dt>
                      <dd>
                        {listing.attributes.width}/{listing.attributes.profile} R{listing.attributes.diameter}
                      </dd>
                    </>
                  )}
                  {listing.attributes.pcd && (
                    <>
                      <dt className="text-text-secondary">Разболтовка</dt>
                      <dd>{listing.attributes.pcd}</dd>
                    </>
                  )}
                  {listing.attributes.offsetEt !== undefined && (
                    <>
                      <dt className="text-text-secondary">Вылет (ET)</dt>
                      <dd>{listing.attributes.offsetEt}</dd>
                    </>
                  )}
                  {listing.attributes.season && (
                    <>
                      <dt className="text-text-secondary">Сезон</dt>
                      <dd>{listing.attributes.season}</dd>
                    </>
                  )}
                </dl>
              </div>
            )}

            <div className="mt-4 flex gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!seller) return;
                  addItem({
                    listingId: listing.id,
                    sellerId: listing.sellerId,
                    sellerName: seller.name,
                    name: listing.title,
                    price: listing.price,
                    imageUrl: listing.imageUrls[0],
                  });
                }}
                className="btn-primary flex-1 gap-2 py-3"
              >
                <ShoppingCart className="h-5 w-5" />
                В корзину
              </motion.button>
              {seller?.phone && (
                <a
                  href={`tel:${seller.phone.replace(/\D/g, '')}`}
                  className="btn-outline gap-2 px-6 py-3"
                >
                  <Phone className="h-5 w-5" />
                  Позвонить
                </a>
              )}
            </div>

            {seller && (
              <div className="card mt-6 p-4">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">Продавец</h3>
                <Link href={`/seller/${seller.id}`}>
                  <SellerBadge seller={seller} />
                </Link>
                {seller.description && (
                  <p className="mt-3 text-sm text-text-secondary">{seller.description}</p>
                )}
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
