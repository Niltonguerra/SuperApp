import { 
  Controller, 
  Body, 
  Patch,
  Request,
  Delete,
  UseGuards 
} from '@nestjs/common';
import { VeiculoService } from '../services/veiculo.service';
import { CriarVeiculoDto } from '../dtos/veiculo/criaVeiculo.dto';
import { MensagemRetornoDTO } from '../dtos/Mensagens.dto';
import { JwtAuthGuardUser } from '../Guards/jwtAuthUser.guard';
import { RolesGuardUser } from '../Guards/rolesUser.guard';

@Controller('veiculos')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Patch()
  async atualizarCarro(@Request() req, @Body() carroData: CriarVeiculoDto): Promise<MensagemRetornoDTO> {
    return this.veiculoService.updateCarro(req.user.userId, carroData);
  }


  @UseGuards(JwtAuthGuardUser, RolesGuardUser)
  @Delete()
  async deletarCarro(@Request() req): Promise<MensagemRetornoDTO> {
    return this.veiculoService.deletarCarro(req.user.userId);
  }
}
