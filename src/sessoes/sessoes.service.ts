import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessoesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const idFilme = Number(data.filmeId);
    const idSala = Number(data.salaId);
    const preco = Number(data.valorIngresso ?? 20);
    const novaInicio = new Date(data.horario);

    if (isNaN(idFilme) || isNaN(idSala)) {
      throw new BadRequestException('ID do filme ou ID da sala inválidos.');
    }

    // 1. Valida se o Filme existe
    const filme = await this.prisma.filme.findUnique({
      where: { id: idFilme },
    });

    if (!filme) {
      throw new NotFoundException('Filme não encontrado');
    }

    const sala = await this.prisma.sala.findUnique({
      where: { id: idSala },
    });

    if (!sala) {
      throw new NotFoundException(`A sala com o ID ${idSala} não existe no banco de dados. Verifique a lista de salas disponíveis.`);
    }

    const novaFim = new Date(novaInicio.getTime() + filme.duracao * 60000);

    const sessoes = await this.prisma.sessao.findMany({
      where: { salaId: idSala },
      include: { filme: true },
    });

    for (const sessao of sessoes) {
      const inicio = new Date(sessao.horarioInicio);
      const fim = new Date(inicio.getTime() + sessao.filme.duracao * 60000);

      if (novaInicio < fim && novaFim > inicio) {
        throw new BadRequestException('Conflito de horário na sala');
      }
    }

    // 4. Criação segura
    return this.prisma.sessao.create({
      data: {
        filmeId: idFilme,
        salaId: idSala,
        horarioInicio: novaInicio,
        valorIngresso: preco
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
      valorIngresso: s.valorIngresso ? Number(s.valorIngresso) : 20.00,
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
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID da sessão inválido ou ausente.');
    }

    const prismaUpdateData: any = {};

    // 1. Trata Horário
    if (data.horarioInicio) {
      const dataValida = new Date(data.horarioInicio);
      if (isNaN(dataValida.getTime())) {
        throw new BadRequestException('Formato de data/horário inválido.');
      }
      prismaUpdateData.horarioInicio = dataValida;
    }

    // 2. Trata Preço do Ingresso (Adicionado 👇)
    if (data.valorIngresso !== undefined && !isNaN(Number(data.valorIngresso))) {
      prismaUpdateData.valorIngresso = Number(data.valorIngresso);
    }

    // 3. Trata Relacionamento com Filme
    if (data.filmeId && !isNaN(Number(data.filmeId))) {
      prismaUpdateData.filme = {
        connect: { id: Number(data.filmeId) },
      };
    }

    // 4. Trata Relacionamento com Sala
    if (data.salaId && !isNaN(Number(data.salaId))) {
      prismaUpdateData.sala = {
        connect: { id: Number(data.salaId) },
      };
    }

    // 🚨 DEBUG: Coloque esse console.log aqui para inspecionar se os dados estão chegando no service!
    console.log("=== DADOS ENVIADOS AO PRISMA NO UPDATE ===", prismaUpdateData);

    return this.prisma.sessao.update({
      where: { id },
      data: prismaUpdateData,
    });
  }

  async remove(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID da sessão inválido para remoção.');
    }

    return this.prisma.sessao.delete({
      where: { id },
    });
  } 
}