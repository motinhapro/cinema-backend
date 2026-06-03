import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'cinema-secret-key-dev',
    });
  }

  async validate(payload: { sub: number; email: string }) {
    console.log('[JwtStrategy] Validando token com payload:', payload);
    
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      console.log('[JwtStrategy] Usuário não encontrado para ID:', payload.sub);
      throw new UnauthorizedException('Usuário não encontrado');
    }

    console.log('[JwtStrategy] Usuário validado:', { id: user.id, email: user.email });
    return { id: user.id, email: user.email, nome: user.nome };
  }
}