import { PartialType } from '@nestjs/mapped-types';
import { CriarVeiculoDto } from './criaVeiculo.dto';


export class UpdateVeiculoDto extends PartialType(CriarVeiculoDto) {}
