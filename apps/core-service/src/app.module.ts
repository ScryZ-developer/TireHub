import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { Seller } from './sellers/sellers.entity';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'tirehub',
      password: process.env.DB_PASSWORD ?? 'tirehub_secret',
      database: process.env.DB_NAME ?? 'tirehub',
      entities: [User, Seller],
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    AdminModule,
    NotificationsModule,
  ],
})
export class AppModule {}
