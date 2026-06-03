import { IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLancheComboDto {
  @ApiProperty({ example: 'Combo Pipoca Grande + Refrigerante', description: 'Nome do combo de lanche' })
  @IsString()
  nome!: string;

  @ApiProperty({ example: 'Pipoca grande + Refrigerante 500ml', description: 'Descrição do combo' })
  @IsString()
  descricao!: string;

  @ApiProperty({ example: 25.90, description: 'Valor unitário do combo' })
  @IsNumber()
  valorUnitario!: number;
}
