import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSessaoDto {
  @ApiProperty({ example: 1, description: 'ID do filme' })
  @Type(() => Number)
  @IsNumber()
  filmeId!: number;

  @ApiProperty({ example: 1, description: 'ID da sala' })
  @Type(() => Number)
  @IsNumber()
  salaId!: number;

  @ApiProperty({ example: '2026-06-01T19:00:00.000Z', description: 'Horário da sessão' })
  @IsString()
  horario!: string;

  @ApiProperty({ example: 24.90, description: 'Valor do ingresso (opcional)', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  valorIngresso?: number;
}