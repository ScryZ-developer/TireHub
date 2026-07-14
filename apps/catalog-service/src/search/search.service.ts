import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import {
  PaginatedResponse,
  ProductWithAttributes,
  TireSeason,
} from '@tirehub/shared';
import { SearchQueryDto } from './dto/search-query.dto';

export interface SearchFacets {
  type: Array<{ value: string; count: number }>;
  season: Array<{ value: string; count: number }>;
  width: Array<{ value: number; count: number }>;
  profile: Array<{ value: number; count: number }>;
  diameter: Array<{ value: number; count: number }>;
  pcd: Array<{ value: string; count: number }>;
  brand: Array<{ value: string; count: number }>;
}

export interface SearchResult extends PaginatedResponse<ProductWithAttributes> {
  facets: SearchFacets;
}

@Injectable()
export class SearchService implements OnModuleInit {
  private readonly logger = new Logger(SearchService.name);
  private readonly client: Client;
  private readonly index: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get<string>(
        'ELASTICSEARCH_NODE',
        'http://localhost:9200',
      ),
    });
    this.index = this.configService.get<string>(
      'ELASTICSEARCH_INDEX',
      'products',
    );
  }

  async onModuleInit(): Promise<void> {
    try {
      const exists = await this.client.indices.exists({ index: this.index });

      if (!exists) {
        await this.client.indices.create({
          index: this.index,
          mappings: {
            properties: {
              id: { type: 'keyword' },
              sku: { type: 'keyword' },
              name: { type: 'text' },
              type: { type: 'keyword' },
              price: { type: 'float' },
              stockQuantity: { type: 'integer' },
              imageUrl: { type: 'keyword' },
              description: { type: 'text' },
              brand: { type: 'keyword' },
              rating: { type: 'float' },
              isActive: { type: 'boolean' },
              width: { type: 'integer' },
              profile: { type: 'integer' },
              diameter: { type: 'float' },
              pcd: { type: 'keyword' },
              season: { type: 'keyword' },
              offsetEt: { type: 'integer' },
              boltCount: { type: 'integer' },
            },
          },
        });
        this.logger.log(`Created Elasticsearch index "${this.index}"`);
      }
    } catch (error) {
      this.logger.warn(
        `Elasticsearch unavailable; search will fail until connected: ${(error as Error).message}`,
      );
    }
  }

  async search(query: SearchQueryDto): Promise<SearchResult> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const from = (page - 1) * limit;

    const must: object[] = [{ term: { isActive: true } }];

    if (query.q) {
      must.push({
        multi_match: {
          query: query.q,
          fields: ['name^3', 'brand^2', 'sku', 'description'],
          fuzziness: 'AUTO',
        },
      });
    }

    if (query.type) {
      must.push({ term: { type: query.type } });
    }

    if (query.season) {
      must.push({ term: { season: query.season } });
    }

    if (query.width !== undefined) {
      must.push({ term: { width: query.width } });
    }

    if (query.profile !== undefined) {
      must.push({ term: { profile: query.profile } });
    }

    if (query.diameter !== undefined) {
      must.push({ term: { diameter: query.diameter } });
    }

    if (query.pcd) {
      must.push({ term: { pcd: query.pcd } });
    }

    if (query.brand) {
      must.push({ term: { brand: query.brand } });
    }

    const filter: object[] = [];

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.push({
        range: {
          price: {
            ...(query.minPrice !== undefined ? { gte: query.minPrice } : {}),
            ...(query.maxPrice !== undefined ? { lte: query.maxPrice } : {}),
          },
        },
      });
    }

    const response = await this.client.search({
      index: this.index,
      from,
      size: limit,
      query: {
        bool: {
          must,
          ...(filter.length ? { filter } : {}),
        },
      },
      aggs: {
        type: { terms: { field: 'type', size: 10 } },
        season: { terms: { field: 'season', size: 10 } },
        width: { terms: { field: 'width', size: 50 } },
        profile: { terms: { field: 'profile', size: 50 } },
        diameter: { terms: { field: 'diameter', size: 50 } },
        pcd: { terms: { field: 'pcd', size: 50 } },
        brand: { terms: { field: 'brand', size: 50 } },
      },
    });

    const total =
      typeof response.hits.total === 'number'
        ? response.hits.total
        : (response.hits.total?.value ?? 0);

    const data = response.hits.hits.map((hit) => {
      const source = hit._source as Record<string, unknown>;
      return this.mapHitToProduct(source);
    });

    const aggs = response.aggregations as Record<
      string,
      { buckets: Array<{ key: string | number; doc_count: number }> }
    >;

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
      facets: {
        type: this.mapTermsAgg(aggs.type),
        season: this.mapTermsAgg(aggs.season),
        width: this.mapNumericTermsAgg(aggs.width),
        profile: this.mapNumericTermsAgg(aggs.profile),
        diameter: this.mapNumericTermsAgg(aggs.diameter),
        pcd: this.mapTermsAgg(aggs.pcd),
        brand: this.mapTermsAgg(aggs.brand),
      },
    };
  }

  async indexProduct(document: Record<string, unknown>): Promise<void> {
    const id = String(document.id);
    await this.client.index({
      index: this.index,
      id,
      document,
      refresh: true,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.client.delete({
      index: this.index,
      id,
      refresh: true,
    });
  }

  private mapHitToProduct(source: Record<string, unknown>): ProductWithAttributes {
    const {
      width,
      profile,
      diameter,
      pcd,
      offsetEt,
      season,
      boltCount,
      stockQuantity,
      imageUrl,
      ...product
    } = source;

    return {
      ...(product as unknown as ProductWithAttributes),
      stockQuantity: Number(stockQuantity),
      imageUrl: imageUrl as string | undefined,
      attributes: {
        width: width !== undefined ? Number(width) : undefined,
        profile: profile !== undefined ? Number(profile) : undefined,
        diameter: diameter !== undefined ? Number(diameter) : undefined,
        pcd: pcd as string | undefined,
        offsetEt: offsetEt !== undefined ? Number(offsetEt) : undefined,
        season: season as TireSeason | undefined,
        boltCount: boltCount !== undefined ? Number(boltCount) : undefined,
      },
    };
  }

  private mapTermsAgg(
    agg?: { buckets: Array<{ key: string | number; doc_count: number }> },
  ): Array<{ value: string; count: number }> {
    return (agg?.buckets ?? []).map((bucket) => ({
      value: String(bucket.key),
      count: bucket.doc_count,
    }));
  }

  private mapNumericTermsAgg(
    agg?: { buckets: Array<{ key: string | number; doc_count: number }> },
  ): Array<{ value: number; count: number }> {
    return (agg?.buckets ?? []).map((bucket) => ({
      value: Number(bucket.key),
      count: bucket.doc_count,
    }));
  }
}
