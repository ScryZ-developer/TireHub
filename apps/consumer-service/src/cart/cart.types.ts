import { CartItem } from '@tirehub/shared';

export interface StoredCartItem extends CartItem {
  price?: number;
}
