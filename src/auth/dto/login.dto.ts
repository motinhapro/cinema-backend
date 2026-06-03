import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'joao@email.com', description: 'Email cadastrado' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456', description: 'Senha do usuário' })
  @IsString()
  senha!: string;
}