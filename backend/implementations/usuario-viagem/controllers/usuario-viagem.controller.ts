// src/usuario-viagem/usuario-viagem.controller.ts
import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
import { UsuarioViagemService } from '../services/usuario-viagem.service';
import { UsuarioViagens } from '../entities/UsuarioViagens.entity';


@Controller('usuario-viagem')
export class UsuarioViagemController {
  constructor(private readonly usuarioViagemService: UsuarioViagemService) {}

  @Post()
  async associarUsuarioViagem(
    @Body('usuarioId') usuarioId: string,
    @Body('viagemId') viagemId: string,
  ): Promise<UsuarioViagens> {
    return this.usuarioViagemService.associarUsuarioViagem(usuarioId, viagemId);
  }

  @Get()
  async listarAssociacoes(): Promise<UsuarioViagens[]> {
    return this.usuarioViagemService.listarAssociacoes();
  }

  @Delete(':id')
  async removerAssociacao(@Param('id') id: string): Promise<void> {
    return this.usuarioViagemService.removerAssociacao(id);
  }
}
