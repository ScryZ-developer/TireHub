import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductType, TireSeason, SellerType, ListingCondition } from '@tirehub/shared';
import type { Listing } from '@tirehub/shared';

interface CartItem {
  listingId: string;
  sellerId: string;
  sellerName: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  ownerId: string | null;
  bindUser: (userId: string | null) => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  sellerGroups: () => { sellerId: string; sellerName: string; items: CartItem[] }[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      ownerId: null,

      bindUser: (userId) => {
        const current = get().ownerId;
        if (current === userId) return;
        set({ ownerId: userId, items: [] });
      },

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.listingId === item.listingId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.listingId === item.listingId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        });
      },
      removeItem: (listingId) =>
        set((state) => ({
          items: state.items.filter((i) => i.listingId !== listingId),
        })),
      updateQuantity: (listingId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(listingId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.listingId === listingId ? { ...i, quantity } : i,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      sellerGroups: () => {
        const groups = new Map<string, { sellerId: string; sellerName: string; items: CartItem[] }>();
        for (const item of get().items) {
          const g = groups.get(item.sellerId);
          if (g) g.items.push(item);
          else groups.set(item.sellerId, { sellerId: item.sellerId, sellerName: item.sellerName, items: [item] });
        }
        return Array.from(groups.values());
      },
    }),
    { name: 'tirehub-cart-v3' },
  ),
);

interface CatalogFiltersState {
  type: ProductType;
  season?: TireSeason;
  width?: number;
  profile?: number;
  diameter?: number;
  pcd?: string;
  sellerType?: SellerType;
  condition?: ListingCondition;
  city?: string;
  sort: 'newest' | 'price_asc' | 'price_desc';
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  page: number;
  setType: (type: ProductType) => void;
  setFilter: (key: string, value: unknown) => void;
  resetFilters: () => void;
}

export const useCatalogFilters = create<CatalogFiltersState>((set) => ({
  type: 'tire' as ProductType,
  sort: 'newest',
  page: 1,
  setType: (type) => set({ type, page: 1, pcd: undefined, season: undefined }),
  setFilter: (key, value) => set({ [key]: value, page: 1 }),
  resetFilters: () =>
    set({
      season: undefined,
      width: undefined,
      profile: undefined,
      diameter: undefined,
      pcd: undefined,
      sellerType: undefined,
      condition: undefined,
      city: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      brand: undefined,
      sort: 'newest',
      page: 1,
    }),
}));

export type DeliveryMethod = 'courier' | 'cdek' | 'pickup' | 'post';
export type PaymentMethod = 'card' | 'cash' | 'online';

export interface CheckoutContact {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface CheckoutDelivery {
  method: DeliveryMethod;
  city: string;
  address: string;
  apartment?: string;
  zip?: string;
  comment?: string;
}

export interface CheckoutPayment {
  method: PaymentMethod;
}

export interface CompletedOrder {
  orderNumber: string;
  createdAt: string;
  contact: CheckoutContact;
  delivery: CheckoutDelivery;
  payment: CheckoutPayment;
  items: CartItem[];
  subtotal: number;
  deliveryCost: number;
  total: number;
}

interface CheckoutState {
  step: number;
  contact: CheckoutContact;
  delivery: CheckoutDelivery;
  payment: CheckoutPayment;
  lastOrder: CompletedOrder | null;
  setStep: (step: number) => void;
  setContact: (contact: Partial<CheckoutContact>) => void;
  setDelivery: (delivery: Partial<CheckoutDelivery>) => void;
  setPayment: (payment: Partial<CheckoutPayment>) => void;
  completeOrder: (order: CompletedOrder) => void;
  reset: () => void;
}

const defaultContact: CheckoutContact = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
};

const defaultDelivery: CheckoutDelivery = {
  method: 'courier',
  city: 'Красноярск',
  address: '',
  apartment: '',
  zip: '',
  comment: '',
};

const defaultPayment: CheckoutPayment = {
  method: 'card',
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      step: 1,
      contact: defaultContact,
      delivery: defaultDelivery,
      payment: defaultPayment,
      lastOrder: null,
      setStep: (step) => set({ step }),
      setContact: (contact) =>
        set((s) => ({ contact: { ...s.contact, ...contact } })),
      setDelivery: (delivery) =>
        set((s) => ({ delivery: { ...s.delivery, ...delivery } })),
      setPayment: (payment) =>
        set((s) => ({ payment: { ...s.payment, ...payment } })),
      completeOrder: (order) => set({ lastOrder: order, step: 1 }),
      reset: () =>
        set({
          step: 1,
          contact: defaultContact,
          delivery: defaultDelivery,
          payment: defaultPayment,
        }),
    }),
    {
      name: 'tirehub-checkout',
      partialize: (state) => ({
        contact: state.contact,
        delivery: state.delivery,
        payment: state.payment,
        lastOrder: state.lastOrder,
      }),
    },
  ),
);

export const DELIVERY_OPTIONS: {
  id: DeliveryMethod;
  label: string;
  description: string;
  price: number;
  days: string;
}[] = [
  {
    id: 'courier',
    label: 'Курьер TireHub',
    description: 'Доставка до двери в пределах города',
    price: 500,
    days: '1–2 дня',
  },
  {
    id: 'cdek',
    label: 'СДЭК',
    description: 'Доставка в пункт выдачи или до двери',
    price: 650,
    days: '2–4 дня',
  },
  {
    id: 'pickup',
    label: 'Самовывоз',
    description: 'TireHub Красноярск, ул. Мира, 42',
    price: 0,
    days: 'Сегодня',
  },
  {
    id: 'post',
    label: 'Почта России',
    description: 'Доставка в отделение почты',
    price: 400,
    days: '5–10 дней',
  },
];

export function getDeliveryCost(method: DeliveryMethod) {
  return DELIVERY_OPTIONS.find((o) => o.id === method)?.price ?? 0;
}

interface SearchState {
  query: string;
  suggestions: string[];
  setQuery: (query: string) => void;
  setSuggestions: (suggestions: string[]) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  suggestions: [],
  setQuery: (query) => set({ query }),
  setSuggestions: (suggestions) => set({ suggestions }),
}));

interface AddedToCartState {
  listingId: string | null;
  setAdded: (id: string) => void;
  clear: () => void;
}

export const useAddedToCart = create<AddedToCartState>((set) => ({
  listingId: null,
  setAdded: (id) => {
    set({ listingId: id });
    setTimeout(() => set({ listingId: null }), 1200);
  },
  clear: () => set({ listingId: null }),
}));

interface MyListingsState {
  listingsByUser: Record<string, Listing[]>;
  getListings: (userId: string) => Listing[];
  addListing: (userId: string, listing: Listing) => void;
  removeListing: (userId: string, id: string) => void;
}

export const useMyListingsStore = create<MyListingsState>()(
  persist(
    (set, get) => ({
      listingsByUser: {},

      getListings: (userId) => get().listingsByUser[userId] ?? [],

      addListing: (userId, listing) =>
        set((s) => ({
          listingsByUser: {
            ...s.listingsByUser,
            [userId]: [listing, ...(s.listingsByUser[userId] ?? [])],
          },
        })),

      removeListing: (userId, id) =>
        set((s) => ({
          listingsByUser: {
            ...s.listingsByUser,
            [userId]: (s.listingsByUser[userId] ?? []).filter((l) => l.id !== id),
          },
        })),
    }),
    { name: 'tirehub-my-listings-v2' },
  ),
);

export * from './auth';
export * from './geo';
export * from './garage';
