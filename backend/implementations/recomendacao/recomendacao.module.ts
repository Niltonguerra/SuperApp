import { Module } from '@nestjs/common';
import { RecomendacaoService } from './services/recomendacao.service';
import { RecomendacaoController } from './controllers/recomendacao.controller';
import { ProductService } from 'implementations/product/services/product.service';
import { StoreService } from 'implementations/store/services/store.service';
import { UserService } from 'implementations/user/services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'implementations/product/entities/product.entity';
import { StoreSchema } from 'implementations/store/entities/store.entity';
import { UserSchema } from 'implementations/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({

  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [RecomendacaoController],
  providers: [
    RecomendacaoService,
    ProductService,
    StoreService,
    UserService,
    JwtAuthGuardUser,
    JwtService,
    RolesGuardUser
  ],
  
})
export class RecomendacaoModule {}
