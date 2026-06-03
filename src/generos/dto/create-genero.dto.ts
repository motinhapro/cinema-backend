import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGeneroDto {
  @ApiProperty({ example: 'Ação', description: 'Nome do gênero' })
  @IsString()
  @IsNotEmpty()
  nome!: string;
}