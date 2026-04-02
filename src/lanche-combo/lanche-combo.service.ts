import { Injectable } from '@nestjs/common';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LancheComboService {

  constructor(private prisma: PrismaService) {}

  create(data) {
    return this.prisma.lancheCombo.create({ data });
  }

  findAll() {
    return this.prisma.lancheCombo.findMany();
  }

  findOne(id: number) {
    return this.prisma.lancheCombo.findUnique({ where: { id } });
  }

  update(id: number, data) {
    return this.prisma.lancheCombo.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.lancheCombo.delete({
      where: { id },
    });
  }
}
