
export class ListaUsuarioPublicoDTO {
  nome: string;
  foto: string;
  avaliacao_como_cliente: Number;
  email:string;
  telefone: string;
  
}


export class ListaUsuarioPessoalDTO {
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
  id_viagens: string[];

}

export class ListaUsuarioCompletoDTO {
  _id:string;
  CPF: string;
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
  id_viagens: string[];
}

