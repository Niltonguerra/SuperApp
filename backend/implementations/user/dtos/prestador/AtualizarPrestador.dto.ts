import { IsArray, IsDate, IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { IsTelefone } from '../../decorator/telefoneBrasil.decorator';
import { ContainsUppercase } from '../../decorator/upperCase.decorator';
import { ContainsLowercase } from '../../decorator/lowerCase.decorator';
import { ContainsNumber } from '../../decorator/number.decorator';
import { IsDateFormat } from '../../decorator/date.decorator';
import { IsCPF } from '../../decorator/isCPF.decorator';
import { IsCnh } from '../../decorator/isCNH.decorator';
import { IsRg } from '../../decorator/isRg.decorator';
import {IsDpvat} from '../../decorator/isDpvat.decorator';
import { IsCrlv } from '../../decorator/isCrlv.decorator';

export class AtualizaPrestadorDTO {

  @IsOptional()
  @IsString({ message: 'A CNH deve ser uma string'})
  @IsCnh({ message: 'Por favor, forneça uma CNH válida com 11 dígitos.' })
  CNH: string;

  @IsOptional()
  @IsString({ message: 'O RG deve ser uma string'})
  @IsRg({ message: 'Por favor, forneça um RG válido no formato 00.000.000-X.' })
  RG: string;

  @IsOptional()
  @IsString({ message: 'O DPVAT deve ser uma string'})
  @IsDpvat({ message: 'O número do DPVAT deve ter 11 dígitos.' })
  DPVAT: string;

  @IsOptional()
  @IsString({ message: 'A foto da CNH deve ser uma string'})
  foto_CNH: string;

  @IsOptional()
  @IsString({ message: 'O CRLV deve ser uma string'})
  @IsCrlv({ message: 'O número do CRLV deve ter 11 dígitos.' })
  CRLV: string;
}
