import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'João Silva Atualizado', description: 'Novo nome', required: false })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiProperty({ example: '11988888888', description: 'Novo telefone', required: false })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ example: '654321', description: 'Nova senha (mínimo 6 caracteres)', required: false })
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;
}