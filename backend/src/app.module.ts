import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { RepositoryModule } from './repository/repository.module';
import { Film } from './repository/entities/film.entity';
import { Schedule } from './repository/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.getOrThrow<string>('DATABASE_URL');
        const parsedUrl = new URL(databaseUrl);

        return {
          type: 'postgres' as const,
          host: parsedUrl.hostname,
          port: Number(parsedUrl.port) || 5432,
          database: parsedUrl.pathname.replace(/^\//, ''),
          username: configService.getOrThrow<string>('DATABASE_USERNAME'),
          password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    RepositoryModule,
    FilmsModule,
    OrderModule,
  ],
})
export class AppModule {}
