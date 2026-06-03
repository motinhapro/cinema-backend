import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSessaoDto {
  @IsOptional()
  @IsString()
  horarioInicio?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salaId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  filmeId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  valorIngresso?: number; 
}