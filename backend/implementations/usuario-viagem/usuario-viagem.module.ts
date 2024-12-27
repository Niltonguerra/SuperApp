import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UsuarioViagemService } from './services/usuario-viagem.service';
import { UsuarioViagemController } from './controllers/usuario-viagem.controller';
import { UserModule } from '../../nest/src/modules/user/user.module';
import { ViagemModule } from '../../nest/src/modules/viagem/viagem.module';
import { UsuarioViagensSchema } from './entities/UsuarioViagens.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'usuario_viagens', schema: UsuarioViagensSchema }]),
    UserModule, 
    ViagemModule, 
  ],
  providers: [
    UsuarioViagemService,
  ],
  controllers: [
    UsuarioViagemController,
  ],
})
export class UsuarioViagemModule {}
