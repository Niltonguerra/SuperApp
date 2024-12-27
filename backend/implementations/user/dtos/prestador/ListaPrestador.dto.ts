
export class ListaPrestadorPublicoDTO {
  nome: string;
  foto: string;
  avaliacao_como_cliente: number;
  email:string;
  telefone: string;
  avaliacao_como_prestador: number;
  carro:{
    placa:string;
    modelo:string;
    cor:string;
    ano:string;
    foto:string;
  }
  id_viagens: string[];
}

export class ListaPrestadorPessoalDTO {
  id:string;
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
  carro:{
    placa:string;
    modelo:string;
    cor:string;
    ano:string;
    foto:string;
  }
  id_viagens: string[];
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
  carro:{
    placa:string;
    modelo:string;
    cor:string;
    ano:string;
    foto:string;
  }
  id_viagens: string[];
}


