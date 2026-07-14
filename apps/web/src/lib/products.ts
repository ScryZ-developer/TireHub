import { ProductType, TireSeason } from '@tirehub/shared';

export interface CatalogProduct {
  id: string;
  sku: string;
  name: string;
  type: ProductType;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  brand: string;
  rating: number;
  attributes: {
    width?: number;
    profile?: number;
    diameter?: number;
    pcd?: string;
    offsetEt?: number;
    season?: TireSeason;
    boltCount?: number;
  };
}

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=600&auto=format&fit=crop&q=80`;

export const TIRE_IMAGES = {
  sport: img('1508046097768-4c131835dcc8'),
  classic: img('1444947295498-07f60c19a4ff'),
  black: img('1745113071590-4eab158511d4'),
  tread: img('1558618666-fcd25c85f82e'),
  stack: img('1625047509168-7437364a9daa'),
  winter: img('1599616139-d8c8f5f1d4f0'),
  premium: img('1486262715619-67b85e0b08d3'),
  detail: img('1492144534655-ae79c964c9d7'),
  workshop: img('1487754180451-c757f256f917'),
  road: img('1503376780353-7ebb837af514'),
} as const;

export const WHEEL_IMAGES = {
  silver: img('1770275215437-a0f36921bae3'),
  chrome: img('1767898000124-90720b3c3dc2'),
  sport: img('1753183700294-a2dbeb81e168'),
  alloy: img('1503376780353-7ebb837af514'),
  black: img('1493238792781-eecc4c4ecb29'),
  multi: img('1508046097768-4c131835dcc8'),
  matte: img('1544636331-e26879cd4d9b'),
  forged: img('1583121274602-3e2824c87d81'),
  replica: img('1444947295498-07f60c19a4ff'),
  premium: img('1619642751034-765df76d29c5'),
} as const;

export const mockProducts: CatalogProduct[] = [
  {
    id: '1',
    sku: 'TIR-001',
    name: 'Michelin Pilot Sport 4 225/45 R17',
    type: ProductType.TIRE,
    price: 12500,
    stockQuantity: 48,
    imageUrl: TIRE_IMAGES.sport,
    brand: 'Michelin',
    rating: 4.8,
    attributes: { width: 225, profile: 45, diameter: 17, season: TireSeason.SUMMER },
  },
  {
    id: '2',
    sku: 'TIR-002',
    name: 'Nokian Hakkapeliitta R5 205/55 R16',
    type: ProductType.TIRE,
    price: 9800,
    stockQuantity: 32,
    imageUrl: TIRE_IMAGES.winter,
    brand: 'Nokian',
    rating: 4.9,
    attributes: { width: 205, profile: 55, diameter: 16, season: TireSeason.WINTER },
  },
  {
    id: '3',
    sku: 'TIR-003',
    name: 'Continental PremiumContact 6 195/65 R15',
    type: ProductType.TIRE,
    price: 7200,
    stockQuantity: 64,
    imageUrl: TIRE_IMAGES.classic,
    brand: 'Continental',
    rating: 4.6,
    attributes: { width: 195, profile: 65, diameter: 15, season: TireSeason.ALL_SEASON },
  },
  {
    id: '4',
    sku: 'TIR-004',
    name: 'Bridgestone Turanza T005 215/55 R17',
    type: ProductType.TIRE,
    price: 10900,
    stockQuantity: 28,
    imageUrl: TIRE_IMAGES.premium,
    brand: 'Bridgestone',
    rating: 4.7,
    attributes: { width: 215, profile: 55, diameter: 17, season: TireSeason.SUMMER },
  },
  {
    id: '5',
    sku: 'TIR-005',
    name: 'Pirelli Winter Sottozero 3 225/40 R18',
    type: ProductType.TIRE,
    price: 14200,
    stockQuantity: 18,
    imageUrl: TIRE_IMAGES.black,
    brand: 'Pirelli',
    rating: 4.8,
    attributes: { width: 225, profile: 40, diameter: 18, season: TireSeason.WINTER },
  },
  {
    id: '6',
    sku: 'TIR-006',
    name: 'Yokohama BluEarth-GT AE51 185/60 R15',
    type: ProductType.TIRE,
    price: 5800,
    stockQuantity: 56,
    imageUrl: TIRE_IMAGES.tread,
    brand: 'Yokohama',
    rating: 4.5,
    attributes: { width: 185, profile: 60, diameter: 15, season: TireSeason.SUMMER },
  },
  {
    id: '7',
    sku: 'TIR-007',
    name: 'Hankook Kinergy 4S2 H750 205/60 R16',
    type: ProductType.TIRE,
    price: 8400,
    stockQuantity: 40,
    imageUrl: TIRE_IMAGES.stack,
    brand: 'Hankook',
    rating: 4.6,
    attributes: { width: 205, profile: 60, diameter: 16, season: TireSeason.ALL_SEASON },
  },
  {
    id: '8',
    sku: 'TIR-008',
    name: 'Goodyear UltraGrip Performance+ 235/55 R19',
    type: ProductType.TIRE,
    price: 16800,
    stockQuantity: 14,
    imageUrl: TIRE_IMAGES.detail,
    brand: 'Goodyear',
    rating: 4.9,
    attributes: { width: 235, profile: 55, diameter: 19, season: TireSeason.WINTER },
  },
  {
    id: '9',
    sku: 'TIR-009',
    name: 'Kumho Ecsta PS71 245/40 R18',
    type: ProductType.TIRE,
    price: 11800,
    stockQuantity: 22,
    imageUrl: TIRE_IMAGES.sport,
    brand: 'Kumho',
    rating: 4.4,
    attributes: { width: 245, profile: 40, diameter: 18, season: TireSeason.SUMMER },
  },
  {
    id: '10',
    sku: 'TIR-010',
    name: 'Toyo Observe GSi-6 195/55 R16',
    type: ProductType.TIRE,
    price: 7600,
    stockQuantity: 36,
    imageUrl: TIRE_IMAGES.workshop,
    brand: 'Toyo',
    rating: 4.5,
    attributes: { width: 195, profile: 55, diameter: 16, season: TireSeason.WINTER },
  },
  {
    id: '11',
    sku: 'WHL-001',
    name: 'Replica H LS 7x17 5x114.3 ET45',
    type: ProductType.WHEEL,
    price: 4500,
    stockQuantity: 24,
    imageUrl: WHEEL_IMAGES.replica,
    brand: 'Replica',
    rating: 4.5,
    attributes: { diameter: 17, pcd: '5x114.3', offsetEt: 45, boltCount: 5 },
  },
  {
    id: '12',
    sku: 'WHL-002',
    name: 'K&K KC1086 8x18 5x112 ET35',
    type: ProductType.WHEEL,
    price: 8900,
    stockQuantity: 16,
    imageUrl: WHEEL_IMAGES.sport,
    brand: 'K&K',
    rating: 4.7,
    attributes: { diameter: 18, pcd: '5x112', offsetEt: 35, boltCount: 5 },
  },
  {
    id: '13',
    sku: 'WHL-003',
    name: 'LS Wheels 1240 7.5x17 5x108 ET45',
    type: ProductType.WHEEL,
    price: 6200,
    stockQuantity: 20,
    imageUrl: WHEEL_IMAGES.silver,
    brand: 'LS Wheels',
    rating: 4.6,
    attributes: { diameter: 17, pcd: '5x108', offsetEt: 45, boltCount: 5 },
  },
  {
    id: '14',
    sku: 'WHL-004',
    name: 'Replica FD-123 6.5x16 4x100 ET35',
    type: ProductType.WHEEL,
    price: 3800,
    stockQuantity: 32,
    imageUrl: WHEEL_IMAGES.alloy,
    brand: 'Replica',
    rating: 4.3,
    attributes: { diameter: 16, pcd: '4x100', offsetEt: 35, boltCount: 4 },
  },
  {
    id: '15',
    sku: 'WHL-005',
    name: 'Yamato Samurai 8x19 5x120 ET33',
    type: ProductType.WHEEL,
    price: 12400,
    stockQuantity: 12,
    imageUrl: WHEEL_IMAGES.chrome,
    brand: 'Yamato',
    rating: 4.8,
    attributes: { diameter: 19, pcd: '5x120', offsetEt: 33, boltCount: 5 },
  },
  {
    id: '16',
    sku: 'WHL-006',
    name: 'Magnetto 15003 7x17 5x112 ET42',
    type: ProductType.WHEEL,
    price: 5400,
    stockQuantity: 28,
    imageUrl: WHEEL_IMAGES.matte,
    brand: 'Magnetto',
    rating: 4.4,
    attributes: { diameter: 17, pcd: '5x112', offsetEt: 42, boltCount: 5 },
  },
  {
    id: '17',
    sku: 'WHL-007',
    name: 'iFree Саблина 7x17 5x114.3 ET48',
    type: ProductType.WHEEL,
    price: 7100,
    stockQuantity: 18,
    imageUrl: WHEEL_IMAGES.black,
    brand: 'iFree',
    rating: 4.6,
    attributes: { diameter: 17, pcd: '5x114.3', offsetEt: 48, boltCount: 5 },
  },
  {
    id: '18',
    sku: 'WHL-008',
    name: 'Khomen KHW1702 7x17 5x100 ET35',
    type: ProductType.WHEEL,
    price: 4900,
    stockQuantity: 26,
    imageUrl: WHEEL_IMAGES.forged,
    brand: 'Khomen',
    rating: 4.5,
    attributes: { diameter: 17, pcd: '5x100', offsetEt: 35, boltCount: 5 },
  },
  {
    id: '19',
    sku: 'WHL-009',
    name: 'Replica B118 8x18 5x114.3 ET40',
    type: ProductType.WHEEL,
    price: 8200,
    stockQuantity: 15,
    imageUrl: WHEEL_IMAGES.multi,
    brand: 'Replica',
    rating: 4.7,
    attributes: { diameter: 18, pcd: '5x114.3', offsetEt: 40, boltCount: 5 },
  },
  {
    id: '20',
    sku: 'WHL-010',
    name: 'Dezent TZ 7.5x17 5x112 ET45',
    type: ProductType.WHEEL,
    price: 9600,
    stockQuantity: 14,
    imageUrl: WHEEL_IMAGES.premium,
    brand: 'Dezent',
    rating: 4.8,
    attributes: { diameter: 17, pcd: '5x112', offsetEt: 45, boltCount: 5 },
  },
];

export const PCD_OPTIONS = ['4x100', '5x100', '5x108', '5x112', '5x114.3', '5x120'] as const;

export const FILTER_WIDTHS = [185, 195, 205, 215, 225, 235, 245];
export const FILTER_PROFILES = [40, 45, 55, 60, 65];
export const FILTER_DIAMETERS = [15, 16, 17, 18, 19];

export function getProductById(id: string) {
  return mockProducts.find((p) => p.id === id);
}
