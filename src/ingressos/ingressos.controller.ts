import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { IngressosService } from './ingressos.service';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Ingressos')
@Controller('ingressos')
export class IngressosController {
  constructor(private readonly ingressosService: IngressosService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comprar ingresso', description: 'Cria um novo ingresso para uma sessão' })
  create(@Body() createIngressoDto: CreateIngressoDto) {
    return this.ingressosService.create(createIngressoDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar ingressos', description: 'Retorna todos os ingressos (pode filtrar por sessão)' })
  @ApiQuery({ name: 'sessaoId', required: false, example: 1, description: 'Filtrar por ID da sessão' })
  findAll(@Query('sessaoId') sessaoId?: string) {
    return this.ingressosService.findAll(sessaoId ? Number(sessaoId) : undefined);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar ingresso por ID', description: 'Retorna os detalhes de um ingresso' })
  findOne(@Param('id') id: string) {
    return this.ingressosService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar ingresso', description: 'Atualiza os dados de um ingresso' })
  update(@Param('id') id: string, @Body() updateIngressoDto: UpdateIngressoDto) {
    return this.ingressosService.update(+id, updateIngressoDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar ingresso', description: 'Remove/cancela um ingresso' })
  remove(@Param('id') id: string) {
    return this.ingressosService.remove(+id);
  }
}