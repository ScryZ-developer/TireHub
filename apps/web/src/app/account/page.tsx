'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Car,
  ClipboardList,
  LogOut,
  MapPin,
  Shield,
  Store,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { UserRole, SellerType } from '@tirehub/shared';
import { FadeIn } from '@/components/ui/motion';
import { fileToAvatarPhoto } from '@/lib/image';
import {
  useAuthStore,
  useCheckoutStore,
  useGarageStore,
  useGeoStore,
  useMyListingsStore,
} from '@/stores';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, logout, fetchMe, setAvatar } = useAuthStore();
  const { city, latitude, longitude, source, detectLocation } = useGeoStore();
  const lastOrder = useCheckoutStore((s) => s.lastOrder);
  const getVehicles = useGarageStore((s) => s.getVehicles);
  const getListings = useMyListingsStore((s) => s.getListings);
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    fetchMe();
  }, [token, router, fetchMe]);

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-text-secondary">
        Загрузка профиля...
      </div>
    );
  }

  const vehicles = getVehicles(user.id);
  const listings = getListings(user.id);
  const displayName =
    user.seller?.name ??
    [user.firstName, user.lastName].filter(Boolean).join(' ') ??
    user.email;
  const avatarUrl = user.avatarUrl ?? user.seller?.avatarUrl;

  const handleAvatar = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setAvatarBusy(true);
    setAvatarError(null);
    try {
      const url = await fileToAvatarPhoto(file);
      setAvatar(url);
    } catch (e) {
      setAvatarError(e instanceof Error ? e.message : 'Не удалось загрузить фото');
    } finally {
      setAvatarBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-12">
      <FadeIn>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Мой аккаунт</h1>
            <p className="mt-1 text-sm text-text-secondary">{user.email}</p>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="btn-outline gap-1.5">
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      </FadeIn>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FadeIn delay={0.05} className="card p-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={avatarBusy}
                className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/20 transition hover:ring-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label="Изменить аватар"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : user.seller?.type === SellerType.SHOP ? (
                  <Store className="h-8 w-8 text-primary" />
                ) : (
                  <UserIcon className="h-8 w-8 text-primary" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Camera className="h-5 w-5 text-white" />
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleAvatar(e.target.files)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-text-primary">{displayName}</p>
              <p className="text-sm text-text-secondary">
                {user.seller?.type === SellerType.SHOP ? 'Магазин' : 'Частник'}
                {user.seller?.isVerified ? ' · проверен' : ''}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={avatarBusy}
                  className="btn-outline gap-1.5 text-xs"
                >
                  <Camera className="h-3.5 w-3.5" />
                  {avatarBusy ? 'Загрузка…' : avatarUrl ? 'Сменить фото' : 'Добавить фото'}
                </button>
                {avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setAvatar(null)}
                    className="btn-outline gap-1.5 text-xs text-red-600 hover:border-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Удалить
                  </button>
                )}
              </div>
              {avatarError && (
                <p className="mt-1.5 text-xs text-red-600">{avatarError}</p>
              )}
            </div>
          </div>
          {user.seller?.address && (
            <p className="mt-3 text-sm text-text-secondary">{user.seller.address}</p>
          )}
          {user.phone && (
            <p className="mt-1 text-sm text-text-secondary">{user.phone}</p>
          )}
        </FadeIn>

        <FadeIn delay={0.1} className="card p-5">
          <div className="flex items-center gap-2 text-text-primary">
            <MapPin className="h-5 w-5 text-primary" />
            <span className="font-semibold">Геопозиция</span>
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            Город: <span className="font-medium text-text-primary">{city}</span>
          </p>
          <p className="text-xs text-text-secondary">
            {latitude.toFixed(4)}, {longitude.toFixed(4)} · {source === 'gps' ? 'GPS' : 'по умолчанию'}
          </p>
          <button onClick={detectLocation} className="btn-outline mt-3 text-sm">
            Определить по GPS
          </button>
        </FadeIn>
      </div>

      <FadeIn delay={0.15} className="mt-4 grid gap-4 sm:grid-cols-3">
        <Link href="/garage" className="card p-5 transition-shadow hover:shadow-lg">
          <Car className="h-6 w-6 text-primary" />
          <p className="mt-2 font-semibold text-text-primary">Гараж</p>
          <p className="text-sm text-text-secondary">{vehicles.length} авто</p>
        </Link>
        <Link href="/listings/my" className="card p-5 transition-shadow hover:shadow-lg">
          <ClipboardList className="h-6 w-6 text-primary" />
          <p className="mt-2 font-semibold text-text-primary">Объявления</p>
          <p className="text-sm text-text-secondary">{listings.length} активных</p>
        </Link>
        {user.role === UserRole.ADMIN && (
          <Link href="/admin" className="card p-5 transition-shadow hover:shadow-lg">
            <Shield className="h-6 w-6 text-accent" />
            <p className="mt-2 font-semibold text-text-primary">Админ-панель</p>
            <p className="text-sm text-text-secondary">Управление</p>
          </Link>
        )}
      </FadeIn>

      {lastOrder && (
        <FadeIn delay={0.2} className="card mt-4 p-5">
          <h2 className="font-semibold text-text-primary">Последний заказ</h2>
          <p className="mt-1 text-sm text-text-secondary">
            № {lastOrder.orderNumber} · {new Date(lastOrder.createdAt).toLocaleDateString('ru-RU')}
          </p>
          <p className="mt-1 text-sm">
            Доставка: {lastOrder.delivery.city}, {lastOrder.delivery.address || '—'}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
