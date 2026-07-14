import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RABBITMQ_QUEUES } from '@tirehub/shared';
import * as amqp from 'amqplib';
import { SearchService } from '../search/search.service';

export interface CatalogSyncEvent {
  action: 'index' | 'delete';
  productId: string;
  payload?: Record<string, unknown>;
}

@Injectable()
export class SyncService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SyncService.name);
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly searchService: SearchService,
  ) {}

  async onModuleInit(): Promise<void> {
    const url = this.configService.get<string>(
      'RABBITMQ_URL',
      'amqp://tirehub:tirehub_secret@localhost:5672',
    );

    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertQueue(RABBITMQ_QUEUES.CATALOG_SYNC, {
        durable: true,
      });

      await this.channel.consume(
        RABBITMQ_QUEUES.CATALOG_SYNC,
        (message) => {
          if (!message) {
            return;
          }

          void this.handleMessage(message).finally(() => {
            this.channel?.ack(message);
          });
        },
        { noAck: false },
      );

      this.logger.log(
        `Listening on RabbitMQ queue "${RABBITMQ_QUEUES.CATALOG_SYNC}"`,
      );
    } catch (error) {
      this.logger.warn(
        `RabbitMQ unavailable; sync stub idle: ${(error as Error).message}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }

  async handleMessage(message: amqp.ConsumeMessage): Promise<void> {
    const event = JSON.parse(message.content.toString()) as CatalogSyncEvent;

    this.logger.debug(
      `Received sync event: ${event.action} product ${event.productId}`,
    );

    switch (event.action) {
      case 'index':
        if (event.payload) {
          await this.searchService.indexProduct(event.payload);
        }
        break;
      case 'delete':
        await this.searchService.deleteProduct(event.productId);
        break;
      default:
        this.logger.warn(`Unknown sync action: ${String(event.action)}`);
    }
  }

  /** Stub for publishing sync events from product CRUD (future use). */
  async publishSyncEvent(event: CatalogSyncEvent): Promise<void> {
    if (!this.channel) {
      this.logger.warn('RabbitMQ channel not available; event not published');
      return;
    }

    this.channel.sendToQueue(
      RABBITMQ_QUEUES.CATALOG_SYNC,
      Buffer.from(JSON.stringify(event)),
      { persistent: true },
    );
  }
}
