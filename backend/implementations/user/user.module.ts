import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema } from './entities/user.entity';
import { UsuarioService } from './services/user.service';
import { UsuarioController } from './controllers/user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RolesGuardUser } from './Guards/rolesUser.guard';
import { JwtAuthGuardUser } from './Guards/jwtAuthUser.guard';
import { AuthUserService } from './services/authUser.service';
import { JwtStrategyUser } from './strategies/jwtUser.strategy';
import { AuthUserController } from './controllers/auth.controller';
import { EmailService } from '../email/services/email.service';
import { PrestadorService } from './services/prestador.service';
import { VeiculoService } from './services/veiculo.service';
import { PrestadorController } from './controllers/prestador.controller';
import { VeiculoController } from './controllers/veiculo.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'usuario', schema: UsuarioSchema }]),
    JwtModule,
  ],
  providers: [
    UsuarioService,
    AuthUserService,
    JwtAuthGuardUser,
    JwtStrategyUser,
    RolesGuardUser,
    EmailService,
    PrestadorService,
    JwtService,
    VeiculoService,
  ],
  controllers: [
    UsuarioController,
    AuthUserController,
    PrestadorController,
    VeiculoController,
  ],
  exports: [
    JwtAuthGuardUser,
    RolesGuardUser,
    JwtStrategyUser,
    JwtService,
    UsuarioService,
    VeiculoService,
    PrestadorService,
  ],
})
export class UserModule {}
