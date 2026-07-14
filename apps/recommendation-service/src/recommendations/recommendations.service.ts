import { Injectable } from '@nestjs/common';
import { RecommendationBlock } from '@tirehub/shared';
import { MOCK_PRODUCTS } from './mock-products';

@Injectable()
export class RecommendationsService {
  getCrossSell(productId?: string): RecommendationBlock {
    const products = productId
      ? MOCK_PRODUCTS.filter((p) => p.id !== productId).slice(0, 4)
      : MOCK_PRODUCTS.slice(0, 4);

    return {
      id: 'cross-sell',
      title: 'С этим товаром покупают',
      type: 'cross_sell',
      products,
    };
  }

  getRecentlyViewed(userId?: string): RecommendationBlock {
    const offset = userId ? userId.charCodeAt(0) % 3 : 0;
    const products = MOCK_PRODUCTS.slice(offset, offset + 4);

    return {
      id: 'recently-viewed',
      title: 'Недавно просмотренные',
      type: 'recently_viewed',
      products,
    };
  }

  getPopular(): RecommendationBlock {
    const products = [...MOCK_PRODUCTS]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 6);

    return {
      id: 'popular',
      title: 'Популярные товары',
      type: 'popular',
      products,
    };
  }
}
