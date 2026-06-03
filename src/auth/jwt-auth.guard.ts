import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const className = context.getClass().name;
    
    console.log(`[JwtAuthGuard] Verificando rota: ${className}.${handler.name}`);
    
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(`[JwtAuthGuard] isPublic: ${isPublic}`);

    if (isPublic) {
      console.log(`[JwtAuthGuard] Rota pública, permitindo acesso`);
      return true;
    }

    console.log(`[JwtAuthGuard] Rota protegida, validando token...`);
    const result = super.canActivate(context);
    console.log(`[JwtAuthGuard] Resultado da validação:`, result);
    return result;
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('[JwtAuthGuard.handleRequest] err:', err);
    console.log('[JwtAuthGuard.handleRequest] user:', user);
    console.log('[JwtAuthGuard.handleRequest] info:', info);
    
    if (err || !user) {
      console.log('[JwtAuthGuard.handleRequest] Lançando exceção!');
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }
    
    console.log('[JwtAuthGuard.handleRequest] Retornando user:', user);
    return user;
  }
}