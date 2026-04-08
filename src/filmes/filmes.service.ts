import { Injectable } from '@nestjs/common';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilmesService {

  constructor(private prisma: PrismaService) {}

  generoMap = {
    "Ação": 1,
    "Comédia": 2,
    "Drama": 3,
    "Romance": 4,
    "Documentário": 5,
    "Suspense": 6,
    "Terror": 7,
    "Ficção Científica": 8
  };

  async create(data: any) {
    return this.prisma.filme.create({
      data: {
        titulo: data.titulo,
        sinopse: data.sinopse,
        classificacaoEtaria: data.classificacao,
        duracao: data.duracao,
        generoId: this.generoMap[data.genero], 
        dataInicioExibicao: new Date(data.dataInicioExibicao),
        dataFinalExibicao: new Date(data.dataFinalExibicao),
      },
    });
  }

  async findAll() {
  const filmes = await this.prisma.filme.findMany({
    include: { genero: true },
  });

  return filmes.map(f => ({
    id: String(f.id),
    titulo: f.titulo,
    sinopse: f.sinopse,
    classificacao: f.classificacaoEtaria,
    duracao: f.duracao,
    genero: f.genero?.nome,
    dataInicioExibicao: f.dataInicioExibicao?.toISOString(),
    dataFinalExibicao: f.dataFinalExibicao?.toISOString(),
  }));
}

  findOne(id: number) {
    return this.prisma.filme.findUnique({
      where: { id },
      include: { genero: true },
    });
  }

  async update(id: number, data: UpdateFilmeDto) {
    return this.prisma.filme.update({
      where: { id },
      data: {
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.duracao && { duracao: data.duracao }),

        ...(data.generoId && {
          genero: {
            connect: { id: data.generoId },
          },
        }),
      },
    });
  }

  async remove(id: number) {
    await this.prisma.sessao.deleteMany({
      where: { filmeId: id },
    });

    return this.prisma.filme.delete({
      where: { id },
    });  
  }
}
