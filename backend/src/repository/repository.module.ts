import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configProvider } from '../app.config.provider';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { FILMS_REPOSITORY } from './films-repository.interface';
import { FilmsPostgresRepository } from './films-postgres.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Film, Schedule])],
  providers: [
    configProvider,
    FilmsPostgresRepository,
    {
      provide: FILMS_REPOSITORY,
      useExisting: FilmsPostgresRepository,
    },
  ],
  exports: [FILMS_REPOSITORY, configProvider, TypeOrmModule],
})
export class RepositoryModule {}
