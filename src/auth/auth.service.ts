import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email já cadastrado');
    }

    const hashedSenha = await bcrypt.hash(dto.senha, 10);

    const user = await this.prisma.user.create({
      data: {
        nome: dto.nome,
        email: dto.email,
        senha: hashedSenha,
        telefone: dto.telefone,
      },
    });

    const token = this.generateToken(user.id, user.email);

    return {
      user: { id: user.id, nome: user.nome, email: user.email, telefone: user.telefone },
      token,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const senhaValida = await bcrypt.compare(dto.senha, user.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      user: { id: user.id, nome: user.nome, email: user.email, telefone: user.telefone },
      token,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Email não encontrado');
    }

    // Em produção, enviaria email com link de recuperação
    // Aqui geramos um token de reset como demonstração
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'reset' },
      { expiresIn: '15m' },
    );

    return {
      message: 'Se o email existir, um link de recuperação será enviado.',
      resetToken, // Em produção, não retornar o token - apenas simulação
    };
  }

  private generateToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}