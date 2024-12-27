import { Controller, Get, Post, Param, Body, Request, UseGuards } from '@nestjs/common';
import { ListarViagemDto } from '../dtos/ListaViagem.dto';
import { MensagemRetornoDTO } from '../dtos/Mensagens.dto';
import { ViagemUsuarioService } from '../services/viagemUsuario.service';
import { RolesGuardUser } from 'implementations/user/Guards/rolesUser.guard';
import { JwtAuthGuardUser } from 'implementations/user/Guards/jwtAuthUser.guard';
import { ChatService } from 'implementations/chat/services/chat.service';

@Controller('viagens')
export class ViagemUsuarioController {
  constructor(
    private readonly viagemUsuarioService: ViagemUsuarioService,
    private readonly chatService:ChatService,
  ) {}


  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Post('listaUmaViagem')
  async listarUmViagem(@Body('idViagem') idViagem: string): Promise<{ 
    MensagemRetornoDTO:MensagemRetornoDTO; 
    ListarViagemDto:ListarViagemDto; 
  }> {
    return this.viagemUsuarioService.listarUmViagem(idViagem);
  }

  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Get('usuarioViagens')
  async listaTodasAsViagensPorUsuario(@Request() req): Promise<{ 
    MensagemRetornoDTO:MensagemRetornoDTO; 
    ListarViagemDto?:ListarViagemDto[]; 
  }> {
    const userId = req.user.userId;
    return this.viagemUsuarioService.listaTodasAsViagensPorUsuario(userId);
  }

  // Endpoint para solicitar uma viagem
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Get('solicitar')
  async solicitarViagem(@Body('idViagem') idViagem: string, @Request() req ): Promise<MensagemRetornoDTO> {
    const userId = req.user.userId;
    
    const reponse = this.viagemUsuarioService.solicitarViagem(idViagem, userId);
    
    const response2 = this.chatService.createRoom((await reponse).dadosViagem.idViagem,(await reponse).dadosViagem.idsUsuarios) 

    return {
      mensagem:'carona solicitada com sucesso!',
      statusCode:200,
    };
  }

  // Endpoint para finalizar uma viagem
  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Get('finalizar')
  async finalizarViagem(@Body('idViagem') idViagem: string): Promise<MensagemRetornoDTO> {
    return this.viagemUsuarioService.finalizarViagem(idViagem);
  }
}
