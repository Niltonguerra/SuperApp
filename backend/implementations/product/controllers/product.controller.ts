import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';
import { CriaProductDTO } from '../dtos/CriarProduct.dto';
import { ServiceProductForStore } from '../services/productStore.service';
import { ListaProductDTO } from '../dtos/listaProduct.dto';
import { PrestadorService } from 'implementations/user/services/prestador.service';
import { JwtAuthGuardUser } from 'implementations/user/Guards/jwtAuthUser.guard';
import { RolesGuardUser } from 'implementations/user/Guards/rolesUser.guard';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly prestadorService: PrestadorService,
    private readonly serviceStoreProduct: ServiceProductForStore
  ) {}


  // @Get('listaProdutosPorNomeDaLoja/:nome')
  // async findProductsWithStore(@Param('nome') nome: string) {
   
  //   const storeId:string = await this.prestadorService.findByName(nome);

    
  //   const retorno = await this.serviceStoreProduct.findStoreWithProducts(storeId);

  //   return retorno;
  // }


  @Get('search/:campo/:valor')
  async findByField( 
    @Param('campo') campo: string, @Param('valor') valor: string,
    @Query('limit') limit: number ): 
      Promise<{ resultado: ListaProductDTO[]; message: string }>{

      const retorno:ListaProductDTO[] = await this.productService.findByField(campo, valor, limit);

      return {
        resultado: retorno,
        message: 'Busca realizada com sucesso',
      };
  }


  @Get('todos')
  async findAll() {
    const retorno = await this.productService.findAll();

    return retorno;
  }

  // @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  // @Post('create')
  // async create(@Request() req, @Body() product:CriaProductDTO) {
    
  //   const storeId = req.user.userId;


  //   const newProduct: Product = {
  //     ...product,
  //     store_id: storeId,
  //     Criado_em: new Date(),
  //     atualizado_em: new Date(),
  //   }

  //   const existeStore = await this.prestadorService.findById(storeId);


  //   if (!existeStore) {
  //     return {
  //       message: 'Loja não encontrada',
  //     };
  //   }


  //   // cadastra do produto
  //   const retorno = await this.productService.create(newProduct);

  //   // atualiza o id do produto na loja
  //   const storeData = await this.prestadorService.updateProductIdForStore(retorno._id.toString(), storeId);

  //   return {
  //     usuario: retorno,
  //     message: 'criado com sucesso',
  //   };

  // }


  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Put('update')
  async update(@Request() req, @Body() product: Product) {
    
    const storeId = req.user.userId;
    
    const retorno = await this.productService.update(product, storeId);

    return {
      usuario: retorno,
      message: 'editado com sucesso',
    };
  }


  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Delete('delete')
  async remove(@Request() req) {

    const storeId = req.user.userId;
    
    const retorno = await this.productService.remove(storeId);

    return {
      usuario: retorno,
      message: 'excluido com sucesso',
    };
  }
  
}
