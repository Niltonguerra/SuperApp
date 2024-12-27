import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CriarPagamentoDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  idempotencyKey: string;
}