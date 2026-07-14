'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Car,
  ClipboardList,
  LogOut,
  MapPin,
  Shield,
  Store,
  User as UserIcon,
} from 'lucide-react';
import { UserRole, SellerType } from '@tirehub/shared';
import { FadeIn } from '@/components/ui/motion';
import {
  useAuthStore,
  useCheckoutStore,
  useGarageStore,
  useGeoStore,
  useMyListingsStore,
} from '@/stores';

export default function AccountPage() {
  const router = useRouter();
  const { user, token, logout, fetchMe } = useAuthStore();
  const { city, latitude, longitude, source, detectLocation } = useGeoStore();
  const lastOrder = useCheckoutStore((s) => s.lastOrder);
  const getVehicles = useGarageStore((s) => s.getVehicles);
  const getListings = useMyListingsStore((s) => s.getListings);

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
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {user.seller?.type === SellerType.SHOP ? (
                <Store className="h-6 w-6 text-primary" />
              ) : (
                <UserIcon className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <p className="font-semibold text-text-primary">{displayName}</p>
              <p className="text-sm text-text-secondary">
                {user.seller?.type === SellerType.SHOP ? 'Магазин' : 'Частник'}
                {user.seller?.isVerified ? ' · проверен' : ''}
              </p>
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
