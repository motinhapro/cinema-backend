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

    return this.prisma.ingresso.create({ data });
  }

  findAll() {
    return this.prisma.ingresso.findMany({
      include: { sessao: true },
    });
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

  remove(id: number) {
    return this.prisma.ingresso.delete({
      where: { id },
    });
  }
}
