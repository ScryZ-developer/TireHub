import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RABBITMQ_QUEUES } from '@tirehub/shared';
import * as amqp from 'amqplib';

export interface NotificationEvent {
  type: string;
  userId?: string;
  email?: string;
  payload?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private connection: amqp.ChannelModel | null = null;
  private channel: amqp.Channel | null = null;

  async onModuleInit() {
    const url = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';

    try {
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(RABBITMQ_QUEUES.NOTIFICATIONS, {
        durable: true,
      });
      this.logger.log(`Connected to RabbitMQ queue "${RABBITMQ_QUEUES.NOTIFICATIONS}"`);
    } catch (error) {
      this.logger.warn(
        `RabbitMQ unavailable, notifications will be skipped: ${(error as Error).message}`,
      );
    }
  }

  async onModuleDestroy() {
    await this.channel?.close().catch(() => undefined);
    await this.connection?.close().catch(() => undefined);
  }

  async publish(event: NotificationEvent): Promise<void> {
    if (!this.channel) {
      this.logger.debug(`Skipped notification (no channel): ${event.type}`);
      return;
    }

    const message = Buffer.from(JSON.stringify(event));
    this.channel.sendToQueue(RABBITMQ_QUEUES.NOTIFICATIONS, message, {
      persistent: true,
      contentType: 'application/json',
    });
  }
}
