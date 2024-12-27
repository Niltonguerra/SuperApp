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
  @IsString({ message: 'o CPF deve ser uma string'})
  @IsCPF({ message: 'CPF inválido' })
  CPF: string;

  @IsOptional()
  @IsDateFormat()
  data_nascimento: Date;

  @IsOptional()
  @IsUrl({}, { message: 'A foto deve ser uma URL válida' })
  foto: string;

  @IsOptional()
  @IsArray({ message: 'O endereço deve ser uma lista de strings' })
  @IsString({ each: true, message: 'Cada item do endereço deve ser uma string' })
  endereco: string[];

  @IsOptional()
  @MaxLength(40, { message: 'Seu nome é muito grande, deve ter no máximo 70 caracteres' })
  @IsString({ message: 'O nome deve ser uma string' })
  nome: string;

  @IsOptional()
  @IsEmail({}, { message: 'O email informado é inválido' })
  email: string;

  @IsOptional()
  @ContainsLowercase(2,{ message: 'A senha deve ter 2 letras minúsculas no mínimo'})
  @ContainsUppercase(2,{ message: 'A senha deve ter 2 letras maiúsculas no mínimo'})
  @IsString({ message: 'A senha deve ser uma string'})
  @MinLength(8, { message: 'A senha precisa ter pelo menos 8 caracteres'})
  @MaxLength(16, { message: 'A senha precisa ter no máximo 16 caracteres'})
  @ContainsNumber(2, { message: 'A senha precisa ter pelo menos 2 números'})
  senha: string;

  @IsOptional()
  @IsTelefone({ message: 'O telefone informado é inválido' })
  telefone: string;

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
