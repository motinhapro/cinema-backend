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

  findAll() {
    return this.prisma.sala.findMany();
  }

  findOne(id: number) {
    return this.prisma.sala.findUnique({ where: { id } });
  }

  update(id: number, data) {
    return this.prisma.sala.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.sala.delete({
      where: { id },
    });
  }
}
