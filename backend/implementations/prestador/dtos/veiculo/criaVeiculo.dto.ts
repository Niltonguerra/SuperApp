import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { IsPlaca } from '../../decorator/isPlaca.decorator';

export class CriarVeiculoDto {

  @IsNotEmpty()
  @IsString()
  @IsPlaca({ message: 'A placa deve seguir o formato correto (ex: ABC1D23)' })
  placa: string;

  @IsNotEmpty()
  @IsString()
  modelo: string;

  @IsNotEmpty()
  @IsString()
  cor: string;

  @IsNotEmpty()
  @IsNumber()
  ano: number;

  @IsOptional()
  @IsString()
  foto?: string;
}
