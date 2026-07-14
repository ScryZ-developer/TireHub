'use client';

import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ProductType, TireSeason, SellerType, ListingCondition } from '@tirehub/shared';
import { ListingCard } from '@/components/listings/listing-card';
import { useCatalogFilters, useMyListingsStore } from '@/stores';
import {
  mockListings,
  CITIES,
} from '@/lib/marketplace';
import { PCD_OPTIONS, FILTER_WIDTHS, FILTER_PROFILES, FILTER_DIAMETERS } from '@/lib/products';
import { FadeIn } from '@/components/ui/motion';
import clsx from 'clsx';

const seasons: { value: TireSeason; label: string }[] = [
  { value: TireSeason.SUMMER, label: 'Летние' },
  { value: TireSeason.WINTER, label: 'Зимние' },
  { value: TireSeason.ALL_SEASON, label: 'Всесезонные' },
];

const sortOptions = [
  { value: 'newest' as const, label: 'Сначала новые' },
  { value: 'price_asc' as const, label: 'Дешевле' },
  { value: 'price_desc' as const, label: 'Дороже' },
];

export default function CatalogPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const listingsByUser = useMyListingsStore((s) => s.listingsByUser);
  const myListings = useMemo(
    () => Object.values(listingsByUser).flat(),
    [listingsByUser],
  );

  const {
    type,
    season,
    width,
    profile,
    diameter,
    pcd,
    sellerType,
    condition,
    city,
    sort,
    setType,
    setFilter,
    resetFilters,
  } = useCatalogFilters();

  const initialType = searchParams.get('type') as ProductType | null;

  useEffect(() => {
    if (initialType && (initialType === ProductType.TIRE || initialType === ProductType.WHEEL)) {
      setType(initialType);
    }
  }, [initialType, setType]);

  const allListings = useMemo(
    () => [...myListings, ...mockListings],
    [myListings],
  );

  const filteredListings = useMemo(() => {
    let result = allListings.filter((l) => {
      if (l.type !== type) return false;
      if (query && !l.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (season && l.attributes?.season !== season) return false;
      if (width && l.attributes?.width !== width) return false;
      if (profile && l.attributes?.profile !== profile) return false;
      if (diameter && l.attributes?.diameter !== diameter) return false;
      if (pcd && l.attributes?.pcd !== pcd) return false;
      if (sellerType && l.seller?.type !== sellerType) return false;
      if (condition && l.condition !== condition) return false;
      if (city && l.city !== city) return false;
      return true;
    });

    if (sort === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    else result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result;
  }, [allListings, type, season, width, profile, diameter, pcd, sellerType, condition, city, sort, query]);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <FadeIn>
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-text-primary">Объявления</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Маркетплейс шин и дисков — магазины и частные продавцы
          </p>
          {query && (
            <p className="mt-1 text-sm text-primary">По запросу: «{query}»</p>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="relative mb-4 flex rounded-button bg-surface p-1 shadow-card ring-1 ring-gray-100">
          <motion.div
            layout
            className="absolute inset-y-1 w-[calc(50%-4px)] rounded-button bg-primary"
            style={{ left: type === ProductType.TIRE ? 4 : 'calc(50%)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          />
          <button
            onClick={() => setType(ProductType.TIRE)}
            className={clsx(
              'relative z-10 flex-1 rounded-button py-2.5 text-sm font-medium transition-colors duration-300',
              type === ProductType.TIRE ? 'text-white' : 'text-text-secondary hover:text-text-primary',
            )}
          >
            Шины
          </button>
          <button
            onClick={() => setType(ProductType.WHEEL)}
            className={clsx(
              'relative z-10 flex-1 rounded-button py-2.5 text-sm font-medium transition-colors duration-300',
              type === ProductType.WHEEL ? 'text-white' : 'text-text-secondary hover:text-text-primary',
            )}
          >
            Диски
          </button>
        </div>
      </FadeIn>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter('sort', opt.value)}
            className={sort === opt.value ? 'chip-active' : 'chip-inactive'}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <FadeIn delay={0.1} className="w-full shrink-0 lg:w-64">
          <div className="card p-4 lg:sticky lg:top-28">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">Фильтры</h2>
              <button onClick={resetFilters} className="text-xs text-primary hover:text-primary-dark">
                Сбросить
              </button>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-text-secondary">Продавец</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('sellerType', sellerType === SellerType.SHOP ? undefined : SellerType.SHOP)}
                  className={sellerType === SellerType.SHOP ? 'chip-active' : 'chip-inactive'}
                >
                  Магазины
                </button>
                <button
                  onClick={() => setFilter('sellerType', sellerType === SellerType.PRIVATE ? undefined : SellerType.PRIVATE)}
                  className={sellerType === SellerType.PRIVATE ? 'chip-active' : 'chip-inactive'}
                >
                  Частники
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-text-secondary">Состояние</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('condition', condition === ListingCondition.NEW ? undefined : ListingCondition.NEW)}
                  className={condition === ListingCondition.NEW ? 'chip-active' : 'chip-inactive'}
                >
                  Новые
                </button>
                <button
                  onClick={() => setFilter('condition', condition === ListingCondition.USED ? undefined : ListingCondition.USED)}
                  className={condition === ListingCondition.USED ? 'chip-active' : 'chip-inactive'}
                >
                  Б/у
                </button>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium text-text-secondary">Город</h3>
              <select
                value={city ?? ''}
                onChange={(e) => setFilter('city', e.target.value || undefined)}
                className="input-field"
              >
                <option value="">Все города</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {type === ProductType.TIRE && (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-medium text-text-secondary">Сезон</h3>
                <div className="flex flex-wrap gap-2">
                  {seasons.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setFilter('season', season === s.value ? undefined : s.value)}
                      className={season === s.value ? 'chip-active' : 'chip-inactive'}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {type === ProductType.TIRE && (
              <>
                <FilterGroup label="Ширина" values={FILTER_WIDTHS} selected={width} onSelect={(v) => setFilter('width', width === v ? undefined : v)} />
                <FilterGroup label="Профиль" values={FILTER_PROFILES} selected={profile} onSelect={(v) => setFilter('profile', profile === v ? undefined : v)} />
              </>
            )}

            {type === ProductType.WHEEL && (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-medium text-text-secondary">Разболтовка</h3>
                <div className="flex flex-wrap gap-2">
                  {PCD_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => setFilter('pcd', pcd === option ? undefined : option)}
                      className={pcd === option ? 'chip-active' : 'chip-inactive'}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <FilterGroup label="Диаметр" values={FILTER_DIAMETERS} selected={diameter} onSelect={(v) => setFilter('diameter', diameter === v ? undefined : v)} />
          </div>
        </FadeIn>

        <div className="flex-1">
          <p className="mb-4 text-sm text-text-secondary">
            {filteredListings.length} объявлений
          </p>
          <AnimatePresence mode="popLayout">
            {filteredListings.length > 0 ? (
              <motion.div layout className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {filteredListings.map((listing, i) => (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                  >
                    <ListingCard listing={listing} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card flex flex-col items-center justify-center py-16 text-center"
              >
                <span className="text-4xl opacity-40">🔍</span>
                <p className="mt-4 font-medium text-text-primary">Объявления не найдены</p>
                <p className="mt-1 text-sm text-text-secondary">Измените фильтры или разместите своё</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  values,
  selected,
  onSelect,
}: {
  label: string;
  values: number[];
  selected?: number;
  onSelect: (value: number) => void;
}) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-sm font-medium text-text-secondary">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <button key={v} onClick={() => onSelect(v)} className={selected === v ? 'chip-active' : 'chip-inactive'}>
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
