import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FilmesService } from './filmes.service';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Filmes')
@Controller('filmes')
export class FilmesController {
  constructor(private readonly filmesService: FilmesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar filme', description: 'Adiciona um novo filme ao catálogo' })
  create(@Body() createFilmeDto: CreateFilmeDto) {
    return this.filmesService.create(createFilmeDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar filmes', description: 'Retorna todos os filmes em cartaz' })
  findAll() {
    return this.filmesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar filme por ID', description: 'Retorna os detalhes de um filme específico' })
  findOne(@Param('id', ParseIntPipe) id: number) { 
    return this.filmesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar filme', description: 'Atualiza os dados de um filme' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateFilmeDto) {
    return this.filmesService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar filme', description: 'Remove um filme do catálogo' })
  remove(@Param('id') id: string) {
    return this.filmesService.remove(+id);
  }
}