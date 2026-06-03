import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmeDto {
  @ApiProperty({ example: 'Interestelar', description: 'Título do filme' })
  @IsString()
  titulo!: string;

  @ApiProperty({ example: 'Uma equipe de exploradores viaja através de um buraco de minhoca...', description: 'Sinopse do filme' })
  @IsString()
  sinopse!: string;

  @ApiProperty({ example: '10', description: 'Classificação etária (L, 10, 12, 14, 16, 18)' })
  @IsString()
  classificacao!: string;

  @ApiProperty({ example: 169, description: 'Duração em minutos' })
  @IsNumber()
  duracao!: number;

  @ApiProperty({ example: 'Ficção Científica', description: 'Nome do gênero (Ação, Comédia, Drama, Romance, Documentário, Suspense, Terror, Ficção Científica)' })
  @IsString()
  genero!: string;

  @ApiProperty({ example: '2026-06-01', description: 'Data de início da exibição (YYYY-MM-DD)' })
  @IsString()
  dataInicioExibicao!: string;

  @ApiProperty({ example: '2026-07-01', description: 'Data final da exibição (YYYY-MM-DD)' })
  @IsString()
  dataFinalExibicao!: string;
}