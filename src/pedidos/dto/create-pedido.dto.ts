import { IsArray, IsOptional } from 'class-validator';

export class CreatePedidoDto {
  @IsOptional()
  @IsArray()
  ingressosIds?: number[];

  @IsOptional()
  @IsArray()
  lanchesIds?: number[];
}