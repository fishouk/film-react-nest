import { Module } from '@nestjs/common';
import { configProvider, AppConfig } from '../app.config.provider';
import { FILMS_REPOSITORY } from './films-repository.interface';
import { FilmsMemoryRepository } from './films-memory.repository';
import { FilmsMongodbRepository } from './films-mongodb.repository';

@Module({
  providers: [
    configProvider,
    FilmsMemoryRepository,
    FilmsMongodbRepository,
    {
      provide: FILMS_REPOSITORY,
      useFactory: (
        config: AppConfig,
        memory: FilmsMemoryRepository,
        mongo: FilmsMongodbRepository,
      ) => {
        return config.database.driver === 'mongodb' ? mongo : memory;
      },
      inject: ['CONFIG', FilmsMemoryRepository, FilmsMongodbRepository],
    },
  ],
  exports: [FILMS_REPOSITORY, configProvider],
})
export class RepositoryModule {}
