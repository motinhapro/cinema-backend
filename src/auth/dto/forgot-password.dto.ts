import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'joao@email.com', description: 'Email do usuário para recuperação de senha' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}