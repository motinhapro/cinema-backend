import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Pedidos')
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar pedido', description: 'Cria um novo pedido com ingressos e/ou lanches' })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.create(createPedidoDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar pedidos', description: 'Retorna todos os pedidos realizados' })
  findAll() {
    return this.pedidosService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Buscar pedido por ID', description: 'Retorna os detalhes de um pedido' })
  findOne(@Param('id') id: string) {
    return this.pedidosService.findOne(+id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar pedido', description: 'Atualiza os dados de um pedido' })
  update(@Param('id') id: string, @Body() updatePedidoDto: UpdatePedidoDto) {
    return this.pedidosService.update(+id, updatePedidoDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar pedido', description: 'Remove um pedido' })
  remove(@Param('id') id: string) {
    return this.pedidosService.remove(+id);
  }
}