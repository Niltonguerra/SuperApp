import { ListaHistoricoDTO } from '../../../../nest/src/modules/historico/dtos/ListaHistorico.dto';
import { HistoricoSchema } from '../../../../nest/src/modules/historico/entities/historico.entity';
import { Historico } from '../../../../nest/src/modules/historico/decorator/historico.decorator';



export class ListaPrestadorPublicoDTO {
  nome: string;
  foto: string;
  avaliacao_como_cliente: number;
  email:string;
  telefone: string;
  avaliacao_como_prestador: number;
}


export class ListaPrestadorPessoalDTO {
  nome: string;
  CPF: string;
  data_nascimento: Date;
  foto: string;
  avaliacao_como_cliente: Number;
  historico_de_viagens: string[];
  endereco: string[];
  tipo_conta: string;
  email: string;
  telefone: string;
  avaliacao_como_prestador: number;
  CNH: string;
  RG: string;
  DPVAT: string;
  foto_CNH: string;
  CRLV: string;
}

export class ListaPrestadorCompletoDTO {
  _id:string;
  CPF: string;
  CNH: string;
  RG: string;
  DPVAT: string;
  foto_CNH: string;
  CRLV: string;
  avaliacao_como_prestador: string;
  data_nascimento: Date;
  foto: string;
  avaliacao_como_cliente: Number;
  historico_de_viagens: string[];
  endereco: string[];
  tipo_conta: string;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  criado_em: Date;
  modificado_em: Date;
  usuario_ativo: boolean;
  usuario_confirmado: boolean;
}


export class ListaPrestadorRetornoDTO {
  nome: string;
  email: string;
}
