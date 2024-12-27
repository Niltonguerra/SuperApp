import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './entities/product.entity';
import { ServiceProductForStore } from './services/productStore.service';
import { JwtService } from '@nestjs/jwt';
import { UsuarioSchema } from '../user/entities/user.entity';
import { PrestadorService } from '../user/services/prestador.service';
import { RolesGuardUser } from '../user/Guards/rolesUser.guard';
import { JwtAuthGuardUser } from '../user/Guards/jwtAuthUser.guard';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: 'usuario', schema: UsuarioSchema }]),
  ],
  controllers: [ProductController],
  providers: [
    ServiceProductForStore,
    ProductService,
    PrestadorService,
    JwtService,
    RolesGuardUser,
    JwtAuthGuardUser,
  ],
})
export class ProductModule {}
