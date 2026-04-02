import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGeneroDto {
  @IsString()
  @IsNotEmpty()
  nome: string;
}