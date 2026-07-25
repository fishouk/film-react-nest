import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  FILMS_REPOSITORY,
  IFilmsRepository,
} from '../repository/films-repository.interface';
import {
  FilmDto,
  FilmsListDto,
  ScheduleDto,
  ScheduleListDto,
} from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async findAll(): Promise<FilmsListDto> {
    const films = await this.filmsRepository.findAll();
    const items: FilmDto[] = films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    }));

    return {
      total: items.length,
      items,
    };
  }

  async findSchedule(id: string): Promise<ScheduleListDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new HttpException(
        { error: 'Фильм не найден' },
        HttpStatus.NOT_FOUND,
      );
    }

    const items: ScheduleDto[] = film.schedule.map((session) => ({
      id: session.id,
      daytime: session.daytime,
      hall: String(session.hall),
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken,
    }));

    return {
      total: items.length,
      items,
    };
  }
}
