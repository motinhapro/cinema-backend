import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CreateIngressoDto {
  @Type(() => Number)
  @IsNumber()
  sessaoId!: number;

  @IsString()
  tipo!: string;

  @Type(() => Number)
  @IsNumber()
  valor!: number;

  @IsString()
  assento!: string;
}