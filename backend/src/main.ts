import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
