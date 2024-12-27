
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from 'implementations/user/services/user.service';
import { ConfigService } from '@nestjs/config';
import { RedisSessionService } from 'implementations/redis/services/redisSession.service';
import { AuthUserDTO, LoginUsuarioInternoDTO } from '../dtos/autenticacao/AuthUser.dto';





@Injectable()
export class AuthUserService {
  constructor(
    private readonly UsuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private readonly redisSessionService: RedisSessionService,
  ) {}


  async FazerLogin(authUserDTO: AuthUserDTO): Promise<{} | null> {
    const {email, senha} = authUserDTO;

    //valida apenas o email e a senha aqui
    const validatedUser:LoginUsuarioInternoDTO = await this.validateUser(email, senha);

    if (!validatedUser) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera o token JWT
    const token = await this.geraToken(validatedUser);

    // Armazena a sessão no Redis
    await this.redisSessionService.setValueSession(
      `user_session_${validatedUser._id}`, 
      { token, userId: validatedUser._id},
      this.configService.get<number>('USER_SESSION_TIME')
    );


    return {
      token: token.toString(),
    }
  }




  private async validateUser(email: string, senha: string): Promise<LoginUsuarioInternoDTO> {
 
    const user:LoginUsuarioInternoDTO = await this.UsuarioService.findByEmail(email);

    const isMatch = bcrypt.compare(senha, user.senha);

    if (user === null || !isMatch) {
      return null;
    }
    
    return user;
  }


  private async geraToken(user: LoginUsuarioInternoDTO ):Promise<string> {
    const payload = { email: user.email, id: user._id };
    return this.jwtService.sign(payload, { secret: this.configService.get<string>('SECRET_JWT_SESSION_USER') });
  }
}
