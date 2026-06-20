import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'; // Biblioteca para comparar senhas seguras

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    
    // Verifica se o usuário existe e se a senha bate
    // (Ainda não usamos o bcrypt aqui por simplicidade, mas é o padrão de mercado!)
    if (user?.password !== pass) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    // Cria o token JWT
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}