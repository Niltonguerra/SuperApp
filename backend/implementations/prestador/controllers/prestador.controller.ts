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
import { ListaPrestadorPessoalDTO,ListaPrestadorPublicoDTO, ListaPrestadorRetornoDTO} from '../dtos/prestador/ListaPrestador.dto';

import { RolesGuardPrestador } from '../Guards/rolesPrestador.guard';
import { JwtAuthGuardPrestador } from '../Guards/jwtAuthUser.guard';



@Controller('prestador')
export class PrestadorController {

  constructor(
    private readonly service: PrestadorService,
  ) {}


// serve como listaUmPrestador Publico
  @Get('search/:campo/:valor')
  async findByField( 
    @Param('campo') campo: string, @Param('valor') valor: string,
    @Query('limit') limit: number ): 
    Promise<{ resultado: ListaPrestadorPublicoDTO[]; message: string }>{

      const retorno:ListaPrestadorPublicoDTO[] = await this.service.findByField(campo, valor, limit);

      return {
        resultado: retorno,
        message: 'Busca realizada com sucesso',
      };
  }


  @Get('todos')
  async ListaPrestadorsPublicos(): Promise<{ Prestador: ListaPrestadorPublicoDTO[]; message: string }> {
    const Prestador: ListaPrestadorPublicoDTO[] = await this.service.findAll();
    return {
      Prestador,
      message: "todos os usuários encontrados com sucesso!"
    };
  }


  // @Get('CadastraPrestador')
  // async CadastraPrestador(@Query('token') token: string): Promise<MensagemRetornoDTO> {
  //   try {

  //     const email:MensagemRetornoDTO = await this.service.verificaEmail(token);

  //     const redis:CriaPrestadorDTO = await this.redisHashService.getHash(email.mensagem);

  //     const retorno:ListaPrestadorRetornoDTO = await this.service.CriarPrestador(redis);

  //     await this.redisHashService.deleteValueHash(email.mensagem);
      
  //     return {
  //       mensagem: 'Email verificado com sucesso',
  //       statusCode: 200,
  //       dadosUsuario: {
  //         email: retorno.email,
  //         nome: retorno.nome,
  //       },
  //     };

  //   } catch (error) {
  //     throw new HttpException('Token inválido ou expirado', HttpStatus.BAD_REQUEST);
  //   }
  // }



// rota do usuário
  @UseGuards(JwtAuthGuardPrestador, RolesGuardPrestador)
  @Get('read')
  async findById(@Request() req): Promise<{ Prestador: ListaPrestadorPessoalDTO; message: string }> {

    const PrestadorId = req.Prestador.PrestadorId;

    const Prestador: ListaPrestadorPessoalDTO  = await this.service.ListaUmPrestadorDono(PrestadorId);

    return {
      Prestador,
      message: 'Usuário encontrado com sucesso',
    };
  }










  // rota do usuário
  // @UseGuards(JwtAuthGuardPrestador, RolesGuardPrestador)
  // @Put('update') 
  // async update( @Request() req, @Body() Prestador:AtualizaPrestadorDTO ): Promise<{ Prestador: ListaPrestadorRetornoDTO; message: string }> {

  //   const PrestadorId = req.Prestador.PrestadorId;

  //   const retorno:ListaPrestadorRetornoDTO = await this.service.AtualizarPrestador(Prestador, PrestadorId);

  //   return {
  //     Prestador: retorno,
  //     message: 'editado com sucesso!'
  //   };
  // }


  // rota do usuário
  @UseGuards(JwtAuthGuardPrestador, RolesGuardPrestador)
  @Delete('disable')
  async remove(@Request() req): Promise<{retorno:ListaPrestadorRetornoDTO, message: String }> {

    const PrestadorId = req.Prestador.PrestadorId;

    const retorno:ListaPrestadorRetornoDTO = await this.service.DesativarPrestador(PrestadorId);

    return {
      retorno: retorno,
      message:  "conta desativada com sucesso",
    };
  }

}
