import { Injectable } from '@nestjs/common';
import { CreateLancheComboDto } from './dto/create-lanche-combo.dto';
import { UpdateLancheComboDto } from './dto/update-lanche-combo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LancheComboService {

  constructor(private prisma: PrismaService) {}

  async create(data) {
    return this.prisma.lancheCombo.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        preco: Number(data.valorUnitario),
      },
    });
  }

  async findAll() {
    const lanches = await this.prisma.lancheCombo.findMany();

    return lanches.map(l => ({
      id: String(l.id),
      nome: l.nome,
      descricao: l.descricao,
      valorUnitario: l.preco,
    }));
  }

  findOne(id: number) {
    return this.prisma.lancheCombo.findUnique({ where: { id } });
  }

  async update(id: number, data: any) {
    return this.prisma.lancheCombo.update({
      where: { id },
      data: {
        nome: data.nome,
        preco: Number(data.valorUnitario),
      },
    });
  }

  async remove(id: number) {
    return this.prisma.lancheCombo.delete({
      where: { id },
    });
  }
}
