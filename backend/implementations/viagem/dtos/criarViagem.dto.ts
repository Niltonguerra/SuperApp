import { Type } from 'class-transformer';
import { IsDate, IsEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class CriarViagemDto {

  @IsString()
  @IsNotEmpty()
  custo: string;
  
  @IsEmpty()
  id_usuarios?: string[];
  
  @IsString()
  @IsNotEmpty()
  origem: string;
  
  @IsString()
  @IsNotEmpty()
  destino: string;


  @IsNotEmpty()
  @Type(() => Date) // Converte string para Date
  @IsDate()
  data_hora_partida: Date;


  @IsNotEmpty()
  @Type(() => Date) // Converte string para Date
  @IsDate()
  data_hora_chegada: Date;
  
  @IsNumber()
  @IsNotEmpty()
  quantidade_de_vagas: number;
}
