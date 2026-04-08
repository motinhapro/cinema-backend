import { PartialType } from '@nestjs/swagger';
import { CreateFilmeDto } from './create-filme.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateFilmeDto extends PartialType(CreateFilmeDto) {
    @IsOptional()
    @IsNumber()
    generoId?: number;
}
