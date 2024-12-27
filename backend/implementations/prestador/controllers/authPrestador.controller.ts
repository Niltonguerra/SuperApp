import { Body, Controller, Post} from '@nestjs/common';
import { AuthPrestadorDTO } from '../dtos/login/AuthPrestador.dto';
import { AuthPrestadorService } from '../services/authPrestador.service';


@Controller('auth-prestador')
export class AuthPrestadorController {

  constructor(
    private readonly authPrestadorService: AuthPrestadorService,
  ) {}

  @Post('login')
  async loginPrestador(@Body() authPrestadorDTO: AuthPrestadorDTO) {
    return this.authPrestadorService.FazerLogin(authPrestadorDTO);
  }
}




  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // async login1(@Body('email') email: string, @Body('senha') senha: string) {
  //   try {
  //     const token = await this.authTesteService.login(email, senha);
  //     return { access_token: token };
  //   } catch (error) {
  //     throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  //   }
  // }
