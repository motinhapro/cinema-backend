import { Controller, Get, Patch, Delete, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Usuários')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Meu perfil', description: 'Retorna os dados do usuário logado' })
  getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualizar perfil', description: 'Atualiza nome, telefone e/ou senha do usuário logado' })
  updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.id, dto);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Deletar conta', description: 'Remove permanentemente a conta do usuário logado' })
  deleteProfile(@Req() req: any) {
    return this.usersService.remove(req.user.id);
  }
}