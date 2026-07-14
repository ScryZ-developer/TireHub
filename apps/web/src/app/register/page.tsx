'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AccountType } from '@tirehub/shared';
import { Store, User } from 'lucide-react';
import clsx from 'clsx';
import { FadeIn } from '@/components/ui/motion';
import { useAuthStore } from '@/stores';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [accountType, setAccountType] = useState<AccountType>(AccountType.PRIVATE);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({
        email,
        password,
        accountType,
        phone: phone || undefined,
        firstName: accountType === AccountType.PRIVATE ? firstName : undefined,
        lastName: accountType === AccountType.PRIVATE ? lastName : undefined,
        shopName: accountType === AccountType.SHOP ? shopName : undefined,
        address: accountType === AccountType.SHOP ? address : undefined,
        description: accountType === AccountType.SHOP ? description : undefined,
      });
      router.push('/account');
    } catch {
      /* error in store */
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <FadeIn>
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-text-primary">Регистрация</h1>
          <p className="mt-2 text-sm text-text-secondary">
            Создайте аккаунт продавца — частник или магазин в Красноярске
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setAccountType(AccountType.PRIVATE)}
              className={clsx(
                'flex flex-col items-center gap-2 rounded-card border-2 p-4 transition-all',
                accountType === AccountType.PRIVATE
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-surface-muted hover:border-primary/30',
              )}
            >
              <User className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Частник</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType(AccountType.SHOP)}
              className={clsx(
                'flex flex-col items-center gap-2 rounded-card border-2 p-4 transition-all',
                accountType === AccountType.SHOP
                  ? 'border-primary bg-primary/5'
                  : 'border-transparent bg-surface-muted hover:border-primary/30',
              )}
            >
              <Store className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Магазин</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Пароль (мин. 8 символов)
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">Телефон</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="+7 (391) ..."
              />
            </div>

            {accountType === AccountType.PRIVATE ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">Имя</label>
                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Фамилия
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Название магазина
                  </label>
                  <input
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="input-field"
                    placeholder="Шинный центр «Колесо»"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Адрес в Красноярске
                  </label>
                  <input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field"
                    placeholder="ул. Ленина, 10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                    Описание
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input-field min-h-[80px]"
                    placeholder="Чем занимается ваш магазин"
                  />
                </div>
              </>
            )}

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500">
                {error}
              </motion.p>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full">
              {isLoading ? 'Регистрация...' : 'Создать аккаунт'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
