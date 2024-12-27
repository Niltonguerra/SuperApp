import { ListaPrestadorRetornoDTO } from "./prestador/ListaPrestador.dto";



export class MensagemRetornoDTO {
  statusCode: number;
  mensagem: string;
  dadosUsuario?: ListaPrestadorRetornoDTO;
}
