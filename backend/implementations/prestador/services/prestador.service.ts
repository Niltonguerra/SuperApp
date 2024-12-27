import { NotFoundException, InternalServerErrorException, Logger, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MensagemRetornoDTO } from '../dtos/Mensagens.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/prestador.entity';
import { ListaPrestadorPessoalDTO, ListaPrestadorPublicoDTO, ListaPrestadorRetornoDTO } from '../dtos/prestador/ListaPrestador.dto';
import { LoginPrestadorInternoDTO } from '../dtos/login/AuthPrestador.dto';
import { CriaPrestadorDTO } from '../dtos/prestador/CriaPrestador.dto';
import { AtualizaPrestadorDTO } from '../dtos/prestador/AtualizarPrestador.dto';


@Injectable()
export class PrestadorService {
  
  constructor(
    @InjectModel('User') private readonly PrestadorModel: Model<User>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}


  private readonly logger = new Logger(PrestadorService.name);




  async findByField(campo: string, valor: string, limit?: number):Promise<ListaPrestadorPublicoDTO[]> {
    try{
      let query = {};

      query[campo] = valor;

      let searchQuery = this.PrestadorModel.find(query);

      if (limit) {
        searchQuery = searchQuery.limit(limit);
      }

      const data: User[] | null = await searchQuery.exec();

      if(!data) {
        throw new Error('Erro ao buscar o usuário pelo campo informado');
      }

      const retorno: ListaPrestadorPublicoDTO[] = data.map((Prestador: ListaPrestadorPublicoDTO) => {
        return {
          nome: Prestador.nome,
          email: Prestador.email,
          telefone: Prestador.telefone,
          foto: Prestador.foto,
          avaliacao_como_cliente: Prestador.avaliacao_como_cliente,
          avaliacao_como_prestador: Prestador.avaliacao_como_prestador,
          
        };
      });

      return retorno;
    } catch (error) {
      console.error('erro ao tentar encontrar todos os usuários no service:', error);
      throw new Error('Erro ao buscar todos os usuários no service');
    }
  }






// rota para uso interno não espola a o usuário!!!
  async findByEmail(valor: string): Promise<LoginPrestadorInternoDTO | null> {
    try {
      // Pesquisa pelo email no modelo Mongoose
      const pesquisa: User | null = await this.PrestadorModel.findOne({ email: valor }).exec();

      // Verifica se nenhum usuário foi encontrado
      if (!pesquisa) {
        console.error('Usuário não encontrado para o email informado:', valor);
        throw new Error('email incorreto');
      }

      const retorno:LoginPrestadorInternoDTO = {
        _id: pesquisa._id.toString(),
        senha: pesquisa.senha,
        nome: pesquisa.nome,
        email: pesquisa.email
      }

      return retorno; 
      
    } catch (error) {
      console.error('Erro ao tentar encontrar usuário pelo email:', error);
      throw new Error('Erro ao tentar encontrar usuário pelo email');
    }
  }




  // async CriarPrestador(Prestador: CriaPrestadorDTO):Promise<ListaPrestadorRetornoDTO> {
  // try{

  //   const newPrestador:Prestador = {
  //     CPF: Prestador.CPF,
  //     nome: Prestador.nome,
  //     email: Prestador.email,
  //     senha: Prestador.senha,
  //     telefone: Prestador.telefone,
  //     foto: Prestador.foto,
  //     data_nascimento: Prestador.data_nascimento,
  //     endereco: Prestador.endereco,
  //     usuario_ativo: true,
  //     tipo_conta: 'prestador',
  //     historico_de_viagens: [],
  //     avaliacao_como_cliente: 0,
  //     criado_em: new Date(),      
  //     modificado_em: new Date(),
  //     avaliacao_como_prestador: '0',
  //     CNH: Prestador.CNH,
  //     RG: Prestador.RG,
  //     CRLV: Prestador.CRLV,
  //     DPVAT: Prestador.DPVAT,
  //     foto_CNH: Prestador.foto_CNH,
  //   };

  //   const data: Prestador | null = await new this.PrestadorModel(newPrestador).save();

  //   if (!data) {
  //     console.error('erro ao cadastrar o usuário no service');
  //     throw new Error('Erro ao cadastrar o usuário, por favor tente mais tarde');
  //   }

  //   return {
  //       nome: data.nome,
  //       email: data.email,
  //   };

  //   } catch (error) {
  //     console.error('erro cadastrar um novo usuário, erro:', error);
  //     throw new Error('erro cadastrar um novo usuário');
  //   }
  // }


  async verificaEmail(token: string): Promise<MensagemRetornoDTO> {
    try {
      
      const decoded = this.jwtService.verify(token,{secret: this.configService.get<string>('SECRET_JWT_EMAIL')});
  
     
      if (!decoded || !decoded.email) {
        throw new Error('Token não contém um e-mail válido.');
      }
  
      return {
        mensagem:decoded.email,
        statusCode: 200,
      };
  
    } catch (error) {

      this.logger.error(`Erro na verificação de email: ${error.message}`);

      if (error.name === 'TokenExpiredError') {
        return {
          mensagem: 'Token expirado, solicite um novo',
          statusCode: 401, // Unauthorized
        };
      } 
      return {
        mensagem: 'Token inválido ou expirado',
        statusCode: 400, // Bad Request
      };
    }
  }



  async findAll(): Promise<ListaPrestadorPublicoDTO[]> {
    try {
      const data: User[] | null = await this.PrestadorModel.find().exec();
  
      if(!data) {
        console.log('Erro ao buscar todos os usuários no banco de dados')
        throw new Error('Erro ao buscar todos os usuários');
      }

      const retorno: ListaPrestadorPublicoDTO[] = data.map((Prestador: ListaPrestadorPublicoDTO) => {
        return {
          nome: Prestador.nome,
          email: Prestador.email,
          telefone: Prestador.telefone,
          foto: Prestador.foto,
          avaliacao_como_cliente: Prestador.avaliacao_como_cliente,
          avaliacao_como_prestador: Prestador.avaliacao_como_prestador,
        };
      });


      return retorno;

    } catch (error) {
      // Log de erro opcional
      console.error('erro ao tentar encontrar todos os usuários no service:', error);
      throw new Error('Erro ao buscar todos os usuários no service');
    }
  }
  


  async ListaUmPrestadorDono(id: string):  Promise <ListaPrestadorPessoalDTO | null> {
    try {
      const Prestador: User | null = await this.PrestadorModel.findById(id).exec();
      
      if (!Prestador) {
        throw new Error('Erro, não foi possivel encontrar o usuário pelo id informado');
      }

      const retorno:ListaPrestadorPessoalDTO = {
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
      }

      return retorno;

    } catch (error) {
      // Log de erro opcional
      console.error('Error finding Prestador by ID:', error);
      throw new Error('Failed to find Prestador by ID');
    }
  }

  async AtualizarPrestador(Prestador:AtualizaPrestadorDTO, id: string): Promise<ListaPrestadorRetornoDTO> {
    try {
      const updatedPrestador: User | null = await this.PrestadorModel.findByIdAndUpdate(id, Prestador, { new: true }).exec();
      
      if (!updatedPrestador) {
        throw new NotFoundException('Prestador não encontrado para realizar a atualização');
      }

      const retorno: ListaPrestadorRetornoDTO = {
        nome: updatedPrestador.nome,
        email: updatedPrestador.email,
      };

      return retorno;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error na atualização do usuário');
    }
  }


  async DesativarPrestador( id: string): Promise<any> {
    try {

      const Prestador: Partial<User> = {
        usuario_ativo: false,
      };

      const disablePrestador: User | null = await this.PrestadorModel.findByIdAndUpdate(id, Prestador, { new: true }).exec();

      if (!disablePrestador) {
        throw new NotFoundException('Prestador não encontrado para realizar a desativação');
      }

      const retorno: ListaPrestadorRetornoDTO = {
        nome: disablePrestador.nome,
        email: disablePrestador.email,
      };
      
      return retorno;

    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error na desativação do usuário');
    }
  }

}

