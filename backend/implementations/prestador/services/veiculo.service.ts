import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarVeiculoDto } from '../dtos/veiculo/criaVeiculo.dto';
import { UpdateVeiculoDto } from '../dtos/veiculo/AtualizaVeiculo.dto';
import { User } from '../entities/prestador.entity';
import { ListaVeiculoRetorno } from '../dtos/veiculo/ListaVeiculoPublico.dto';
import { MensagemRetornoDTO } from '../dtos/Mensagens.dto';


@Injectable()
export class VeiculoService {
  constructor(
    @InjectModel('User') private readonly prestadorModel: Model<User>,
  ) {}

  async updateCarro(prestadorId: string, carroData: CriarVeiculoDto): Promise<Record<string, any>> {
    
    const prestador = await this.prestadorModel.findById(prestadorId);

    if (!prestador) {
      throw new NotFoundException('Prestador não encontrado');
    }

    console.log(prestador)

    prestador.CNH = 'carroData.CNH';
    prestador.tipo_conta = 'prestador'
    prestador.carro = {
      placa: carroData.placa,
      modelo: carroData.modelo,
      cor: carroData.cor,
      ano: carroData.ano,
      foto: carroData.foto,
      criado_em: new Date(),
      atualizado_em: new Date(),
    }

    await prestador.save();


    return prestador;
  }



  









}
