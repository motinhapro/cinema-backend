import { Injectable } from '@nestjs/common';
import { CreateGeneroDto } from './dto/create-genero.dto';
import { UpdateGeneroDto } from './dto/update-genero.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GenerosService {

  constructor(private prisma: PrismaService) {}
  
  async create(data) {
  return this.prisma.genero.create({ data });
  }

  findAll() {
    return this.prisma.genero.findMany();
  }

  findOne(id: number) {
    return this.prisma.genero.findUnique({ where: { id } });
  }

  update(id: number, data) {
    return this.prisma.genero.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.genero.delete({ where: { id } });
  }
}
