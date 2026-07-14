import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SellerType } from '@tirehub/shared';
import { ListingEntity } from './listing.entity';

@Entity('sellers')
export class SellerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'enum', enum: SellerType })
  type!: SellerType;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 100 })
  city!: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 255, nullable: true })
  email?: string;

  @Column({ name: 'avatar_url', length: 500, nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, default: 0 })
  rating!: number;

  @Column({ name: 'listings_count', default: 0 })
  listingsCount!: number;

  @Column({ name: 'is_verified', default: false })
  isVerified!: boolean;

  @OneToMany(() => ListingEntity, (listing) => listing.seller)
  listings!: ListingEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
