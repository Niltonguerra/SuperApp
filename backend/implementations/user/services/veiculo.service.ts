import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CriarVeiculoDto } from '../dtos/veiculo/criaVeiculo.dto';
import { UpdateVeiculoDto } from '../dtos/veiculo/AtualizaVeiculo.dto';
import {  Usuario } from '../entities/user.entity'; 
import { ListaVeiculoRetorno } from '../dtos/veiculo/ListaVeiculoPublico.dto';
import { MensagemRetornoDTO } from '../dtos/Mensagens.dto';

@Injectable()
export class VeiculoService {
  constructor(
    @InjectModel('usuario') private readonly userModel: Model<Usuario>,
  ) {}

  async updateCarro(prestadorId: string, carroData: CriarVeiculoDto): Promise<MensagemRetornoDTO> {
    
    const prestador = await this.userModel.findById(prestadorId);

    if (!prestador) {
      throw new NotFoundException('Prestador não encontrado');
    }
    
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

    return {
      mensagem: 'Carro cadastrado com sucesso',
      statusCode: 200,
    };

    
  }

  
  async deletarCarro(prestadorId: string): Promise<MensagemRetornoDTO> {
    
    const prestador = await this.userModel.findById(prestadorId);

    if (!prestador) {
      throw new NotFoundException('Prestador não encontrado');
    }

    prestador.carro = undefined;

    await prestador.save();

    return {
      mensagem: 'Carro removido com sucesso',
      statusCode: 200,
    }
  }

}
