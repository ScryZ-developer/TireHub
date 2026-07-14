'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@tirehub/shared';
import type { Seller, User } from '@tirehub/shared';
import { CheckCircle, XCircle, Users, Store, MapPin } from 'lucide-react';
import { FadeIn } from '@/components/ui/motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores';

interface AdminStats {
  usersCount: number;
  sellersCount: number;
  shopsCount: number;
  privateCount: number;
  verifiedShops: number;
  defaultCity: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || user?.role !== UserRole.ADMIN) {
      router.replace('/login');
      return;
    }

    Promise.all([
      api.admin.getStats(token),
      api.admin.getUsers(token),
      api.admin.getSellers(token),
    ])
      .then(([s, u, sel]) => {
        setStats(s as AdminStats);
        setUsers(u);
        setSellers(sel);
      })
      .catch(() => setError('Не удалось загрузить данные админки. Запущен core-service?'));
  }, [token, user, router]);

  const toggleVerify = async (sellerId: string, isVerified: boolean) => {
    if (!token) return;
    try {
      const updated = (await api.admin.verifySeller(token, sellerId, isVerified)) as Seller;
      setSellers((prev) => prev.map((s) => (s.id === sellerId ? updated : s)));
    } catch {
      setError('Не удалось обновить статус продавца');
    }
  };

  if (!user || user.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12">
      <FadeIn>
        <h1 className="text-2xl font-bold text-text-primary">Админ-панель</h1>
        <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
          <MapPin className="h-4 w-4" />
          Регион по умолчанию: {stats?.defaultCity ?? 'Красноярск'}
        </p>
      </FadeIn>

      {error && (
        <p className="mt-4 rounded-card bg-red-50 p-3 text-sm text-red-600">{error}</p>
      )}

      {stats && (
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Пользователи', value: stats.usersCount, icon: Users },
            { label: 'Продавцы', value: stats.sellersCount, icon: Store },
            { label: 'Магазины', value: stats.shopsCount, icon: Store },
            { label: 'Проверено', value: stats.verifiedShops, icon: CheckCircle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card p-4">
              <Icon className="h-5 w-5 text-primary" />
              <p className="mt-2 text-2xl font-bold text-text-primary">{value}</p>
              <p className="text-sm text-text-secondary">{label}</p>
            </div>
          ))}
        </div>
      )}

      <FadeIn delay={0.1} className="card mt-6 overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-text-primary">Продавцы</h2>
        </div>
        <div className="divide-y divide-border">
          {sellers.map((seller) => (
            <div key={seller.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div>
                <p className="font-medium text-text-primary">{seller.name}</p>
                <p className="text-sm text-text-secondary">
                  {seller.type === 'shop' ? 'Магазин' : 'Частник'} · {seller.city}
                  {seller.address ? ` · ${seller.address}` : ''}
                </p>
              </div>
              <button
                onClick={() => toggleVerify(seller.id, !seller.isVerified)}
                className={
                  seller.isVerified
                    ? 'flex items-center gap-1 text-sm text-green-600'
                    : 'flex items-center gap-1 text-sm text-text-secondary hover:text-primary'
                }
              >
                {seller.isVerified ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Проверен
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Подтвердить
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.15} className="card mt-6 overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold text-text-primary">Пользователи</h2>
        </div>
        <div className="divide-y divide-border">
          {users.map((u) => (
            <div key={u.id} className="px-5 py-3">
              <p className="font-medium text-text-primary">
                {[u.firstName, u.lastName].filter(Boolean).join(' ') || u.email}
              </p>
              <p className="text-sm text-text-secondary">
                {u.email} · {u.role} · {u.city ?? '—'}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  );
}
