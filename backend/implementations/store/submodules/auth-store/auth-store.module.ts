import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; 
import { StoreModule } from '../../store.module';
import { StoreService } from '../../services/store.service';
import { StoreAuthService } from './services/auth-store.service';
import { JwtStrategyStore } from './strategies/jwt-store.strategy';
import { RolesGuardStore } from './guards/roles-store.guard';
import { JwtAuthGuardStore } from './guards/jwt-auth-store.guard';
import { AuthStoreController } from './controllers/auth-store.controller';
import { StoreSchema } from '../../entities/store.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    StoreModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_JWT_SESSION_STORE'),
        signOptions: { expiresIn: configService.get<string>( '24h') 
        },
      }),
    }),
  ],
  controllers: [
    AuthStoreController, // Verifique se o controlador está no caminho correto
  ],
  providers: [
    StoreAuthService,
    StoreService,
    JwtStrategyStore,
    RolesGuardStore,
    JwtAuthGuardStore,
  ],
  exports: [
    JwtStrategyStore,
    RolesGuardStore,
    StoreAuthService,
    JwtAuthGuardStore,
  ],
})
export class AuthStoreModule {}
