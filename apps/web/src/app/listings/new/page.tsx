'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ProductType,
  TireSeason,
  SellerType,
  ListingCondition,
  ListingStatus,
} from '@tirehub/shared';
import type { Listing } from '@tirehub/shared';
import { useAuthStore, useMyListingsStore } from '@/stores';
import { CITIES, TIRE_IMAGES, WHEEL_IMAGES } from '@/lib/marketplace';
import { PCD_OPTIONS } from '@/lib/products';
import { FadeIn } from '@/components/ui/motion';

export default function NewListingPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addListing = useMyListingsStore((s) => s.addListing);

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  const [form, setForm] = useState({
    title: '',
    type: ProductType.TIRE as ProductType,
    condition: ListingCondition.NEW as ListingCondition,
    price: '',
    quantity: '1',
    city: 'Красноярск',
    brand: '',
    width: '',
    profile: '',
    diameter: '',
    pcd: '',
    season: '' as TireSeason | '',
    description: '',
  });

  if (!user) return null;

  const seller = user.seller;
  const sellerId = user.sellerId ?? `seller-user-${user.id}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const listing: Listing = {
      id: `listing-user-${Date.now()}`,
      sellerId,
      seller: seller ?? {
        id: sellerId,
        type: SellerType.PRIVATE,
        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Вы',
        city: form.city,
        phone: user.phone,
        rating: 0,
        listingsCount: 1,
        isVerified: false,
        createdAt: new Date().toISOString(),
      },
      title: form.title,
      description: form.description,
      type: form.type,
      condition: form.condition,
      price: Number(form.price),
      quantity: Number(form.quantity),
      city: form.city,
      imageUrls: [
        form.type === ProductType.TIRE ? TIRE_IMAGES.classic : WHEEL_IMAGES.silver,
      ],
      status: ListingStatus.ACTIVE,
      viewsCount: 0,
      brand: form.brand || undefined,
      attributes: {
        width: form.width ? Number(form.width) : undefined,
        profile: form.profile ? Number(form.profile) : undefined,
        diameter: form.diameter ? Number(form.diameter) : undefined,
        pcd: form.pcd || undefined,
        season: form.season || undefined,
      },
      createdAt: new Date().toISOString(),
    };

    addListing(user.id, listing);
    router.push('/listings/my');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-12">
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">Разместить объявление</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Бесплатно для магазинов и частных продавцов
        </p>
      </FadeIn>

      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="card mt-6 space-y-5 p-6"
      >
        {seller && (
          <p className="rounded-button bg-primary/5 px-4 py-3 text-sm text-text-secondary">
            Публикуете как: <span className="font-medium text-text-primary">{seller.name}</span>
            {' · '}{seller.city}
          </p>
        )}

        <Field label="Название / заголовок" required>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Michelin Pilot Sport 4 225/45 R17"
            className="input-field"
          />
        </Field>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, type: ProductType.TIRE })}
            className={form.type === ProductType.TIRE ? 'chip-active flex-1' : 'chip-inactive flex-1'}
          >
            Шины
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, type: ProductType.WHEEL })}
            className={form.type === ProductType.WHEEL ? 'chip-active flex-1' : 'chip-inactive flex-1'}
          >
            Диски
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setForm({ ...form, condition: ListingCondition.NEW })}
            className={form.condition === ListingCondition.NEW ? 'chip-active flex-1' : 'chip-inactive flex-1'}
          >
            Новые
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, condition: ListingCondition.USED })}
            className={form.condition === ListingCondition.USED ? 'chip-active flex-1' : 'chip-inactive flex-1'}
          >
            Б/у
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Цена, ₽" required>
            <input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input-field"
            />
          </Field>
          <Field label="Количество">
            <input
              type="number"
              min={1}
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              className="input-field"
            />
          </Field>
          <Field label="Город" required>
            <select
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input-field"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Бренд">
          <input
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            className="input-field"
          />
        </Field>

        {form.type === ProductType.TIRE ? (
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Ширина">
              <input value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} className="input-field" placeholder="225" />
            </Field>
            <Field label="Профиль">
              <input value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })} className="input-field" placeholder="45" />
            </Field>
            <Field label="Диаметр">
              <input value={form.diameter} onChange={(e) => setForm({ ...form, diameter: e.target.value })} className="input-field" placeholder="17" />
            </Field>
            <Field label="Сезон">
              <select
                value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value as TireSeason })}
                className="input-field"
              >
                <option value="">—</option>
                <option value={TireSeason.SUMMER}>Летние</option>
                <option value={TireSeason.WINTER}>Зимние</option>
                <option value={TireSeason.ALL_SEASON}>Всесезонные</option>
              </select>
            </Field>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Диаметр">
              <input value={form.diameter} onChange={(e) => setForm({ ...form, diameter: e.target.value })} className="input-field" placeholder="17" />
            </Field>
            <Field label="Разболтовка (PCD)">
              <select
                value={form.pcd}
                onChange={(e) => setForm({ ...form, pcd: e.target.value })}
                className="input-field"
              >
                <option value="">Выберите</option>
                {PCD_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
          </div>
        )}

        <Field label="Описание">
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Состояние, причина продажи, возможность торга..."
            className="input-field resize-none"
          />
        </Field>

        <p className="rounded-button bg-weather-warning px-4 py-3 text-xs text-text-secondary">
          Объявление публикуется локально (демо). После подключения backend оно появится в общем каталоге после модерации.
        </p>

        <button type="submit" className="btn-primary w-full py-3 text-base">
          Опубликовать объявление
        </button>
      </motion.form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text-secondary">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
    </div>
  );
}
