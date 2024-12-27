// src/viagem/viagem.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Viagem } from '../entities/viagem.entity';
import { CriarViagemDto } from '../dtos/criarViagem.dto';
import { AtualizaViagemDto } from '../dtos/AtualizaViagem.dto';
import { ListarViagemDto } from '../dtos/ListaViagem.dto';
import { MensagemRetornoDTO } from '../dtos/Mensagens.dto';
import { UsuarioService } from 'implementations/user/services/user.service';



@Injectable()
export class ViagemCRUDService {
  constructor(
    @InjectModel('viagens') private viagemModel: Model<Viagem>,
    private readonly usuarioService: UsuarioService
  ) {}


  async criarViagem(Viagem: CriarViagemDto,nomePrestador:string,idPrestador:string): Promise<MensagemRetornoDTO> {
    try{
      const newViagem:Viagem = {
        custo: Viagem.custo,
        origem: Viagem.origem,
        destino: Viagem.destino,
        data_hora_partida: Viagem.data_hora_partida,
        data_hora_chegada: Viagem.data_hora_chegada,
        quantidade_de_vagas: Viagem.quantidade_de_vagas,
        nome_prestador: nomePrestador,
        finalizada: false,
        id_usuarios: [idPrestador],
      };

      const data: Viagem | null = await new this.viagemModel(newViagem).save();

      if (!data) {
        console.error('erro ao cadastrar a viagem no service');
        throw new Error('Erro ao cadastrar a viagem, por favor tente mais tarde');
      }


      const usuario = await this.usuarioService.ListaUmUsuarioDono(idPrestador);
      usuario.id_viagens = [...usuario.id_viagens, data._id.toString()];
      await this.usuarioService.AtualizarUsuario(usuario, idPrestador);

      if (!usuario) {
        console.error('erro ao cadastrar a viagem no usuario no service');
        throw new Error('Erro ao cadastrar a viagem no usuario, por favor tente mais tarde');
      }


      return {
        mensagem: 'Viagem criada com sucesso',
        statusCode: 201,
        dadosViagem: {
          nomePrestador: data.nome_prestador,
          idViagem: data._id,
        },
      }
    } catch (error) {
      console.error('erro cadastrar uma nova viagem, erro:', error);
      throw new Error('erro cadastrar uma nova viagem');
    }
  }

  async atualizarViagem(atualizaViagemDto: AtualizaViagemDto,idViagem:string,nomePrestador:string): Promise<MensagemRetornoDTO> {
    try {
      const novaViagem: Viagem = {
        custo: atualizaViagemDto.custo,
        origem: atualizaViagemDto.origem,
        destino: atualizaViagemDto.destino,
        data_hora_partida: atualizaViagemDto.data_hora_partida,
        data_hora_chegada: atualizaViagemDto.data_hora_chegada,
        quantidade_de_vagas: atualizaViagemDto.quantidade_de_vagas,
        nome_prestador: nomePrestador,
      };
  
      const data: Viagem | null = await this.viagemModel.findByIdAndUpdate(idViagem, novaViagem, { new: true });
  
      if (!data) {
        console.error('Erro ao atualizar a viagem no service');
        throw new Error('Erro ao atualizar a viagem, por favor tente mais tarde');
      }
  
      return {
        mensagem: 'Viagem atualizada com sucesso',
        statusCode: 200,
        dadosViagem: {
          nomePrestador: data.nome_prestador,
          idViagem: data._id,
        },
      };

    } catch (error) {
      console.error('Erro ao atualizar a viagem, erro:', error);
      throw new Error('Erro ao atualizar a viagem');
    }
  }
  

async listaTodasAsViagens(): Promise<{MensagemRetornoDTO, ListarViagemDto} > {
  try {
    const viagens = await this.viagemModel.find().exec(); // Busca todas as viagens


    if (!viagens || viagens.length === 0) {
      return {
        MensagemRetornoDTO: {
          mensagem: 'Nenhuma viagem encontrada',
          statusCode: 404
        },
        ListarViagemDto: [],
      };
    }

    const TodasAsViagens:ListarViagemDto[] = viagens.map((viagem)=> {
      return {
        _id: viagem._id.toString(),
        custo: viagem.custo,
        origem: viagem.origem,
        destino: viagem.destino,
        data_hora_partida: viagem.data_hora_partida,
        data_hora_chegada: viagem.data_hora_chegada,
        quantidade_de_vagas: viagem.quantidade_de_vagas,
        nome_prestador: viagem.nome_prestador,
        id_usuarios: viagem.id_usuarios,
        
      };
    })


    return {
      MensagemRetornoDTO: {
        mensagem: 'viagens encontradas com sucesso!',
        statusCode: 201
      },
      ListarViagemDto: TodasAsViagens,
    };

  } catch (error) {
    console.error('Erro ao listar todas as viagens:', error);
    throw new Error('Erro ao listar todas as viagens, tente novamente mais tarde');
  }
}


async deletarViagem(idViagem: string): Promise<MensagemRetornoDTO> {
  try {
    const viagemDeletada = await this.viagemModel.findByIdAndDelete(idViagem).exec();

    if (!viagemDeletada) {
      return {
        mensagem: 'Viagem não encontrada',
        statusCode: 404,
      };
    }

    return {
      mensagem: 'Viagem deletada com sucesso',
      statusCode: 200,
      dadosViagem: {
        nomePrestador: viagemDeletada.nome_prestador,
        idViagem: viagemDeletada._id,
      },
    };
  } catch (error) {
    console.error('Erro ao deletar a viagem:', error);
    throw new Error('Erro ao deletar a viagem, tente novamente mais tarde');
  }
}


}
