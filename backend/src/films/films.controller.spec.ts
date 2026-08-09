import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: {
    findAll: jest.Mock;
    findSchedule: jest.Mock;
  };

  beforeEach(async () => {
    filmsService = {
      findAll: jest.fn(),
      findSchedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsService,
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
  });

  it('returns films list from service', async () => {
    const response = { total: 1, items: [{ id: '1', title: 'Film' }] };
    filmsService.findAll.mockResolvedValue(response);

    await expect(controller.getFilms()).resolves.toEqual(response);
    expect(filmsService.findAll).toHaveBeenCalledTimes(1);
  });

  it('returns schedule from service', async () => {
    const response = { total: 1, items: [{ id: 's1' }] };
    filmsService.findSchedule.mockResolvedValue(response);

    await expect(controller.getSchedule('film-1')).resolves.toEqual(response);
    expect(filmsService.findSchedule).toHaveBeenCalledWith('film-1');
  });
});
