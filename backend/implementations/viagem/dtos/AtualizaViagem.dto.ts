import { PartialType } from '@nestjs/mapped-types';
import { CriarViagemDto } from './criarViagem.dto';


export class AtualizaViagemDto extends PartialType(CriarViagemDto) {
}
