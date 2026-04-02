import { Module } from '@nestjs/common';
import { LancheComboService } from './lanche-combo.service';
import { LancheComboController } from './lanche-combo.controller';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  controllers: [LancheComboController],
  providers: [LancheComboService],
  imports: [PrismaModule],
})
export class LancheComboModule {}
