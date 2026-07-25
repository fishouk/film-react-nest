import { FilmEntity, ScheduleEntity } from './films.schema';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export interface IFilmsRepository {
  findAll(): Promise<FilmEntity[]>;
  findById(id: string): Promise<FilmEntity | null>;
  takeSeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<ScheduleEntity>;
}
