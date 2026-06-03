import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do usuário' })
  @IsString()
  @IsNotEmpty()
  nome!: string;

  @ApiProperty({ example: 'joao@email.com', description: 'Email para login' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456', description: 'Senha (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6)
  senha!: string;

  @ApiProperty({ example: '11999999999', description: 'Telefone para contato' })
  @IsString()
  @IsNotEmpty()
  telefone!: string;
}