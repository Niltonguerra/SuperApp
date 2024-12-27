import { HttpException, HttpStatus,ConflictException } from '@nestjs/common';
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
  ValidationPipe 
} from '@nestjs/common';
import { PrestadorService } from '../services/prestador.service';
import { ListaPrestadorPessoalDTO,ListaPrestadorPublicoDTO} from '../dtos/prestador/ListaPrestador.dto';
import { JwtAuthGuardUser } from '../Guards/jwtAuthUser.guard';
import { RolesGuardUser } from '../Guards/rolesUser.guard';
import { AtualizaPrestadorDTO } from '../dtos/prestador/AtualizarPrestador.dto';
import { MensagemRetornoDTO } from '../dtos/Mensagens.dto';



@Controller('prestador')
export class PrestadorController {

  constructor(
    private readonly prestadorservice: PrestadorService,
  ) {}

  // rota do usuário
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Get('search/:campo/:valor/:limit')
  async findByField( 
    @Param('campo') campo: string, @Param('valor') valor: string, @Param('limit') limit: number ): 
    Promise<{ resultado: ListaPrestadorPublicoDTO[]; message: string }>{

      const retorno:ListaPrestadorPublicoDTO[] = await this.prestadorservice.findByField(campo, valor, limit);

      return {
        resultado: retorno,
        message: 'Busca realizada com sucesso',
      };
  }


  @Get('todos')
  async ListaPrestadorsPublicos(): Promise<{ Prestador: ListaPrestadorPublicoDTO[]; message: string }> {
    const Prestador: ListaPrestadorPublicoDTO[] = await this.prestadorservice.findAll();
    return {
      Prestador,
      message: "todos os usuários encontrados com sucesso!"
    };
  }


// rota do usuário
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Get('read')
  async findById(@Request() req): Promise<{ Prestador: ListaPrestadorPessoalDTO; message: string }> {

    const PrestadorId = req.user.userId;

    const Prestador: ListaPrestadorPessoalDTO  = await this.prestadorservice.ListaUmPrestadorDono(PrestadorId);

    return {
      Prestador,
      message: 'Usuário encontrado com sucesso',
    };
  }

  
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Put('update') 
  async update( @Request() req, @Body() Prestador:AtualizaPrestadorDTO ): Promise<MensagemRetornoDTO> {

    const PrestadorId = req.user.userId;

    const retorno:MensagemRetornoDTO = await this.prestadorservice.AtualizarPrestador(Prestador, PrestadorId);

    return {
      mensagem: retorno.mensagem,
      statusCode: retorno.statusCode,
    };
  }

}
