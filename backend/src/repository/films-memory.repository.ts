import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { IFilmsRepository } from './films-repository.interface';
import { FilmEntity, ScheduleEntity } from './films.schema';

@Injectable()
export class FilmsMemoryRepository implements IFilmsRepository {
  private films: FilmEntity[];

  constructor() {
    const stubPath = join(
      __dirname,
      '..',
      '..',
      'test',
      'mongodb_initial_stub.json',
    );
    this.films = JSON.parse(readFileSync(stubPath, 'utf-8')) as FilmEntity[];
  }

  async findAll(): Promise<FilmEntity[]> {
    return this.films;
  }

  async findById(id: string): Promise<FilmEntity | null> {
    return this.films.find((film) => film.id === id) ?? null;
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

    session.taken.push(...seats);
    return session;
  }
}
