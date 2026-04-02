import { IsString, IsInt, Min } from 'class-validator';

export class CreateFilmeDto {
  @IsString()
  titulo: string;

  @IsInt()
  @Min(1)
  duracao: number;

  @IsString()
  classificacaoEtaria: string;

  @IsInt()
  generoId: number;
}