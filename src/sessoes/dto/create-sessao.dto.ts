import { IsInt, IsDateString, IsNumber } from 'class-validator';

export class CreateSessaoDto {
  @IsInt()
  filmeId: number;

  @IsInt()
  salaId: number;

  @IsDateString()
  horarioInicio: string;

  @IsNumber()
  valorIngresso: number;
}