'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  Banknote,
  Smartphone,
} from 'lucide-react';
import {
  useCartStore,
  useCheckoutStore,
  DELIVERY_OPTIONS,
  getDeliveryCost,
  type DeliveryMethod,
  type PaymentMethod,
} from '@/stores';
import { formatPrice, generateOrderNumber } from '@/lib/format';
import { FadeIn, smoothTransition } from '@/components/ui/motion';
import clsx from 'clsx';

const STEPS = [
  { id: 1, label: 'Контакты', icon: User },
  { id: 2, label: 'Доставка', icon: Truck },
  { id: 3, label: 'Оплата', icon: CreditCard },
  { id: 4, label: 'Подтверждение', icon: CheckCircle2 },
];

const PAYMENT_OPTIONS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    id: 'card',
    label: 'Банковская карта',
    description: 'Visa, Mastercard, МИР — оплата при получении ссылки',
    icon: CreditCard,
  },
  {
    id: 'online',
    label: 'Онлайн-оплата',
    description: 'СБП или перевод — ссылка придёт на email',
    icon: Smartphone,
  },
  {
    id: 'cash',
    label: 'Наличными при получении',
    description: 'Оплата курьеру или в пункте выдачи',
    icon: Banknote,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const {
    step,
    contact,
    delivery,
    payment,
    setStep,
    setContact,
    setDelivery,
    setPayment,
    completeOrder,
    reset,
  } = useCheckoutStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = totalPrice();
  const deliveryCost = getDeliveryCost(delivery.method);
  const total = subtotal + deliveryCost;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <FadeIn>
          <Package className="mx-auto h-16 w-16 text-primary/30" />
          <h1 className="mt-4 text-xl font-bold text-text-primary">
            Корзина пуста
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Добавьте товары перед оформлением заказа
          </p>
          <Link href="/catalog" className="btn-primary mt-6 inline-flex">
            В каталог
          </Link>
        </FadeIn>
      </div>
    );
  }

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!contact.firstName.trim()) newErrors.firstName = 'Введите имя';
      if (!contact.lastName.trim()) newErrors.lastName = 'Введите фамилию';
      if (!contact.phone.trim()) newErrors.phone = 'Введите телефон';
      else if (!/^[\d\s+()-]{10,}$/.test(contact.phone))
        newErrors.phone = 'Некорректный номер';
      if (!contact.email.trim()) newErrors.email = 'Введите email';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
        newErrors.email = 'Некорректный email';
    }

    if (currentStep === 2 && delivery.method !== 'pickup') {
      if (!delivery.city.trim()) newErrors.city = 'Введите город';
      if (!delivery.address.trim()) newErrors.address = 'Введите адрес';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setStep(Math.min(step + 1, 4));
    }
  };

  const goBack = () => setStep(Math.max(step - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2)) {
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));

    const orderNumber = generateOrderNumber();
    completeOrder({
      orderNumber,
      createdAt: new Date().toISOString(),
      contact,
      delivery,
      payment,
      items: [...items],
      subtotal,
      deliveryCost,
      total,
    });

    clearCart();
    reset();
    setIsSubmitting(false);
    router.push(`/checkout/success?order=${orderNumber}`);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12">
      <FadeIn>
        <div className="mb-8">
          <Link
            href="/cart"
            className="mb-4 inline-flex items-center gap-1 text-sm text-primary hover:text-primary-dark"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад в корзину
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Оформление заказа</h1>
        </div>
      </FadeIn>

      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isDone
                      ? '#1565C0'
                      : isActive
                        ? '#1565C0'
                        : '#E5E7EB',
                  }}
                  transition={smoothTransition}
                  className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    (isActive || isDone) && 'text-white shadow-glow',
                    !isActive && !isDone && 'text-text-secondary',
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.div>
                <span
                  className={clsx(
                    'hidden text-xs font-medium sm:block',
                    isActive ? 'text-primary' : 'text-text-secondary',
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded bg-gray-200">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: step > s.id ? '100%' : '0%' }}
                    transition={smoothTransition}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={smoothTransition}
              className="card p-6"
            >
              {step === 1 && (
                <ContactStep
                  contact={contact}
                  errors={errors}
                  onChange={setContact}
                />
              )}
              {step === 2 && (
                <DeliveryStep
                  delivery={delivery}
                  errors={errors}
                  onChange={setDelivery}
                />
              )}
              {step === 3 && (
                <PaymentStep payment={payment} onChange={setPayment} />
              )}
              {step === 4 && (
                <ConfirmStep
                  contact={contact}
                  delivery={delivery}
                  payment={payment}
                  items={items}
                  subtotal={subtotal}
                  deliveryCost={deliveryCost}
                  total={total}
                />
              )}

              <div className="mt-6 flex justify-between gap-3">
                {step > 1 ? (
                  <button onClick={goBack} className="btn-outline gap-1">
                    <ChevronLeft className="h-4 w-4" />
                    Назад
                  </button>
                ) : (
                  <div />
                )}
                {step < 4 ? (
                  <button onClick={goNext} className="btn-primary gap-1">
                    Далее
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary gap-2 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                        />
                        Оформляем...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" />
                        Подтвердить заказ
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <FadeIn delay={0.1}>
          <div className="card p-5 lg:sticky lg:top-28">
            <h2 className="mb-4 font-semibold text-text-primary">Ваш заказ</h2>
            <ul className="max-h-64 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <li key={item.listingId} className="flex gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-button bg-gray-100">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-contain p-0.5"
                        sizes="48px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs text-text-primary">{item.name}</p>
                    <p className="text-xs text-text-secondary">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Товары</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Доставка</span>
                <span>
                  {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-text-primary">
                <span>Итого</span>
                <span className="text-accent">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

function ContactStep({
  contact,
  errors,
  onChange,
}: {
  contact: ReturnType<typeof useCheckoutStore.getState>['contact'];
  errors: Record<string, string>;
  onChange: (data: Partial<typeof contact>) => void;
}) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-text-primary">
        Контактные данные
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Имя"
          value={contact.firstName}
          onChange={(v) => onChange({ firstName: v })}
          error={errors.firstName}
          placeholder="Иван"
        />
        <Field
          label="Фамилия"
          value={contact.lastName}
          onChange={(v) => onChange({ lastName: v })}
          error={errors.lastName}
          placeholder="Иванов"
        />
        <Field
          label="Телефон"
          value={contact.phone}
          onChange={(v) => onChange({ phone: v })}
          error={errors.phone}
          placeholder="+7 (999) 123-45-67"
          className="sm:col-span-2"
        />
        <Field
          label="Email"
          type="email"
          value={contact.email}
          onChange={(v) => onChange({ email: v })}
          error={errors.email}
          placeholder="ivan@example.com"
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
}

function DeliveryStep({
  delivery,
  errors,
  onChange,
}: {
  delivery: ReturnType<typeof useCheckoutStore.getState>['delivery'];
  errors: Record<string, string>;
  onChange: (data: Partial<typeof delivery>) => void;
}) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-text-primary">
        Способ доставки
      </h2>
      <div className="mb-6 space-y-3">
        {DELIVERY_OPTIONS.map((option) => (
          <motion.button
            key={option.id}
            type="button"
            whileTap={{ scale: 0.99 }}
            onClick={() => onChange({ method: option.id as DeliveryMethod })}
            className={clsx(
              'flex w-full items-start gap-4 rounded-card border p-4 text-left transition-all duration-300',
              delivery.method === option.id
                ? 'border-primary bg-primary/5 shadow-glow'
                : 'border-gray-200 hover:border-primary/30',
            )}
          >
            <div
              className={clsx(
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                delivery.method === option.id
                  ? 'border-primary bg-primary'
                  : 'border-gray-300',
              )}
            >
              {delivery.method === option.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-2 w-2 rounded-full bg-white"
                />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-text-primary">{option.label}</span>
                <span className="text-sm font-semibold text-accent">
                  {option.price === 0 ? 'Бесплатно' : formatPrice(option.price)}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-text-secondary">
                {option.description}
              </p>
              <p className="mt-1 text-xs text-primary">{option.days}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {delivery.method !== 'pickup' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <Field
            label="Город"
            value={delivery.city}
            onChange={(v) => onChange({ city: v })}
            error={errors.city}
            placeholder="Красноярск"
          />
          <Field
            label="Индекс"
            value={delivery.zip ?? ''}
            onChange={(v) => onChange({ zip: v })}
            placeholder="123456"
          />
          <Field
            label="Адрес"
            value={delivery.address}
            onChange={(v) => onChange({ address: v })}
            error={errors.address}
            placeholder="ул. Примерная, д. 1"
            className="sm:col-span-2"
          />
          <Field
            label="Квартира / офис"
            value={delivery.apartment ?? ''}
            onChange={(v) => onChange({ apartment: v })}
            placeholder="Необязательно"
          />
          <Field
            label="Комментарий курьеру"
            value={delivery.comment ?? ''}
            onChange={(v) => onChange({ comment: v })}
            placeholder="Домофон, подъезд..."
            className="sm:col-span-2"
          />
        </motion.div>
      )}

      {delivery.method === 'pickup' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start gap-3 rounded-card bg-primary/5 p-4"
        >
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium text-text-primary">TireHub Центр</p>
            <p className="text-sm text-text-secondary">ул. Мира, 42, Красноярск</p>
            <p className="mt-1 text-xs text-text-secondary">Пн–Вс: 9:00–21:00</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function PaymentStep({
  payment,
  onChange,
}: {
  payment: ReturnType<typeof useCheckoutStore.getState>['payment'];
  onChange: (data: Partial<typeof payment>) => void;
}) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-text-primary">
        Способ оплаты
      </h2>
      <div className="space-y-3">
        {PAYMENT_OPTIONS.map((option) => {
          const Icon = option.icon;
          return (
            <motion.button
              key={option.id}
              type="button"
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange({ method: option.id })}
              className={clsx(
                'flex w-full items-start gap-4 rounded-card border p-4 text-left transition-all duration-300',
                payment.method === option.id
                  ? 'border-primary bg-primary/5 shadow-glow'
                  : 'border-gray-200 hover:border-primary/30',
              )}
            >
              <div
                className={clsx(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-button',
                  payment.method === option.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text-secondary',
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-text-primary">{option.label}</p>
                <p className="text-sm text-text-secondary">{option.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
      <p className="mt-4 rounded-button bg-weather-warning px-4 py-3 text-xs text-text-secondary">
        Оплата не подключена — это демо-оформление. После подтверждения вы получите
        номер заказа, а менеджер свяжется с вами для уточнения деталей.
      </p>
    </div>
  );
}

function ConfirmStep({
  contact,
  delivery,
  payment,
  items,
  subtotal,
  deliveryCost,
  total,
}: {
  contact: ReturnType<typeof useCheckoutStore.getState>['contact'];
  delivery: ReturnType<typeof useCheckoutStore.getState>['delivery'];
  payment: ReturnType<typeof useCheckoutStore.getState>['payment'];
  items: ReturnType<typeof useCartStore.getState>['items'];
  subtotal: number;
  deliveryCost: number;
  total: number;
}) {
  const deliveryLabel =
    DELIVERY_OPTIONS.find((o) => o.id === delivery.method)?.label ?? '';
  const paymentLabel =
    PAYMENT_OPTIONS.find((o) => o.id === payment.method)?.label ?? '';

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-text-primary">
        Проверьте заказ
      </h2>
      <div className="space-y-4">
        <SummaryBlock title="Получатель">
          <p>
            {contact.firstName} {contact.lastName}
          </p>
          <p className="text-text-secondary">{contact.phone}</p>
          <p className="text-text-secondary">{contact.email}</p>
        </SummaryBlock>
        <SummaryBlock title="Доставка">
          <p>{deliveryLabel}</p>
          {delivery.method !== 'pickup' && (
            <p className="text-text-secondary">
              {delivery.city}, {delivery.address}
              {delivery.apartment ? `, ${delivery.apartment}` : ''}
            </p>
          )}
        </SummaryBlock>
        <SummaryBlock title="Оплата">
          <p>{paymentLabel}</p>
        </SummaryBlock>
        <SummaryBlock title={`Товары (${items.length})`}>
          {items.map((item) => (
            <p key={item.listingId} className="text-text-secondary">
              {item.name} × {item.quantity} —{' '}
              {formatPrice(item.price * item.quantity)}
            </p>
          ))}
          <div className="mt-2 border-t border-gray-100 pt-2">
            <p className="flex justify-between">
              <span>Товары</span>
              <span>{formatPrice(subtotal)}</span>
            </p>
            <p className="flex justify-between text-text-secondary">
              <span>Доставка</span>
              <span>
                {deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost)}
              </span>
            </p>
            <p className="mt-1 flex justify-between font-bold text-accent">
              <span>Итого</span>
              <span>{formatPrice(total)}</span>
            </p>
          </div>
        </SummaryBlock>
      </div>
    </div>
  );
}

function SummaryBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-button bg-background p-4 text-sm">
      <p className="mb-1 font-medium text-text-primary">{title}</p>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-text-secondary">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={clsx('input-field', error && 'border-red-400 ring-red-200')}
      />
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
