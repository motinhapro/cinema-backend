import { Injectable } from '@nestjs/common';
import { CreateSessaoDto } from './dto/create-sessao.dto';
import { UpdateSessaoDto } from './dto/update-sessao.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessoesService {

  constructor(private prisma: PrismaService) {}

  async create(data) {
    const sessoes = await this.prisma.sessao.findMany({
      where: { salaId: data.salaId },
      include: { filme: true },
    });

    const novaInicio = new Date(data.horarioInicio);

    const filme = await this.prisma.filme.findUnique({
      where: { id: data.filmeId },
    });
    
    if(!filme) {
      throw new Error('Filme não encontrado.')
    }

    const novaFim = new Date(
      novaInicio.getTime() + filme.duracao * 60000
    );

    for (const sessao of sessoes) {
      const inicio = new Date(sessao.horarioInicio);
      const fim = new Date(
        inicio.getTime() + sessao.filme.duracao * 60000
      );

      if (novaInicio < fim && novaFim > inicio) {
        throw new Error('Conflito de horário na sala');
      }
    }

    return this.prisma.sessao.create({ data });
  }

  findAll() {
    return this.prisma.sessao.findMany({
      include: {
        filme: true,
        sala: true,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.sessao.findUnique({
      where: { id },
      include: {
        filme: true,
        sala: true,
      },
    });
  }

  update(id: number, data) {
    return this.prisma.sessao.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.sessao.delete({
      where: { id },
    });
  }
}
