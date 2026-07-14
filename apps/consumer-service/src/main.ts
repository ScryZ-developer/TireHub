import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SERVICE_PORTS } from '@tirehub/shared';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors();

  const port = process.env.PORT ?? SERVICE_PORTS.CONSUMER;
  await app.listen(port);
  console.log(`Consumer service running on port ${port}`);
}

bootstrap();
