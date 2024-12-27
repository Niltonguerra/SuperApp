import { PartialType } from '@nestjs/mapped-types';
import { CreateHistoricoDto } from './CriarHistorico.dto';


export class UpdateHistoricoDto extends PartialType(CreateHistoricoDto) {}
