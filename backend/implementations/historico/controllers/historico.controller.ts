import { Controller, Get, Param, UseGuards,Request,Post, Body, Delete, Put } from '@nestjs/common';
import { ListaUsuarioPessoalDTO } from 'implementations/user/dtos/usuario/ListaUsuario.dto'; 
import { JwtAuthGuardUser } from 'implementations/user/Guards/jwtAuthUser.guard';
import { RolesGuardUser } from 'implementations/user/Guards/rolesUser.guard';
import { UsuarioService } from 'implementations/user/services/user.service';
import { HistoricoService } from '../services/historico.service';
import { UpdateHistoricoDto } from '../dtos/AtualizarHistorico.dto';
import { CreateHistoricoDto } from '../dtos/CriarHistorico.dto';


@Controller('historico')
export class HistoricoController {

  constructor(
    private readonly UsuarioService: UsuarioService,
    private readonly historicoService: HistoricoService
  ) {
  
  }

  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Get('listaHistorico')
  async findProductsWithStore(@Request() req) {

    const id = req.user.userId;

    const user:ListaUsuarioPessoalDTO = await this.UsuarioService.ListaUmUsuarioDono(id);

    const idsHistorico:string[] = user.historico_de_viagens;

    const historicos = await this.historicoService.findByIds(idsHistorico);
  
  }

  @Get('todos')
  findAll() {
    return this.historicoService.findAll();
  }


  @Get('buscarUm/:id')
  findOne(@Param('id') id: string) {
    return this.historicoService.findOne(id);
  }


  @Post('criar')
  create(@Body() createHistoricoDto: CreateHistoricoDto) {
    return this.historicoService.create(createHistoricoDto);
  }


  @Put('atualizar/:id')
  update(
    @Param('id') id: string,
    @Body() updateHistoricoDto: UpdateHistoricoDto,
  ) {
    return this.historicoService.update(id, updateHistoricoDto);
  }


}
