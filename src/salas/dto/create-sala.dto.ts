import { IsInt, Min } from 'class-validator';

export class CreateSalaDto {
  @IsInt()
  numero: number;

  @IsInt()
  @Min(1)
  capacidade: number;
}