import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIngressoDto {
  @ApiProperty({ example: 1, description: 'ID da sessão' })
  @Type(() => Number)
  @IsNumber()
  sessaoId!: number;

  @ApiProperty({ example: 'Inteira', description: 'Tipo do ingresso (Inteira, Meia, VIP)' })
  @IsString()
  tipo!: string;

  @ApiProperty({ example: 24.90, description: 'Valor pago pelo ingresso' })
  @Type(() => Number)
  @IsNumber()
  valor!: number;

  @ApiProperty({ example: 'A5', description: 'Assento escolhido (ex: A1, B3, G10)' })
  @IsString()
  assento!: string;
}