import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioViagemService } from './usuario-viagem.service';

describe('UsuarioViagemService', () => {
  let service: UsuarioViagemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioViagemService],
    }).compile();

    service = module.get<UsuarioViagemService>(UsuarioViagemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
