'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, Home, ShoppingBag } from 'lucide-react';
import { useCheckoutStore } from '@/stores';
import { formatPrice } from '@/lib/format';
import { FadeIn } from '@/components/ui/motion';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderParam = searchParams.get('order');
  const { lastOrder } = useCheckoutStore();

  const orderNumber = orderParam ?? lastOrder?.orderNumber;

  useEffect(() => {
    if (!orderNumber) {
      router.replace('/catalog');
    }
  }, [orderNumber, router]);

  if (!orderNumber) return null;

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <FadeIn>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-6 text-center text-2xl font-bold text-text-primary"
        >
          Заказ оформлен!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-2 text-center text-text-secondary"
        >
          Спасибо за покупку в TireHub
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="card mt-8 p-6 text-center"
        >
          <p className="text-sm text-text-secondary">Номер заказа</p>
          <p className="mt-1 text-2xl font-bold tracking-wide text-primary">
            {orderNumber}
          </p>

          {lastOrder && (
            <div className="mt-4 space-y-1 border-t border-gray-100 pt-4 text-sm text-text-secondary">
              <p>
                {lastOrder.contact.firstName} {lastOrder.contact.lastName}
              </p>
              <p>{lastOrder.contact.phone}</p>
              <p className="font-semibold text-accent">
                {formatPrice(lastOrder.total)}
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-text-secondary">
            <Package className="h-4 w-4" />
            <span>Менеджер свяжется с вами в течение 30 минут</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="/" className="btn-outline flex-1 gap-2">
            <Home className="h-4 w-4" />
            На главную
          </Link>
          <Link href="/catalog" className="btn-primary flex-1 gap-2">
            <ShoppingBag className="h-4 w-4" />
            Продолжить покупки
          </Link>
        </motion.div>
      </FadeIn>
    </div>
  );
}
