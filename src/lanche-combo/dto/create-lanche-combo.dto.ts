import { IsString, IsNumber } from 'class-validator';

export class CreateLancheComboDto {
  @IsString()
  nome: string;

  @IsString()
  descricao: string;

  @IsNumber()
  preco: number;
}