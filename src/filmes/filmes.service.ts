import { Injectable } from '@nestjs/common';
import { CreateFilmeDto } from './dto/create-filme.dto';
import { UpdateFilmeDto } from './dto/update-filme.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilmesService {

  constructor(private prisma: PrismaService) {}

  async create(data) {
  return this.prisma.filme.create({
    data,
    });
  }

  findAll() {
    return this.prisma.filme.findMany({
      include: { genero: true },
    });
  }

  findOne(id: number) {
    return this.prisma.filme.findUnique({
      where: { id },
      include: { genero: true },
    });
  }

  update(id: number, data) {
    return this.prisma.filme.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.filme.delete({
      where: { id },
    });
  }
}
