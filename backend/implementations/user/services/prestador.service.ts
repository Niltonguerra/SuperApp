import { NotFoundException, InternalServerErrorException, Logger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MensagemRetornoDTO } from '../dtos/Mensagens.dto'; 
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../entities/user.entity'; 
import { ListaPrestadorPessoalDTO, ListaPrestadorPublicoDTO } from '../dtos/prestador/ListaPrestador.dto';
import { AtualizaPrestadorDTO } from '../dtos/prestador/AtualizarPrestador.dto';

@Injectable()
export class PrestadorService {
  
  constructor(
    @InjectModel('usuario') private readonly userModel: Model<Usuario>,
  ) {}


  private readonly logger = new Logger(PrestadorService.name);


  async ListaUmPrestadorDono(id: string):  Promise <ListaPrestadorPessoalDTO | null> {
    try {
      const Prestador: Usuario | null = await this.userModel.findById(id).exec();
      
      if (!Prestador) {
        throw new Error('Erro, não foi possivel encontrar o usuário pelo id informado');
      }

      const retorno:ListaPrestadorPessoalDTO = {
        id: Prestador._id.toString(),
        nome: Prestador.nome,
        email: Prestador.email,
        telefone: Prestador.telefone,
        foto: Prestador.foto,
        data_nascimento: Prestador.data_nascimento,
        endereco: Prestador.endereco,
        avaliacao_como_cliente: Prestador.avaliacao_como_cliente,
        historico_de_viagens: [],
        CPF: Prestador.CPF,
        tipo_conta: Prestador.tipo_conta,
        CNH: Prestador.CNH,
        RG: Prestador.RG,
        avaliacao_como_prestador: Prestador.avaliacao_como_prestador,
        CRLV: Prestador.CRLV,
        DPVAT: Prestador.DPVAT,
        foto_CNH: Prestador.foto_CNH,
        carro: {
          ano: Prestador.carro.ano,
          cor: Prestador.carro.cor,
          foto: Prestador.carro.foto,
          modelo: Prestador.carro.modelo,
          placa: Prestador.carro.placa,
        },
        id_viagens: Prestador.id_viagens,
      }

      return retorno;

    } catch (error) {
      // Log de erro opcional
      console.error('Error finding Prestador by ID:', error);
      throw new Error('Failed to find Prestador by ID');
    }
  }


  async AtualizarPrestador(Prestador:AtualizaPrestadorDTO, id: string): Promise<MensagemRetornoDTO> {
    try {

      this.logger.log(`Atualizando o prestador com id: ${id}`);
      const tornaPrestador:Partial<Usuario> = {
        CNH: Prestador.CNH,
        RG: Prestador.RG,
        CRLV: Prestador.CRLV,
        DPVAT: Prestador.DPVAT,
        foto_CNH: Prestador.foto_CNH,
        avaliacao_como_prestador: 3,
        tipo_conta: "prestador",
      }
      const updatedPrestador: Usuario | null = await this.userModel.findByIdAndUpdate(id, tornaPrestador, { new: true }).exec();
      
      if (!updatedPrestador) {
        throw new NotFoundException('Prestador não encontrado para realizar a atualização');
      }

      return {
        mensagem: 'Prestador atualizado com sucesso',
        statusCode: 200,
        dadosUsuario: {
          nome: updatedPrestador.nome,
          email: updatedPrestador.email,  
        }
      };

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error na atualização do usuário');
    }
  }

  async findByField(campo: string, valor: string, limit?: number):Promise<ListaPrestadorPublicoDTO[]> {
    try{
      let query = {};

      query[campo] = valor;

      let searchQuery = this.userModel.find(query);

      if (limit) {
        searchQuery = searchQuery.limit(limit);
      }

      const data: Usuario[] | null = await searchQuery.exec();

      if(!data) {
        throw new Error('Erro ao buscar o usuário pelo campo informado');
      }

      const retorno: ListaPrestadorPublicoDTO[] = data.map((user: Usuario) => {
        return {
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          foto: user.foto,
          avaliacao_como_cliente: user.avaliacao_como_cliente,
          avaliacao_como_prestador: user.avaliacao_como_prestador,
          carro: {
            ano: user.carro.ano,
            cor: user.carro.cor,
            foto: user.carro.foto,
            modelo: user.carro.modelo,
            placa: user.carro.placa,
          },
          id_viagens: user.id_viagens,
        };
      });

      return retorno;
    } catch (error) {
      console.error('erro ao tentar encontrar todos os usuários no service:', error);
      throw new Error('Erro ao buscar todos os usuários no service');
    }
  }


  async findAll(): Promise<ListaPrestadorPublicoDTO[]> {
    try {
      const data: Usuario[] | null = await this.userModel.find().exec();
  
      if(!data) {
        console.log('Erro ao buscar todos os usuários no banco de dados')
        throw new Error('Erro ao buscar todos os usuários');
      }

      const retorno: ListaPrestadorPublicoDTO[] = data.map((user) => {
        return {
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          foto: user.foto,
          avaliacao_como_cliente: user.avaliacao_como_cliente,
          avaliacao_como_prestador: user.avaliacao_como_prestador,
          carro: {
            ano: user.carro.ano,
            cor: user.carro.cor,
            foto: user.carro.foto,
            modelo: user.carro.modelo,
            placa: user.carro.placa,
          },
          id_viagens: user.id_viagens,
        };
      });


      return retorno;

    } catch (error) {
      // Log de erro opcional
      console.error('erro ao tentar encontrar todos os usuários no service:', error);
      throw new Error('Erro ao buscar todos os usuários no service');
    }
  }
  
}

