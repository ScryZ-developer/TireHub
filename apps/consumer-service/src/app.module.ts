import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from './cart/cart.module';
import { GarageVehicle } from './garage/garage.entity';
import { GarageModule } from './garage/garage.module';
import { OrderItem } from './orders/order_items.entity';
import { Order } from './orders/orders.entity';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'tirehub'),
        password: config.get('DB_PASSWORD', 'tirehub_secret'),
        database: config.get('DB_NAME', 'tirehub'),
        entities: [Order, OrderItem, GarageVehicle],
        synchronize: false,
      }),
    }),
    CartModule,
    OrdersModule,
    GarageModule,
  ],
})
export class AppModule {}
