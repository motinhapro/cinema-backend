import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePedidoDto {
  @ApiProperty({ example: [1, 2], description: 'IDs dos ingressos comprados', required: false })
  @IsOptional()
  @IsArray()
  ingressosIds?: number[];

  @ApiProperty({ example: [1, 3], description: 'IDs dos lanches/combos', required: false })
  @IsOptional()
  @IsArray()
  lanchesIds?: number[];
}