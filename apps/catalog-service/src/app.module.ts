import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { SearchModule } from './search/search.module';
import { SyncModule } from './sync/sync.module';
import { ListingsModule } from './listings/listings.module';
import { Product } from './products/entities/product.entity';
import { ProductAttribute } from './products/entities/product-attribute.entity';
import { ListingEntity } from './listings/entities/listing.entity';
import { SellerEntity } from './listings/entities/seller.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'tirehub'),
        password: config.get<string>('DB_PASSWORD', 'tirehub_secret'),
        database: config.get<string>('DB_DATABASE', 'tirehub'),
        entities: [Product, ProductAttribute, ListingEntity, SellerEntity],
        synchronize: false,
      }),
    }),
    ProductsModule,
    ListingsModule,
    SearchModule,
    SyncModule,
  ],
})
export class AppModule {}
