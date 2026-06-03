import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LancheComboService } from './lanche-combo.service';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Lanche-Combo')
@Controller('lanche-combo')
export class LancheComboController {
  constructor(private readonly lancheComboService: LancheComboService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar combo', description: 'Adiciona um novo combo de lanche' })
  create(@Body() createLancheComboDto: CreateLancheComboDto) {
    return this.lancheComboService.create(createLancheComboDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.lancheComboService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lancheComboService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar combo', description: 'Atualiza os dados de um combo' })
  update(@Param('id') id: string, @Body() updateLancheComboDto: UpdateLancheComboDto) {
    return this.lancheComboService.update(+id, updateLancheComboDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar combo', description: 'Remove um combo' })
  remove(@Param('id') id: string) {
    return this.lancheComboService.remove(+id);
  }
}