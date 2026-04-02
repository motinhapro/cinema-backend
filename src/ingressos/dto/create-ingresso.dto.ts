import { IsInt, IsString, IsNumber } from 'class-validator';

export class CreateIngressoDto {
  @IsInt()
  sessaoId: number;

  @IsString()
  tipo: string;

  @IsNumber()
  valorPago: number;
}