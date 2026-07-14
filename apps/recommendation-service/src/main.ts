import { NestFactory } from '@nestjs/core';
import { SERVICE_PORTS } from '@tirehub/shared';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? SERVICE_PORTS.RECOMMENDATION;
  await app.listen(port);
}

bootstrap();
