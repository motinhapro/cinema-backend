import { Injectable } from '@nestjs/common';
import { CreateSalaDto } from './dto/create-sala.dto';
import { UpdateSalaDto } from './dto/update-sala.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SalasService {

  constructor(private prisma: PrismaService) {}

  create(data) {
  return this.prisma.sala.create({ data });
  }

  async findAll() {
    const salas = await this.prisma.sala.findMany();

    return salas.map(s => ({
      id: String(s.id),
      numero: s.numero,
      capacidade: s.capacidade,
    }));
  }

  findOne(id: number) {
    return this.prisma.sala.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.sala.update({
      where: { id },
      data: {
        ...(data.numero && { numero: data.numero }),
        ...(data.capacidade && { capacidade: data.capacidade }),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.sala.delete({
      where: { id },
    });
  }
}
