import {
  NotFoundException,
  InternalServerErrorException,
  Logger,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ListaUsuarioPessoalDTO,
  ListaUsuarioPublicoDTO,
} from '../dtos/usuario/ListaUsuario.dto';
import { CriaUsuarioDTO } from '../dtos/usuario/CriaUsuario.dto';
import { DadosUsuarioAtualizarDTO } from '../dtos/usuario/DadosUsuarioAtualizar.dto';
import {
  ListaUsuarioRetornoDTO,
  MensagemRetornoDTO,
} from '../dtos/Mensagens.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../entities/user.entity';
import { LoginUsuarioInternoDTO } from '../dtos/autenticacao/AuthUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('usuario') private readonly usuarioModel: Model<Usuario>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(UserService.name);

  async findByField(
    campo: string,
    valor: string,
    limit?: number,
  ): Promise<ListaUsuarioPublicoDTO[]> {
    try {
      const query = {};

      query[campo] = valor;

      let searchQuery = this.usuarioModel.find(query);

      if (limit) {
        searchQuery = searchQuery.limit(limit);
      }

      const data: Usuario[] | null = await searchQuery.exec();

      if (!data) {
        throw new Error('Erro ao buscar o usuário pelo campo informado');
      }

      const retorno: ListaUsuarioPublicoDTO[] = data.map(
        (usuario: ListaUsuarioPublicoDTO) => {
          return {
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            foto: usuario.foto,
            avaliacao_como_cliente: usuario.avaliacao_como_cliente,
          };
        },
      );

      return retorno;
    } catch (error) {
      console.error(
        'erro ao tentar encontrar todos os usuários no service:',
        error,
      );
      throw new Error('Erro ao buscar todos os usuários no service');
    }
  }

  async findByEmail(valor: string): Promise<LoginUsuarioInternoDTO | null> {
    try {
      // Pesquisa pelo email no modelo Mongoose
      const pesquisa: Usuario | any = await this.usuarioModel
        .findOne({ email: valor })
        .exec();

      const retorno: LoginUsuarioInternoDTO = {
        _id: pesquisa._id.toString(),
        senha: pesquisa.senha,
        nome: pesquisa.nome,
        email: pesquisa.email,
      };

      return retorno;
    } catch (error) {
      console.error('Erro ao tentar encontrar usuário pelo email:', error);
      throw new HttpException(
        'Erro ao tentar encontrar usuário pelo email',
        400,
      );
    }
  }

  async CriarUsuario(usuario: CriaUsuarioDTO): Promise<ListaUsuarioRetornoDTO> {
    try {
      const newusuario: Usuario = {
        CPF: usuario.CPF,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        telefone: usuario.telefone,
        foto: usuario.foto,
        data_nascimento: usuario.data_nascimento,
        endereco: usuario.endereco,
        usuario_ativo: true,
        tipo_conta: 'usuario',
        historico_de_viagens: [],
        avaliacao_como_cliente: 0,
        criado_em: new Date(),
        modificado_em: new Date(),
        avaliacao_como_prestador: undefined,
        carro: undefined,
        CNH: undefined,
        RG: undefined,
        CRLV: undefined,
        foto_CNH: undefined,
        DPVAT: undefined,
      };

      const data: Usuario | null = await new this.usuarioModel(
        newusuario,
      ).save();

      if (!data) {
        console.error('erro ao cadastrar o usuário no service');
        throw new Error(
          'Erro ao cadastrar o usuário, por favor tente mais tarde',
        );
      }

      return {
        nome: data.nome,
        email: data.email,
      };
    } catch (error) {
      console.error('erro cadastrar um novo usuário, erro:', error);
      throw new Error('erro cadastrar um novo usuário');
    }
  }

  async verificaEmail(token: string): Promise<MensagemRetornoDTO> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('SECRET_JWT_EMAIL'),
      });

      if (!decoded || !decoded.email) {
        throw new Error('Token não contém um e-mail válido.');
      }

      return {
        mensagem: decoded.email,
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

  async findAll(): Promise<ListaUsuarioPublicoDTO[]> {
    try {
      const data: Usuario[] | null = await this.usuarioModel.find().exec();

      if (!data) {
        console.log('Erro ao buscar todos os usuários no banco de dados');
        throw new Error('Erro ao buscar todos os usuários');
      }

      const retorno: ListaUsuarioPublicoDTO[] = data.map(
        (usuario: ListaUsuarioPublicoDTO) => {
          return {
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            foto: usuario.foto,
            avaliacao_como_cliente: usuario.avaliacao_como_cliente,
          };
        },
      );

      return retorno;
    } catch (error) {
      // Log de erro opcional
      console.error(
        'erro ao tentar encontrar todos os usuários no service:',
        error,
      );
      throw new Error('Erro ao buscar todos os usuários no service');
    }
  }

  async ListaUmUsuarioDono(id: string): Promise<ListaUsuarioPessoalDTO | null> {
    try {
      const usuario: Usuario | null = await this.usuarioModel
        .findById(id)
        .exec();

      if (!usuario) {
        throw new Error(
          'Erro, não foi possivel encontrar o usuário pelo id informado',
        );
      }

      const retorno: ListaUsuarioPessoalDTO = {
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
        foto: usuario.foto,
        data_nascimento: usuario.data_nascimento,
        endereco: usuario.endereco,
        avaliacao_como_cliente: usuario.avaliacao_como_cliente,
        historico_de_viagens: [],
        CPF: usuario.CPF,
        tipo_conta: usuario.tipo_conta,
        id_viagens: usuario.id_viagens,
      };

      return retorno;
    } catch (error) {
      // Log de erro opcional
      console.error('Error finding usuario by ID:', error);
      throw new Error('Failed to find usuario by ID');
    }
  }

  async AtualizarUsuario(
    usuario: DadosUsuarioAtualizarDTO,
    id: string,
  ): Promise<ListaUsuarioRetornoDTO> {
    try {
      const updatedusuario: Usuario | null = await this.usuarioModel
        .findByIdAndUpdate(id, usuario, { new: true })
        .exec();

      if (!updatedusuario) {
        throw new NotFoundException(
          'Usuario não encontrado para realizar a atualização',
        );
      }

      const retorno: ListaUsuarioRetornoDTO = {
        nome: updatedusuario.nome,
        email: updatedusuario.email,
      };

      return retorno;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error na atualização do usuário');
    }
  }

  async DesativarUsuario(id: string): Promise<any> {
    try {
      const usuario: Partial<Usuario> = {
        usuario_ativo: false,
      };

      const disableusuario: Usuario | null = await this.usuarioModel
        .findByIdAndUpdate(id, usuario, { new: true })
        .exec();

      if (!disableusuario) {
        throw new NotFoundException(
          'Usuario não encontrado para realizar a desativação',
        );
      }

      const retorno: ListaUsuarioRetornoDTO = {
        nome: disableusuario.nome,
        email: disableusuario.email,
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
