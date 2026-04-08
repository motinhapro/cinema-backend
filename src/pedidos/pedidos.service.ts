import { Injectable } from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PedidosService {

  constructor(private prisma: PrismaService) {}

  async create(data) {
    let total = 0;

    if (data.ingressosIds) {
      const ingressos = await this.prisma.ingresso.findMany({
        where: { id: { in: data.ingressosIds } },
      });

      total += ingressos.reduce((acc, i) => acc + i.valorPago, 0);
    }

    if (data.lanchesIds) {
      const lanches = await this.prisma.lancheCombo.findMany({
        where: { id: { in: data.lanchesIds } },
      });

      total += lanches.reduce((acc, l) => acc + l.preco, 0);
    }

    return this.prisma.pedido.create({
      data: {
        valorTotal: total,
      },
    });
  }

  async findAll() {
    const pedidos = await this.prisma.pedido.findMany();

    return pedidos.map(p => ({
      id: String(p.id),
      dataCompra: p.dataHora.toISOString(),
      valorTotal: p.valorTotal,
      ingressosIds: [],
      itensLanche: [],
    }));
  }

  findOne(id: number) {
    return this.prisma.pedido.findUnique({
      where: { id },
    });
  }

  update(id: number, data) {
    return this.prisma.pedido.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.pedido.delete({
      where: { id },
    });
  }
}
