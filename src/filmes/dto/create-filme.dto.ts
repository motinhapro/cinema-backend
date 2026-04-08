import { IsString, IsNumber } from 'class-validator';

export class CreateFilmeDto {
  @IsString()
  titulo!: string;

  @IsString()
  sinopse!: string;

  @IsString()
  classificacao!: string;

  @IsNumber()
  duracao!: number;

  @IsString()
  genero!: string;

  @IsString()
  dataInicioExibicao!: string;

  @IsString()
  dataFinalExibicao!: string;
}