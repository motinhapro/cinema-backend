import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SessoesService } from './sessoes.service';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Sessões')
@Controller('sessoes')
export class SessoesController {
  constructor(private readonly sessoesService: SessoesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar sessão', description: 'Adiciona uma nova sessão para um filme em uma sala' })
  create(@Body() createSessoeDto: CreateSessaoDto) {
    return this.sessoesService.create(createSessoeDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar sessões', description: 'Retorna todas as sessões disponíveis' })
  findAll() {
    return this.sessoesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar sessão por ID', description: 'Retorna os detalhes de uma sessão' })
  findOne(@Param('id') id: string) {
    return this.sessoesService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar sessão', description: 'Atualiza os dados de uma sessão' })
  update(@Param('id') id: string, @Body() updateSessoeDto: UpdateSessaoDto) {
    return this.sessoesService.update(+id, updateSessoeDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar sessão', description: 'Remove uma sessão' })
  remove(@Param('id') id: string) {
    return this.sessoesService.remove(+id);
  }
}