import { ListarViagemDto } from '../dtos/ListaViagem.dto';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Viagem } from '../entities/viagem.entity';
import { MensagemRetornoDTO, MensagemSolicitarCaronaDTO } from '../dtos/Mensagens.dto';
import { UsuarioService } from 'implementations/user/services/user.service';
import { Message, MessageDocument } from 'implementations/chat/schemas/message.schema';
import { ChatRoom, ChatRoomDocument } from 'implementations/chat/schemas/chatRoom.schema';

@Injectable()
export class ViagemUsuarioService {
  constructor(
    @InjectModel('viagens') private viagemModel: Model<Viagem>,
    private readonly usuarioService: UsuarioService,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
  ) {}

  // Lista uma única viagem por ID
  async listarUmViagem(idViagem: string): Promise<{
    MensagemRetornoDTO:MensagemRetornoDTO;
    ListarViagemDto:ListarViagemDto;
  }> {
    
    try {
      const viagem = await this.viagemModel.findById(idViagem).exec();

      if (!viagem) {
        throw new NotFoundException('Viagem não encontrada');
      }

      return {
        MensagemRetornoDTO: {
          mensagem: 'Viagem encontrada',
          statusCode: 200,
        },
          ListarViagemDto: {
          _id: viagem._id.toString(),
          custo: viagem.custo,
          origem: viagem.origem,
          destino: viagem.destino,
          data_hora_partida: viagem.data_hora_partida,
          data_hora_chegada: viagem.data_hora_chegada,
          quantidade_de_vagas: viagem.quantidade_de_vagas,
          nome_prestador: viagem.nome_prestador,
          id_usuarios: viagem.id_usuarios,
        }
      };

    } catch (error) {
      console.error('Erro ao buscar viagem:', error);
      throw new Error('Erro ao buscar a viagem');
    }
  }

  // Lista todas as viagens de um usuário específico
  async listaTodasAsViagensPorUsuario(idUsuario: string): Promise<{
    MensagemRetornoDTO:MensagemRetornoDTO; 
    ListarViagemDto?:ListarViagemDto[];
  }> {
    try {

      const viagens = await this.viagemModel.find({id_usuarios: { $in: [idUsuario] } }).exec();

      if (!viagens || viagens.length === 0) {
        return {
          MensagemRetornoDTO: {
            mensagem: 'Nenhuma viagem encontrada',
            statusCode: 404,
          },
        };
      }

      const viagensMapeadas: ListarViagemDto[] = viagens.map((viagem) => ({
        _id: viagem._id.toString(),
        id_usuarios: viagem.id_usuarios,
        custo: viagem.custo,
        origem: viagem.origem,
        destino: viagem.destino,
        data_hora_partida: viagem.data_hora_partida,
        data_hora_chegada: viagem.data_hora_chegada,
        quantidade_de_vagas: viagem.quantidade_de_vagas,
        nome_prestador: viagem.nome_prestador,
      }));

      return {
        MensagemRetornoDTO: {
          mensagem: 'Viagens encontradas',
          statusCode: 200,
        },
        ListarViagemDto: viagensMapeadas,
      };
    } catch (error) {
      console.error('Erro ao listar as viagens do usuário:', error);
      throw new Error('Erro ao listar as viagens, tente novamente mais tarde');
    }
  }


  async solicitarViagem(idViagem: string, usuarioId: string): Promise<MensagemSolicitarCaronaDTO> {
    try {
      // Busca a viagem pelo ID
      const viagem = await this.viagemModel.findById(idViagem).exec();
  
      // Verifica se a viagem existe e se ainda há vagas
      if (!viagem) {
        throw new NotFoundException('Viagem não encontrada');
      }
  
      if (viagem.quantidade_de_vagas <= 0) {
        throw new NotFoundException('Não há mais vagas disponíveis para essa viagem');
      }
  
      // Atualiza a quantidade de vagas e adiciona o usuário à viagem
      viagem.quantidade_de_vagas -= 1;
      if (!viagem.id_usuarios.includes(usuarioId)) {
        viagem.id_usuarios.push(usuarioId);
        await viagem.save();
      }else{
        throw new NotFoundException('Usuário já está na viagem');
      }
  
      // Atualiza o usuário com a viagem solicitada
      const usuario = await this.usuarioService.ListaUmUsuarioDono(usuarioId);
  
      if (!usuario) {
        throw new NotFoundException('Usuário não encontrado');
      }
  
      if (!usuario.id_viagens.includes(idViagem)) {
        usuario.id_viagens.push(idViagem);
        await this.usuarioService.AtualizarUsuario(usuario, usuarioId);
      }
      
  
      // Retorna mensagem de sucesso
      return {
        mensagem: 'Viagem solicitada com sucesso pelo usuário',
        statusCode: 200,
        dadosViagem: {
          idViagem: viagem._id.toString(),
          idsUsuarios:viagem.id_usuarios,
        },
      };
  
    } catch (error) {
      console.error('Erro ao solicitar a viagem:', error);
      throw new InternalServerErrorException('Erro ao solicitar a viagem, tente novamente mais tarde');
    }
  }

  // Finaliza uma viagem
  async finalizarViagem(idViagem: string): Promise<MensagemRetornoDTO> {
    try {
      const viagem = await this.viagemModel.findById(idViagem).exec();

      viagem.finalizada = true;
      await viagem.save();

      return {
        mensagem: 'Viagem finalizada com sucesso',
        statusCode: 200,
        dadosViagem: {
          idViagem: viagem._id,
          nomePrestador: viagem.nome_prestador,
        },
      };

    } catch (error) {
      console.error('Erro ao finalizar a viagem:', error);
      throw new Error('Erro ao finalizar a viagem');
    }
  }



  // Verifica o status de uma viagem (Exemplo de verificação de andamento)
  // async verificarViagem(idViagem: string): Promise<MensagemRetornoDTO> {
  //   try {
  //     const viagem = await this.viagemModel.findById(idViagem).exec();

  //     if (!viagem) {
  //       throw new NotFoundException('Viagem não encontrada');
  //     }

  //     return {
  //       mensagem: 'Status da viagem verificado com sucesso',
  //       statusCode: 200,
  //       dadosViagem: {
  //         idViagem: viagem._id,
  //         nomePrestador: viagem.nome_prestador,
  //       },
  //     };
  //   } catch (error) {
  //     console.error('Erro ao verificar o status da viagem:', error);
  //     throw new Error('Erro ao verificar o status da viagem');
  //   }
  // }

  // // Cancela uma viagem
  // async cancelarViagem(idViagem: string): Promise<MensagemRetornoDTO> {
  //   try {
  //     const viagem = await this.viagemModel.findById(idViagem).exec();

  //     if (!viagem) {
  //       throw new NotFoundException('Viagem não encontrada');
  //     }

  //     viagem.quantidade_de_vagas += 1;
  //     await viagem.save();

  //     return {
  //       mensagem: 'Viagem cancelada com sucesso',
  //       statusCode: 200,
  //       dadosViagem: viagem,
  //     };
  //   } catch (error) {
  //     console.error('Erro ao cancelar a viagem:', error);
  //     throw new Error('Erro ao cancelar a viagem');
  //   }
  // }

}
