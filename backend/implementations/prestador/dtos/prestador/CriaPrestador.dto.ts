import {IsNotEmpty,IsString} from 'class-validator';

import {IsRg} from '../../decorator/isRg.decorator';
import {IsCnh} from '../../decorator/isCNH.decorator';
import {IsDpvat} from '../../decorator/isDpvat.decorator';
import { IsCrlv } from '../../decorator/isCrlv.decorator';

export class CriaPrestadorDTO {

  @IsNotEmpty({ message: 'A CNH não pode ser vazio' })
  @IsString({ message: 'a CNH deve ser uma string'})
  @IsCnh({ message: 'Por favor, forneça uma CNH válida com 11 dígitos.' })
  CNH: string;

  @IsNotEmpty({ message: 'O RG não pode ser vazio' })
  @IsString({ message: 'o RG deve ser uma string'})
  @IsRg({ message: 'Por favor, forneça um RG válido no formato 00.000.000-X.' })
  RG: string;

  @IsNotEmpty({ message: 'O DPVAT não pode ser vazio' })
  @IsString({ message: 'o DPVAT deve ser uma string'})
  @IsDpvat({ message: 'O número do DPVAT deve ter 11 dígitos.' })
  DPVAT: string;

  @IsNotEmpty({ message: 'A foto da CNH não pode ser vazio' })
  @IsString({ message: 'a foto da CNH deve ser uma string'})
  foto_CNH: string;

  @IsNotEmpty({ message: 'O CRLV não pode ser vazio' })
  @IsString({ message: 'o CRLV deve ser uma string'})
  @IsCrlv({ message: 'O número do CRLV deve ter 11 dígitos.' })
  CRLV: string;
}


