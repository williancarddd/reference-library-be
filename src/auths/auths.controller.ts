import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/create-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiResponse({ status: 201, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registro de novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário autenticado.' })
  getProfile(@Request() req) {
    return req.user;
  }
}
