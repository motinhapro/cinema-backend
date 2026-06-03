import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const ingressosIds = createPedidoDto.ingressosIds.map(id => Number(id));
    const lanchesIds = createPedidoDto.lanchesIds.map(id => Number(id));

    // 1. Busca os dados para calcular o valor consolidado real
    const ingressos = await this.prisma.ingresso.findMany({
      where: { id: { in: ingressosIds } },
    });

    const lanches = await this.prisma.lancheCombo.findMany({
      where: { id: { in: lanchesIds } },
    });

    const totalIngressos = ingressos.reduce((sum, ing) => sum + ing.valorPago, 0);
    const totalLanches = lanches.reduce((sum, lan) => sum + lan.preco, 0);
    const valorTotalCalculado = totalIngressos + totalLanches;

    // 2. Primeiro, cria o Pedido básico no banco para gerar o ID dele
    const novoPedido = await this.prisma.pedido.create({
      data: {
        valorTotal: valorTotalCalculado,
        // Faz a conexão N-N dos lanches usando a sintaxe nativa do Prisma
        lanches: {
          connect: lanchesIds.map(id => ({ id })),
        },
      },
    });

    // 3. CRUCIAL: Como o ingresso é 1-N, precisamos dar um update neles 
    // injetando o ID do pedido que acabou de ser gerado acima!
    if (ingressosIds.length > 0) {
      await this.prisma.ingresso.updateMany({
        where: { id: { in: ingressosIds } },
        data: {
          pedidoId: novoPedido.id, // Seta a Chave Estrangeira no SQLite
        },
      });
    }

    // 4. Retorna o pedido completo com o include populado de verdade
    return (this.prisma.pedido as any).findUnique({
      where: { id: novoPedido.id },
      include: {
        ingressos: true,
        lanches: true,
      },
    });
  }

  async findAll() {
    // Faz o join profundo: Pedido -> Ingressos -> Sessão -> Filme
    return (this.prisma.pedido as any).findMany({
      include: {
        lanches: true,
        ingressos: {
          include: {
            sessao: {
              include: {
                filme: true, // 👈 Puxa os dados do filme (como título)
              },
            },
          },
        },
      },
      orderBy: {
        dataHora: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const pedido = await (this.prisma.pedido as any).findUnique({
      where: { id },
      include: {
        ingressos: true,
        lanches: true,
      },
    });
    if (!pedido) throw new NotFoundException(`Pedido #${id} não encontrado`);
    return pedido;
  }

  async update(id: number, updatePedidoDto: any) {
    return this.prisma.pedido.update({
      where: { id },
      data: updatePedidoDto,
    });
  }

  async remove(id: number) {
    return this.prisma.pedido.delete({
      where: { id },
    });
  }
}