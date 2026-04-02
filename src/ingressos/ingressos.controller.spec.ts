import { Test, TestingModule } from '@nestjs/testing';
import { IngressosController } from './ingressos.controller';
import { IngressosService } from './ingressos.service';

describe('IngressosController', () => {
  let controller: IngressosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngressosController],
      providers: [IngressosService],
    }).compile();

    controller = module.get<IngressosController>(IngressosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
