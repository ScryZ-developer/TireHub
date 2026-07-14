import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TireSeason } from '@tirehub/shared';
import { Product } from './product.entity';

@Entity('product_attributes')
export class ProductAttribute {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId!: string;

  @Column({ type: 'int', nullable: true })
  width?: number;

  @Column({ type: 'int', nullable: true })
  profile?: number;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  diameter?: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pcd?: string;

  @Column({ name: 'offset_et', type: 'int', nullable: true })
  offsetEt?: number;

  @Column({ type: 'enum', enum: TireSeason, enumName: 'tire_season', nullable: true })
  season?: TireSeason;

  @Column({ name: 'load_index', type: 'varchar', length: 10, nullable: true })
  loadIndex?: string;

  @Column({ name: 'speed_index', type: 'varchar', length: 5, nullable: true })
  speedIndex?: string;

  @Column({ name: 'bolt_count', type: 'int', nullable: true })
  boltCount?: number;

  @OneToOne(() => Product, (product) => product.attributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;
}
