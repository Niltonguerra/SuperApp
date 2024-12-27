import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RedisSessionService } from 'implementations/redis/services/redisSession.service';

@Injectable()
export class JwtStrategyPrestador extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private redisService: RedisSessionService, // injetando o serviço Redis
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SECRET_JWT_SESSION_USER'), 
    });
  }

  async validate(payload: any) {
    const sessionKey = `user_session_${payload.id}`; // chave da sessão no Redis, pode ser adaptada

    // Verifica se a sessão do usuário está ativa no Redis
    const isSessionActive = await this.redisService.existsSession(sessionKey);
    
    if (!isSessionActive) {
      // Se não houver sessão ativa, lançar uma exceção ou retornar null para falhar a autenticação
      throw new UnauthorizedException('Sessão expirada ou inválida');
    }

    // Se a sessão estiver ativa, retornar o payload validado
    return { userId: payload.id, email: payload.email };
  }
}
