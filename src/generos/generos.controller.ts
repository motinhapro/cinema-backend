import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GenerosService } from './generos.service';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Gêneros')
@Controller('generos')
export class GenerosController {
  constructor(private readonly generosService: GenerosService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar gênero', description: 'Adiciona um novo gênero de filme' })
  create(@Body() createGeneroDto: CreateGeneroDto) {
    return this.generosService.create(createGeneroDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar gêneros', description: 'Retorna todos os gêneros cadastrados' })
  findAll() {
    return this.generosService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar gênero por ID', description: 'Retorna os dados de um gênero' })
  findOne(@Param('id') id: string) {
    return this.generosService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar gênero', description: 'Atualiza o nome de um gênero' })
  update(@Param('id') id: string, @Body() updateGeneroDto: UpdateGeneroDto) {
    return this.generosService.update(+id, updateGeneroDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar gênero', description: 'Remove um gênero' })
  remove(@Param('id') id: string) {
    return this.generosService.remove(+id);
  }
}