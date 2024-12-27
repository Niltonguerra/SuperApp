export class ListaUsuarioRetornoDTO {
  nome: string;
  email: string;
}

export class MensagemLoginDTO {
  statusCode: string;
  mensagem: string;
  token: string;
}

export class MensagemRetornoDTO {
  statusCode: number;
  mensagem: string;
  dadosUsuario?: ListaUsuarioRetornoDTO;
}
