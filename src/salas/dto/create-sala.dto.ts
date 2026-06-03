import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalaDto {
  @ApiProperty({ example: 1, description: 'Número único da sala' })
  @IsInt()
  numero!: number;

  @ApiProperty({ example: 120, description: 'Capacidade total de assentos da sala (mínimo 1)' })
  @IsInt()
  @Min(1)
  capacidade!: number;
}
