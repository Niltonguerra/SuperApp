import { ListarViagemDto } from '../dtos/ListaViagem.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, HttpStatus, HttpException, UseGuards,Request } from '@nestjs/common';
import { ViagemCRUDService } from '../services/viagemCRUD.service';
import { CriarViagemDto } from '../dtos/criarViagem.dto';
import { MensagemRetornoDTO } from '../dtos/Mensagens.dto';
import { AtualizaViagemDto } from '../dtos/AtualizaViagem.dto';
import { JwtAuthGuardUser } from 'implementations/user/Guards/jwtAuthUser.guard';
import { RolesGuardUser } from 'implementations/user/Guards/rolesUser.guard';
import { UsuarioService } from 'implementations/user/services/user.service';


@Controller('viagem')
export class ViagemCRUDController {
  constructor(
    private readonly viagemCRUDService: ViagemCRUDService,
    private readonly usuarioService: UsuarioService
  ) {}



  // Rota para criar uma nova viagem
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Post('criar')
  async criarViagem( @Body() criarViagemDto: CriarViagemDto, @Request() req ): Promise<MensagemRetornoDTO> {
    try {

      const userId = req.user.userId;
      const dados = await this.usuarioService.findByField('_id', userId);
      const nomePrestador = dados[0].nome;

      const retorno =  await this.viagemCRUDService.criarViagem(criarViagemDto, nomePrestador, userId);
    
      return retorno;

    } catch (error) {
      throw new HttpException('Erro ao criar a viagem', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Rota para atualizar uma viagem existente
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Put('atualizar')
  async atualizarViagem( @Body() atualizaViagemDto: AtualizaViagemDto, @Body('idViagem') idViagem: string, @Request() req ): Promise<MensagemRetornoDTO> {
    try {

      
      const userId = req.user.userId;
      const dados = await this.usuarioService.findByField('_id', userId);
      const nomePrestador = dados[0].nome;


      return await this.viagemCRUDService.atualizarViagem(atualizaViagemDto, idViagem,nomePrestador);

    } catch (error) {
      throw new HttpException('Erro ao atualizar a viagem', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Rota para listar todas as viagens
  // @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Get('listarTodos')
  async listaTodasAsViagens(): Promise<{ MensagemRetornoDTO, ListarViagemDto }> {
    try {
      
      const retorno = await this.viagemCRUDService.listaTodasAsViagens();

      return retorno;

    } catch (error) {
      throw new HttpException('Erro ao listar todas as viagens', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Rota para deletar uma viagem
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Delete('deletar')
  async deletarViagem(@Body('idViagem') idViagem: string): Promise<MensagemRetornoDTO> {
    try {
      
      const retorno = await this.viagemCRUDService.deletarViagem(idViagem);
      
      return retorno;

    } catch (error) {
      throw new HttpException('Erro ao deletar a viagem', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}