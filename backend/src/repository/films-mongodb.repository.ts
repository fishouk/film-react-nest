import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import mongoose, { Connection, Model } from 'mongoose';
import { AppConfig } from '../app.config.provider';
import { IFilmsRepository } from './films-repository.interface';
import {
  FilmDocument,
  FilmEntity,
  FilmSchema,
  ScheduleEntity,
} from './films.schema';

@Injectable()
export class FilmsMongodbRepository
  implements IFilmsRepository, OnModuleInit, OnModuleDestroy
{
  private connection: Connection;
  private filmModel: Model<FilmDocument>;

  constructor(@Inject('CONFIG') private readonly config: AppConfig) {}

  async onModuleInit() {
    if (this.config.database.driver !== 'mongodb') {
      return;
    }
    this.connection = await mongoose
      .createConnection(this.config.database.url)
      .asPromise();
    this.filmModel = this.connection.model<FilmDocument>('films', FilmSchema);
  }

  async onModuleDestroy() {
    await this.connection?.close();
  }

  async findAll(): Promise<FilmEntity[]> {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return this.filmModel.findOne({ id }).lean().exec();
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<ScheduleEntity> {
    const film = await this.findById(filmId);
    if (!film) {
      throw new HttpException(
        { error: 'Фильм не найден' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const session = film.schedule.find((item) => item.id === sessionId);
    if (!session) {
      throw new HttpException(
        { error: 'Сеанс не найден' },
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const seat of seats) {
      if (session.taken.includes(seat)) {
        throw new HttpException(
          { error: `Место ${seat} уже занято` },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const taken = [...session.taken, ...seats];
    await this.filmModel.updateOne(
      { id: filmId, 'schedule.id': sessionId },
      { $set: { 'schedule.$.taken': taken } },
    );

    return { ...session, taken };
  }
}
