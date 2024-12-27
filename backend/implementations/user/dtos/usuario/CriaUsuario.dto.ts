import { IsArray, IsDate, isDate, IsEmail, IsNotEmpty, IsNumber, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { IsTelefone } from '../../decorator/telefoneBrasil.decorator';
import { ContainsUppercase } from '../../decorator/upperCase.decorator';
import { ContainsLowercase } from '../../decorator/lowerCase.decorator';
import { ContainsNumber } from '../../decorator/number.decorator';
import { IsCPF } from '../../decorator/isCPF.decorator';
import { IsDateFormat } from '../../decorator/date.decorator';




export class CriaUsuarioDTO {

  @IsNotEmpty({ message: 'O CPF não pode ser vazio' })
  @IsString({ message: 'o CPF deve ser uma string'})
  @IsCPF({ message: 'CPF inválido' })
  CPF: string;

  @IsNotEmpty({ message: 'A data de nascimento não pode ser vazio' })
  @IsDateFormat()
  data_nascimento: Date;

  @IsUrl({}, { message: 'A foto deve ser uma URL válida' })
  foto: string;

  @IsNotEmpty({ message: 'O endereço não pode ser vazio' })
  @IsString({ message: 'o Endereço deve ser uma string'})
  endereco: string[];

  @MaxLength(40, { message: 'seu nome é muito grande, deve ter no máximo 70 caracteres' })
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  nome: string;

  @IsEmail({}, { message: 'O email informado é inválido' })
  @IsNotEmpty({ message: 'O email não pode ser vazio' })
  email: string;

  @ContainsLowercase(2,{ message: 'A senha deve ter 2 letras minúsculas no mínimo'})
  @ContainsUppercase(2,{ message: 'A senha deve ter 2 letras maiúsculas no mínimo'})
  @IsString({ message: 'A senha deve ser uma string'})
  @MinLength(8, { message: 'A senha precisa ter pelo menos 8 caracteres'})
  @MaxLength(16, { message: 'A senha precisa ter no máximo 16 caracteres'})
  @IsNotEmpty({ message: 'A senha não pode ser vazio' })
  @ContainsNumber(2, { message: 'A senha precisa ter pelo menos 2 números'})
  senha: string;

  @IsTelefone({ message: 'O telefone informado é inválido' })
  @IsNotEmpty({ message: 'O telefone não pode ser vazio' })
  telefone: string;

}


