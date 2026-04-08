import { Injectable } from '@nestjs/common';
import { CreateIngressoDto } from './dto/create-ingresso.dto';
import { UpdateIngressoDto } from './dto/update-ingresso.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngressosService {

  constructor(private prisma: PrismaService) {}

  async create(data) {
    const sessao = await this.prisma.sessao.findUnique({
      where: { id: data.sessaoId },
      include: {
        sala: true,
        ingressos: true,
      },
    });

    if (!sessao) {
      throw new Error('Sessão não encontrada');
    }

    if (sessao.ingressos.length >= sessao.sala.capacidade) {
      throw new Error('Sala lotada');
    }

    return this.prisma.ingresso.create({
      data: {
        sessaoId: data.sessaoId,
        tipo: data.tipo,
        valorPago: data.valor, // 🔥 corrigido
        assento: data.assento,
      },
    });
  }

  async findAll(sessaoId?: number) {
    const ingressos = await this.prisma.ingresso.findMany({
      where: sessaoId ? { sessaoId } : {},
    });

    return ingressos.map(i => ({
      id: String(i.id),
      sessaoId: String(i.sessaoId),
      tipo: i.tipo,
      valor: i.valorPago,
      assento: i.assento,
    }));
  }

  findOne(id: number) {
    return this.prisma.ingresso.findUnique({
      where: { id },
      include: { sessao: true },
    });
  }

  update(id: number, data) {
    return this.prisma.ingresso.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const ingresso = await this.prisma.ingresso.findUnique({
      where: { id },
    });

    if (!ingresso) {
      throw new Error('Ingresso não encontrado');
    }

    return this.prisma.ingresso.delete({
      where: { id },
    });
  }
}
