export declare enum UserRole {
    BUYER = "buyer",
    ADMIN = "admin",
    PARTNER = "partner"
}
export declare enum ProductType {
    TIRE = "tire",
    WHEEL = "wheel"
}
export declare enum OrderStatus {
    PENDING = "pending",
    PAID = "paid",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare enum PartnerType {
    STORE = "store",
    TIRE_SERVICE = "tire_service",
    PICKUP_POINT = "pickup_point"
}
export declare enum TireSeason {
    SUMMER = "summer",
    WINTER = "winter",
    ALL_SEASON = "all_season"
}
export declare enum WeatherState {
    COLD = "cold",
    WARNING = "warning",
    SUMMER = "summer",
    HEAT = "heat"
}
export interface User {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    createdAt: string;
}
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
export interface CartItem {
    productId: string;
    quantity: number;
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
export declare const SERVICE_PORTS: {
    readonly CORE: 3001;
    readonly CATALOG: 3002;
    readonly CONSUMER: 3003;
    readonly RECOMMENDATION: 3004;
    readonly WEB: 3000;
};
export declare const RABBITMQ_QUEUES: {
    readonly NOTIFICATIONS: "notifications";
    readonly ORDER_EVENTS: "order.events";
    readonly CATALOG_SYNC: "catalog.sync";
};
