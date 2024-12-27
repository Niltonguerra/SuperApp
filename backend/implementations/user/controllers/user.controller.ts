import { HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsuarioService } from '../services/user.service';
import { CriaUsuarioDTO } from '../dtos/usuario/CriaUsuario.dto';
import { HashPasswordPipe } from '../pipes/passwordEncryption.pipe';
import {
  ListaUsuarioPessoalDTO,
  ListaUsuarioPublicoDTO,
} from '../dtos/usuario/ListaUsuario.dto';
import { DadosUsuarioAtualizarDTO } from '../dtos/usuario/DadosUsuarioAtualizar.dto';
import {
  ListaUsuarioRetornoDTO,
  MensagemRetornoDTO,
} from '../dtos/Mensagens.dto';
import { EmailService } from 'implementations/email/services/email.service';
import { RedisHashService } from 'implementations/redis/services/redisHash.service';
import { JwtAuthGuardUser } from '../Guards/jwtAuthUser.guard';
import { RolesGuardUser } from '../Guards/rolesUser.guard';
import * as moment from 'moment';

@Controller('usuario')
export class UserController {
  constructor(
    private readonly service: UsuarioService,
    private readonly emailService: EmailService,
    private readonly redisHashService: RedisHashService,
  ) {}

  // serve como listaUmUsuario Publico
  @Get('search/:campo/:valor')
  async findByField(
    @Param('campo') campo: string,
    @Param('valor') valor: string,
    @Query('limit') limit: number,
  ): Promise<{ resultado: ListaUsuarioPublicoDTO[]; message: string }> {
    const retorno: ListaUsuarioPublicoDTO[] = await this.service.findByField(
      campo,
      valor,
      limit,
    );

    return {
      resultado: retorno,
      message: 'Busca realizada com sucesso',
    };
  }

  @Get('todos')
  async ListaUsuariosPublicos(): Promise<{
    usuario: ListaUsuarioPublicoDTO[];
    message: string;
  }> {
    const usuario: ListaUsuarioPublicoDTO[] = await this.service.findAll();
    return {
      usuario,
      message: 'todos os usuários encontrados com sucesso!',
    };
  }

  @Post('validaCadastro')
  @UsePipes(new ValidationPipe(), HashPasswordPipe)
  async create(@Body() user: CriaUsuarioDTO): Promise<MensagemRetornoDTO> {
    const dataConvertida = moment(user.data_nascimento, 'DD/MM/YYYY').toDate();
    user.data_nascimento = dataConvertida;

    const verificaEmail: ListaUsuarioPublicoDTO[] =
      await this.service.findByField('email', user.email);
    if (verificaEmail.length > 0) {
      throw new ConflictException('Email já cadastrado');
    }

    const verificaCPF: ListaUsuarioPublicoDTO[] =
      await this.service.findByField('CPF', user.CPF);
    if (verificaCPF.length > 0) {
      throw new ConflictException('CPF já cadastrado');
    }

    await this.emailService.EnviaVerificacaoEmail(
      user.email,
      'usuario/CadastraUsuario',
    );

    await this.redisHashService.setHash(user.email, user, 3600);

    return {
      mensagem:
        'Cadastro realizado com sucesso, verifique seu e-mail em até 1 hora para ativar sua conta',
      statusCode: 201,
      dadosUsuario: {
        email: user.email,
        nome: user.nome,
      },
    };
  }

  @Get('CadastraUsuario')
  async CadastraUsuario(
    @Query('token') token: string,
  ): Promise<MensagemRetornoDTO> {
    try {
      const email: MensagemRetornoDTO = await this.service.verificaEmail(token);

      const redis: CriaUsuarioDTO = await this.redisHashService.getHash(
        email.mensagem,
      );

      const retorno: ListaUsuarioRetornoDTO =
        await this.service.CriarUsuario(redis);

      await this.redisHashService.deleteValueHash(email.mensagem);

      return {
        mensagem: 'Email verificado com sucesso',
        statusCode: 200,
        dadosUsuario: {
          email: retorno.email,
          nome: retorno.nome,
        },
      };
    } catch (error) {
      throw new HttpException(
        'Token inválido ou expirado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // rota do usuário
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Get('read')
  async findById(
    @Request() req,
  ): Promise<{ usuario: ListaUsuarioPessoalDTO; message: string }> {
    const userId = req.user.userId;

    const usuario: ListaUsuarioPessoalDTO =
      await this.service.ListaUmUsuarioDono(userId);

    return {
      usuario,
      message: 'Usuário encontrado com sucesso',
    };
  }

  // rota do usuário
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Put('update')
  async update(
    @Request() req,
    @Body() user: DadosUsuarioAtualizarDTO,
  ): Promise<{ usuario: ListaUsuarioRetornoDTO; message: string }> {
    const userId = req.user.userId;

    const retorno: ListaUsuarioRetornoDTO = await this.service.AtualizarUsuario(
      user,
      userId,
    );

    return {
      usuario: retorno,
      message: 'editado com sucesso!',
    };
  }

  // rota do usuário
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Delete('disable')
  async remove(
    @Request() req,
  ): Promise<{ retorno: ListaUsuarioRetornoDTO; message: string }> {
    const userId = req.user.userId;

    const retorno: ListaUsuarioRetornoDTO =
      await this.service.DesativarUsuario(userId);

    return {
      retorno: retorno,
      message: 'conta desativada com sucesso',
    };
  }
}
