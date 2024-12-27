

export class ListarViagemDto {
  _id: string;
  custo: string;
  id_usuarios?: string[];
  origem: string;
  destino: string;
  data_hora_partida: Date;
  data_hora_chegada: Date;
  quantidade_de_vagas: number;
  nome_prestador: string;
}
