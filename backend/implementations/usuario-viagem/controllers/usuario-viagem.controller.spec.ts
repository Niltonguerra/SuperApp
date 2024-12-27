import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioViagemController } from './usuario-viagem.controller';

describe('UsuarioViagemController', () => {
  let controller: UsuarioViagemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioViagemController],
    }).compile();

    controller = module.get<UsuarioViagemController>(UsuarioViagemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
