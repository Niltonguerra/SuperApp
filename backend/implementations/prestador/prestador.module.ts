import {  Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/prestador.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrestadorService } from './services/prestador.service';
import { AuthPrestadorService } from './services/authPrestador.service';
import { JwtAuthGuardPrestador } from './Guards/jwtAuthUser.guard';
import { JwtStrategyPrestador } from './strategies/jwtPrestador.strategy';
import { RolesGuardPrestador } from './Guards/rolesPrestador.guard';
import { PrestadorController } from './controllers/prestador.controller';
import { AuthPrestadorController } from './controllers/authPrestador.controller';
import { VeiculoService } from './services/veiculo.service';
import { VeiculoController } from './controllers/veiculo.controller';
import { UserModule } from '../../nest/src/modules/user/user.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule,
    UserModule,
  ],
  providers: [
    PrestadorService,
    AuthPrestadorService,
    JwtService, 
    JwtAuthGuardPrestador,
    JwtStrategyPrestador,
    RolesGuardPrestador,
    VeiculoService,
  ],
  controllers: [
    PrestadorController,
    AuthPrestadorController,
    VeiculoController,
  ],
  exports: [
    PrestadorService,
    JwtAuthGuardPrestador,
    RolesGuardPrestador,
  ],

})

export class PrestadorModule{}
