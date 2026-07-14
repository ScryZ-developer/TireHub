import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  ProductType,
  ListingCondition,
  ListingStatus,
  TireSeason,
} from '@tirehub/shared';
import { SellerEntity } from './seller.entity';

@Entity('listings')
export class ListingEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'seller_id', type: 'uuid' })
  sellerId!: string;

  @ManyToOne(() => SellerEntity, (seller) => seller.listings)
  @JoinColumn({ name: 'seller_id' })
  seller!: SellerEntity;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ProductType })
  type!: ProductType;

  @Column({ type: 'enum', enum: ListingCondition, default: ListingCondition.NEW })
  condition!: ListingCondition;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ default: 1 })
  quantity!: number;

  @Column({ length: 100 })
  city!: string;

  @Column({ name: 'image_urls', type: 'text', array: true, default: '{}' })
  imageUrls!: string[];

  @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.ACTIVE })
  status!: ListingStatus;

  @Column({ name: 'views_count', default: 0 })
  viewsCount!: number;

  @Column({ length: 100, nullable: true })
  brand?: string;

  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  profile?: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  diameter?: number;

  @Column({ length: 20, nullable: true })
  pcd?: string;

  @Column({ name: 'offset_et', nullable: true })
  offsetEt?: number;

  @Column({ type: 'enum', enum: TireSeason, nullable: true })
  season?: TireSeason;

  @Column({ name: 'bolt_count', nullable: true })
  boltCount?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt?: Date;
}
