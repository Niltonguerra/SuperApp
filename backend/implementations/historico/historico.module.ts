import { Historico, HistoricoSchema } from './entities/historico.entity';
import { Module } from '@nestjs/common';
import { HistoricoController } from './controllers/historico.controller';
import { HistoricoService } from './services/historico.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioService } from '../user/services/user.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'historico', schema: HistoricoSchema }]),
    UserModule,
    JwtModule,

  ],
  controllers: [
    HistoricoController,
  ],
  providers: [
    HistoricoService,
  ]
})
export class HistoricoModule {}


// nest generate