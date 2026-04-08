import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessoesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const novaInicio = new Date(data.horario);

    const filme = await this.prisma.filme.findUnique({
      where: { id: Number(data.filmeId) },
    });

    if (!filme) {
      throw new NotFoundException('Filme não encontrado');
    }

    const novaFim = new Date(
      novaInicio.getTime() + filme.duracao * 60000,
    );

    // 🔥 buscar sessões da mesma sala
    const sessoes = await this.prisma.sessao.findMany({
      where: {
        salaId: Number(data.salaId),
      },
      include: {
        filme: true,
      },
    });

    for (const sessao of sessoes) {
      const inicio = new Date(sessao.horarioInicio);
      const fim = new Date(
        inicio.getTime() + sessao.filme.duracao * 60000,
      );

      if (novaInicio < fim && novaFim > inicio) {
        throw new BadRequestException('Conflito de horário na sala');
      }
    }

    return this.prisma.sessao.create({
      data: {
        filmeId: Number(data.filmeId),
        salaId: Number(data.salaId),
        horarioInicio: novaInicio,
        valorIngresso: data.valorIngresso ?? 20
      },
    });
  }

  async findAll() {
    const sessoes = await this.prisma.sessao.findMany({
      include: {
        filme: true, // 🔥 ESSENCIAL
        sala: true,  // 🔥 ESSENCIAL
      },
    });

    return sessoes.map(s => ({
      id: String(s.id),
      filmeId: String(s.filmeId),
      salaId: String(s.salaId),
      horario: s.horarioInicio.toISOString(),
      filme: s.filme, // 🔥
      sala: s.sala,   // 🔥
    }));
  }

  async findOne(id: number) {
    const sessao = await this.prisma.sessao.findUnique({
      where: { id },
      include: {
        filme: true, // 🔥
        sala: true,  // 🔥
      },
    });

    if (!sessao) return null;

    return {
      id: String(sessao.id),
      filmeId: String(sessao.filmeId),
      salaId: String(sessao.salaId),
      horario: sessao.horarioInicio.toISOString(),
      filme: sessao.filme, // 🔥
      sala: sessao.sala,   // 🔥
    };
  }

  async update(id: number, data: any) {
    return this.prisma.sessao.update({
      where: { id },
      data: {
        horarioInicio: data.horarioInicio,

        ...(data.filmeId && {
          filme: {
            connect: { id: data.filmeId },
          },
        }),

        ...(data.salaId && {
          sala: {
            connect: { id: data.salaId },
          },
        }),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.sessao.delete({
      where: { id },
    });
  }
}