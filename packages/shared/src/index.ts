export enum AccountType {
  PRIVATE = 'private',
  SHOP = 'shop',
}

export enum UserRole {
  BUYER = 'buyer',
  ADMIN = 'admin',
  PARTNER = 'partner',
  SELLER = 'seller',
}

export enum SellerType {
  SHOP = 'shop',
  PRIVATE = 'private',
}

export enum ListingCondition {
  NEW = 'new',
  USED = 'used',
}

export enum ListingStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  ACTIVE = 'active',
  SOLD = 'sold',
  ARCHIVED = 'archived',
}

export enum ProductType {
  TIRE = 'tire',
  WHEEL = 'wheel',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PartnerType {
  STORE = 'store',
  TIRE_SERVICE = 'tire_service',
  PICKUP_POINT = 'pickup_point',
}

export enum TireSeason {
  SUMMER = 'summer',
  WINTER = 'winter',
  ALL_SEASON = 'all_season',
}

export enum WeatherState {
  COLD = 'cold',
  WARNING = 'warning',
  SUMMER = 'summer',
  HEAT = 'heat',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  sellerId?: string;
  seller?: Seller;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface GeoLocation {
  city: string;
  latitude: number;
  longitude: number;
  source: 'default' | 'gps' | 'manual';
}

export const KRASNOYARSK: GeoLocation = {
  city: 'Красноярск',
  latitude: 56.0153,
  longitude: 92.8932,
  source: 'default',
};

export interface Product {
  id: string;
  sku: string;
  name: string;
  type: ProductType;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  description?: string;
  brand?: string;
  rating?: number;
}

export interface ProductAttributes {
  width?: number;
  profile?: number;
  diameter?: number;
  pcd?: string;
  offsetEt?: number;
  season?: TireSeason;
  boltCount?: number;
}

export interface ProductWithAttributes extends Product {
  attributes?: ProductAttributes;
}

export interface GarageVehicle {
  id: string;
  userId: string;
  brand: string;
  model: string;
  year: number;
  tireSize: string;
  installDate?: string;
  nickname?: string;
}

export interface Partner {
  id: string;
  type: PartnerType;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  phone?: string;
  logoUrl?: string;
}

export interface Seller {
  id: string;
  type: SellerType;
  name: string;
  city: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  listingsCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface ListingAttributes {
  width?: number;
  profile?: number;
  diameter?: number;
  pcd?: string;
  offsetEt?: number;
  season?: TireSeason;
  boltCount?: number;
}

export interface Listing {
  id: string;
  sellerId: string;
  seller?: Seller;
  title: string;
  description?: string;
  type: ProductType;
  condition: ListingCondition;
  price: number;
  quantity: number;
  city: string;
  imageUrls: string[];
  status: ListingStatus;
  viewsCount: number;
  brand?: string;
  attributes?: ListingAttributes;
  createdAt: string;
  updatedAt?: string;
}

export interface ListingFilters {
  type?: ProductType;
  sellerType?: SellerType;
  condition?: ListingCondition;
  season?: TireSeason;
  width?: number;
  profile?: number;
  diameter?: number;
  pcd?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  page?: number;
  limit?: number;
  q?: string;
}

export interface CartItem {
  listingId: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  name: string;
  price: number;
  imageUrl?: string;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  totalPrice: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product?: Product;
}

export interface CatalogFilters {
  type?: ProductType;
  season?: TireSeason;
  width?: number;
  profile?: number;
  diameter?: number;
  pcd?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  state: WeatherState;
  city: string;
}

export interface RecommendationBlock {
  id: string;
  title: string;
  type: 'cross_sell' | 'recently_viewed' | 'popular' | 'weather';
  products: Product[];
}

export const SERVICE_PORTS = {
  CORE: 3001,
  CATALOG: 3002,
  CONSUMER: 3003,
  RECOMMENDATION: 3004,
  WEB: 3000,
} as const;

export const RABBITMQ_QUEUES = {
  NOTIFICATIONS: 'notifications',
  ORDER_EVENTS: 'order.events',
  CATALOG_SYNC: 'catalog.sync',
} as const;
