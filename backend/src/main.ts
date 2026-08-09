import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';
import { createLogger } from './logger/logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  app.useLogger(createLogger(configService.get<string>('LOGGER_TYPE')));
  app.setGlobalPrefix('api/afisha', {
    exclude: [
      { path: 'content/afisha/(.*)', method: RequestMethod.ALL },
      { path: 'content/afisha', method: RequestMethod.ALL },
    ],
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
