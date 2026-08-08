import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { IFilmsRepository } from './films-repository.interface';
import { FilmEntity, ScheduleEntity } from './films.schema';

@Injectable()
export class FilmsPostgresRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly schedulesRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmEntity[]> {
    const films = await this.filmsRepository.find({
      relations: { schedule: true },
    });
    return films.map((film) => this.toFilmEntity(film));
  }

  async findById(id: string): Promise<FilmEntity | null> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });
    return film ? this.toFilmEntity(film) : null;
  }

  async takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<ScheduleEntity> {
    const film = await this.filmsRepository.findOne({ where: { id: filmId } });
    if (!film) {
      throw new HttpException(
        { error: 'Фильм не найден' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const session = await this.schedulesRepository.findOne({
      where: { id: sessionId, filmId },
    });
    if (!session) {
      throw new HttpException(
        { error: 'Сеанс не найден' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const taken = this.parseTaken(session.taken);
    for (const seat of seats) {
      if (taken.includes(seat)) {
        throw new HttpException(
          { error: `Место ${seat} уже занято` },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const nextTaken = [...taken, ...seats];
    session.taken = nextTaken.join(',');
    await this.schedulesRepository.save(session);

    return this.toScheduleEntity(session);
  }

  private toFilmEntity(film: Film): FilmEntity {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseTags(film.tags),
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: (film.schedule ?? []).map((item) =>
        this.toScheduleEntity(item),
      ),
    };
  }

  private toScheduleEntity(schedule: Schedule): ScheduleEntity {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: this.parseTaken(schedule.taken),
    };
  }

  private parseTags(tags: string): string[] {
    if (!tags) {
      return [];
    }
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  private parseTaken(taken: string): string[] {
    if (!taken) {
      return [];
    }
    return taken
      .split(',')
      .map((seat) => seat.trim())
      .filter(Boolean);
  }
}
