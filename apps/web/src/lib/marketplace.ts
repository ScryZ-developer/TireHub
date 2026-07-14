import {
  ProductType,
  TireSeason,
  SellerType,
  ListingCondition,
  ListingStatus,
  type Seller,
  type Listing,
} from '@tirehub/shared';
import { mockProducts, TIRE_IMAGES, WHEEL_IMAGES } from './products';

export const MOCK_SELLERS: Seller[] = [
  {
    id: 'seller-1',
    type: SellerType.SHOP,
    name: 'Шинный центр «Колесо»',
    city: 'Красноярск',
    phone: '+7 (391) 111-22-33',
    address: 'ул. Ленина, 10',
    latitude: 56.01,
    longitude: 92.86,
    description: 'Официальный дилер Michelin и Nokian в Красноярске.',
    rating: 4.8,
    listingsCount: 12,
    isVerified: true,
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'seller-2',
    type: SellerType.SHOP,
    name: 'АвтоШины 24',
    city: 'Красноярск',
    phone: '+7 (391) 222-33-44',
    address: 'пр. Мира, 88',
    latitude: 56.02,
    longitude: 92.88,
    description: 'Шины и диски с доставкой по Красноярску.',
    rating: 4.6,
    listingsCount: 8,
    isVerified: true,
    createdAt: '2024-03-20T00:00:00Z',
  },
  {
    id: 'seller-3',
    type: SellerType.SHOP,
    name: 'DiskMarket Сибирь',
    city: 'Красноярск',
    phone: '+7 (391) 333-44-55',
    address: 'ул. Вавилова, 1',
    latitude: 56.005,
    longitude: 92.85,
    description: 'Литые и штампованные диски всех размеров.',
    rating: 4.7,
    listingsCount: 6,
    isVerified: true,
    createdAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'seller-4',
    type: SellerType.PRIVATE,
    name: 'Алексей',
    city: 'Красноярск',
    phone: '+7 (391) 555-12-34',
    latitude: 56.012,
    longitude: 92.865,
    description: 'Продаю комплект зимней резины после продажи авто.',
    rating: 4.9,
    listingsCount: 2,
    isVerified: false,
    createdAt: '2025-11-01T00:00:00Z',
  },
  {
    id: 'seller-5',
    type: SellerType.PRIVATE,
    name: 'Марина',
    city: 'Красноярск',
    phone: '+7 (391) 666-78-90',
    latitude: 56.008,
    longitude: 92.872,
    description: 'Летние шины Continental, накат 1 сезон.',
    rating: 4.5,
    listingsCount: 1,
    isVerified: false,
    createdAt: '2025-12-05T00:00:00Z',
  },
  {
    id: 'seller-6',
    type: SellerType.SHOP,
    name: 'TirePro Красноярск',
    city: 'Красноярск',
    phone: '+7 (391) 777-88-99',
    address: 'ул. 78 Добровольческой Бригады, 15',
    latitude: 56.025,
    longitude: 92.895,
    description: 'Крупный шинный центр Красноярска.',
    rating: 4.4,
    listingsCount: 5,
    isVerified: true,
    createdAt: '2023-08-12T00:00:00Z',
  },
  {
    id: 'seller-7',
    type: SellerType.PRIVATE,
    name: 'Дмитрий',
    city: 'Красноярск',
    phone: '+7 (391) 888-99-00',
    latitude: 56.015,
    longitude: 92.893,
    description: 'Диски Replica в отличном состоянии.',
    rating: 4.3,
    listingsCount: 1,
    isVerified: false,
    createdAt: '2026-01-20T00:00:00Z',
  },
];

const sellerAssignment = [
  'seller-1', 'seller-4', 'seller-2', 'seller-1', 'seller-4',
  'seller-5', 'seller-2', 'seller-1', 'seller-6', 'seller-5',
  'seller-3', 'seller-2', 'seller-3', 'seller-7', 'seller-3',
  'seller-6', 'seller-2', 'seller-7', 'seller-3', 'seller-6',
];

const cities = Array(20).fill('Красноярск') as string[];

export const CITIES = [
  'Красноярск',
  'Новосибирск',
  'Иркутск',
  'Кемерово',
  'Абакан',
  'Норильск',
];

const conditions: ListingCondition[] = [
  ListingCondition.NEW, ListingCondition.USED, ListingCondition.NEW, ListingCondition.NEW,
  ListingCondition.USED, ListingCondition.USED, ListingCondition.NEW, ListingCondition.NEW,
  ListingCondition.NEW, ListingCondition.USED, ListingCondition.NEW, ListingCondition.NEW,
  ListingCondition.NEW, ListingCondition.USED, ListingCondition.NEW, ListingCondition.NEW,
  ListingCondition.NEW, ListingCondition.USED, ListingCondition.NEW, ListingCondition.NEW,
];

const priceVariance = [0, -800, 200, 0, -1200, -600, 150, 300, 500, -400, 0, 100, -200, -1500, 400, 0, 50, -900, 250, 180];

const daysAgo = [1, 3, 5, 2, 7, 14, 4, 6, 10, 21, 3, 8, 12, 2, 15, 9, 4, 5, 11, 6];

function daysAgoDate(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const mockListings: Listing[] = mockProducts.map((product, i) => {
  const sellerId = sellerAssignment[i] ?? 'seller-1';
  const seller = MOCK_SELLERS.find((s) => s.id === sellerId)!;
  const variance = priceVariance[i] ?? 0;

  return {
    id: `listing-${product.id}`,
    sellerId,
    seller,
    title: product.name,
    description: `${product.brand} — ${product.type === ProductType.TIRE ? 'шины' : 'диски'} в наличии. ${conditions[i] === ListingCondition.USED ? 'Б/у, хорошее состояние.' : 'Новые, в упаковке.'}`,
    type: product.type,
    condition: conditions[i] ?? ListingCondition.NEW,
    price: product.price + variance,
    quantity: product.stockQuantity > 20 ? 4 : product.stockQuantity > 10 ? 2 : 1,
    city: cities[i] ?? seller.city,
    imageUrls: [product.imageUrl],
    status: ListingStatus.ACTIVE,
    viewsCount: Math.floor(50 + Math.random() * 500),
    brand: product.brand,
    attributes: product.attributes,
    createdAt: daysAgoDate(daysAgo[i] ?? 1),
  };
});

export function getListingById(id: string): Listing | undefined {
  return mockListings.find((l) => l.id === id);
}

export function getSellerById(id: string): Seller | undefined {
  return MOCK_SELLERS.find((s) => s.id === id);
}

export function getListingsBySeller(sellerId: string): Listing[] {
  return mockListings.filter((l) => l.sellerId === sellerId && l.status === ListingStatus.ACTIVE);
}

export function formatListingDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Вчера';
  if (diffDays < 7) return `${diffDays} дн. назад`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} нед. назад`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

export const DEFAULT_LISTING_IMAGE =
  TIRE_IMAGES.classic;

export { TIRE_IMAGES, WHEEL_IMAGES };
