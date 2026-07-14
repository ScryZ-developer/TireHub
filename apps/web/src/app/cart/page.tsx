'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Disc3,
} from 'lucide-react';
import { useCartStore } from '@/stores';
import { formatPrice } from '@/lib/format';
import { ListingImage } from '@/components/listings/listing-image';
import { FadeIn } from '@/components/ui/motion';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalPrice, clearCart, sellerGroups } =
    useCartStore();
  const groups = sellerGroups();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <FadeIn>
          <h1 className="mb-6 text-2xl font-bold text-text-primary">Корзина</h1>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card flex flex-col items-center py-16 text-center"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>
              <ShoppingBag className="h-16 w-16 text-primary/20" />
            </motion.div>
            <p className="mt-4 font-medium text-text-primary">Корзина пуста</p>
            <p className="mt-1 text-sm text-text-secondary">
              Добавьте объявления из каталога
            </p>
            <Link href="/catalog" className="btn-primary mt-6">
              Перейти в каталог
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      <FadeIn>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary">Корзина</h1>
          <button
            onClick={clearCart}
            className="text-sm text-text-secondary transition-colors hover:text-red-500"
          >
            Очистить
          </button>
        </div>
      </FadeIn>

      {groups.length > 1 && (
        <p className="mb-4 rounded-button bg-weather-warning px-4 py-3 text-sm text-text-secondary">
          В корзине товары от {groups.length} продавцов — заказ может быть разделён
        </p>
      )}

      <AnimatePresence mode="popLayout">
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.listingId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card flex items-center gap-4 p-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-button bg-gray-100">
                {item.imageUrl ? (
                  <ListingImage
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-primary/30">
                    <Disc3 className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-text-primary">
                  {item.name}
                </h3>
                <p className="truncate text-xs text-text-secondary">{item.sellerName}</p>
                <p className="text-lg font-bold text-accent">
                  {formatPrice(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item.listingId, item.quantity - 1)}
                  className="rounded-full p-1.5 ring-1 ring-gray-200 hover:bg-background"
                >
                  <Minus className="h-4 w-4" />
                </motion.button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item.listingId, item.quantity + 1)}
                  className="rounded-full p-1.5 ring-1 ring-gray-200 hover:bg-background"
                >
                  <Plus className="h-4 w-4" />
                </motion.button>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => removeItem(item.listingId)}
                className="rounded-full p-2 text-text-secondary hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <FadeIn delay={0.15}>
        <div className="card mt-6 p-5">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-text-primary">Итого</span>
            <motion.span
              key={totalPrice()}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-accent"
            >
              {formatPrice(totalPrice())}
            </motion.span>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            Доставка рассчитывается при оформлении
          </p>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/checkout')}
            className="btn-primary mt-4 w-full gap-2 py-3 text-base"
          >
            Оформить заказ
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </div>
      </FadeIn>
    </div>
  );
}
