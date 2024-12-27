import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VeiculoService } from '../services/veiculo.service';
import { CriarVeiculoDto } from '../dtos/veiculo/criaVeiculo.dto';

@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}


  @Patch(':prestadorId')
  async updateCarro(
    @Param('prestadorId') prestadorId: string,
    @Body() carroData: CriarVeiculoDto
  ) {

    return this.veiculoService.updateCarro(prestadorId, carroData);
  }

}
