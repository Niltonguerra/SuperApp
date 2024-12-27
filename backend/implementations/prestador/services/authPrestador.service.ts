import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RedisSessionService } from 'implementations/redis/services/redisSession.service';
import { AuthPrestadorDTO, LoginPrestadorInternoDTO } from '../dtos/login/AuthPrestador.dto';
import { PrestadorService } from './prestador.service';





@Injectable()
export class AuthPrestadorService {
  constructor(
    private readonly PrestadorService: PrestadorService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly redisSessionService: RedisSessionService,
  ) {}


  async FazerLogin(authPrestadorDTO: AuthPrestadorDTO): Promise<{} | null> {
    const {email, senha} = authPrestadorDTO;

    //valida apenas o email e a senha aqui
    const validatedPrestador:LoginPrestadorInternoDTO = await this.validatePrestador(email, senha);

    if (!validatedPrestador) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera o token JWT
    const token = await this.geraToken(validatedPrestador);

    // Armazena a sessão no Redis
    await this.redisSessionService.setValueSession(
      `Prestador_session_${validatedPrestador._id}`, 
      { token, PrestadorId: validatedPrestador._id},
      this.configService.get<number>('Prestador_SESSION_TIME')
    );


    return {
      token: token.toString(),
    }
  }




  private async validatePrestador(email: string, senha: string): Promise<LoginPrestadorInternoDTO> {
 
    const Prestador:LoginPrestadorInternoDTO = await this.PrestadorService.findByEmail(email);
    const isMatch = bcrypt.compare(senha, Prestador.senha);

    if (Prestador === null || !isMatch) {
      return null;
    }
    
    return Prestador;
  }


  private async geraToken(Prestador: LoginPrestadorInternoDTO ):Promise<string> {
    const payload = { email: Prestador.email, id: Prestador._id };
    return this.jwtService.sign(payload, { secret: this.configService.get<string>('SECRET_JWT_SESSION_Prestador') });
  }
}
