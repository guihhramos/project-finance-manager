import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUA_CHAVE_SECRETA', // DEVE ser a mesma que usaste no AuthModule
    });
  }

  async validate(payload: any) {
    // O que retornarmos aqui ficará disponível no 'request.user'
    return { userId: payload.sub, email: payload.email };
  }
}