import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerosModule } from './generos/generos.module';
import { FilmesModule } from './filmes/filmes.module';
import { SalasModule } from './salas/salas.module';
import { SessoesModule } from './sessoes/sessoes.module';
import { IngressosModule } from './ingressos/ingressos.module';
import { LancheComboModule } from './lanche-combo/lanche-combo.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [GenerosModule, FilmesModule, SalasModule, SessoesModule, IngressosModule, LancheComboModule, PedidosModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
