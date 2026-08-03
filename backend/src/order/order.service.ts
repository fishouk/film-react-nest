import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  FILMS_REPOSITORY,
  IFilmsRepository,
} from '../repository/films-repository.interface';
import {
  CreateOrderDto,
  OrderResponseDto,
  OrderResultDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    if (!dto?.tickets?.length) {
      throw new HttpException(
        { error: 'Список билетов пуст' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const uniqueSeats = new Set<string>();
    for (const ticket of dto.tickets) {
      const seatKey = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;
      if (uniqueSeats.has(seatKey)) {
        throw new HttpException(
          { error: `Место ${ticket.row}:${ticket.seat} указано дважды` },
          HttpStatus.BAD_REQUEST,
        );
      }
      uniqueSeats.add(seatKey);
    }

    const groups = new Map<
      string,
      { filmId: string; sessionId: string; tickets: typeof dto.tickets }
    >();
    for (const ticket of dto.tickets) {
      const groupKey = `${ticket.film}::${ticket.session}`;
      const group = groups.get(groupKey) ?? {
        filmId: ticket.film,
        sessionId: ticket.session,
        tickets: [],
      };
      group.tickets.push(ticket);
      groups.set(groupKey, group);
    }

    for (const group of groups.values()) {
      const seats = group.tickets.map(
        (ticket) => `${ticket.row}:${ticket.seat}`,
      );
      await this.filmsRepository.takeSeats(
        group.filmId,
        group.sessionId,
        seats,
      );
    }

    const items: OrderResultDto[] = dto.tickets.map((ticket) => ({
      id: randomUUID(),
      film: ticket.film,
      session: ticket.session,
      daytime: ticket.daytime,
      row: ticket.row,
      seat: ticket.seat,
      price: ticket.price,
      day: ticket.day,
      time: ticket.time,
    }));

    return {
      total: items.length,
      items,
    };
  }
}
