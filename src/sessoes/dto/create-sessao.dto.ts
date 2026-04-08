import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSessaoDto {
  @Type(() => Number) // 🔥 ESSENCIAL
  @IsNumber()
  filmeId!: number;

  @Type(() => Number) // 🔥
  @IsNumber()
  salaId!: number;

  @IsString()
  horario!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  valorIngresso?: number;
}