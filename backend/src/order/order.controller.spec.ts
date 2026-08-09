import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: {
    createOrder: jest.Mock;
  };

  beforeEach(async () => {
    orderService = {
      createOrder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderService,
        },
      ],
    }).compile();

    controller = module.get(OrderController);
  });

  it('creates order via service', async () => {
    const dto = {
      email: 'test@test.ru',
      phone: '+7 (000) 000-00-00',
      tickets: [],
    } as CreateOrderDto;
    const response = { total: 0, items: [] };
    orderService.createOrder.mockResolvedValue(response);

    await expect(controller.createOrder(dto)).resolves.toEqual(response);
    expect(orderService.createOrder).toHaveBeenCalledWith(dto);
  });
});
