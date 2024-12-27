import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../entities/product.entity';
import { Model } from 'mongoose';
import { ListaProductForStoreDTO } from '../dtos/listaProduct.dto';
import { Usuario } from 'implementations/user/entities/user.entity';


@Injectable()
export class ServiceProductForStore {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @InjectModel('usuario') private readonly USerModel: Model<Usuario>,
  ) {}


  // procura os produtos pelo id da loja
  // async findStoreWithProducts(storeId: string): Promise<ListaProductForStoreDTO> {
    
    
  //   const store = await this.USerModel.findById(storeId).populate('product_id').exec(); 
    
  //   if (!store) {
  //     throw new NotFoundException('loja não encontrada');
  //   }

  //   const products = await this.productModel.find({ _id: { $in: store.product_id } }).exec();

  //   return {
  //     storeId: store._id.toString(),
  //     storeName: store.nome,
  //     products: products,
  //   };
  // }

}
