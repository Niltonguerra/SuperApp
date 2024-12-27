export class CreateHistoricoDto {
  custo_viagem: string;
  origem: string;
  destino: string;
  data_hora_partida: Date;
  data_hora_chegada: Date;
  nome_prestador: string;
  nome_consumidores: string[];
  modelo_carro: string;
  cor_carro: string;
  ano_carro: string;
  foto_carro: string;
  quantidade_de_vagas_carro: number;
  avaliacao_como_prestador: number;
  foto_prestador: string;
  id_prestador: string;
  id_consumidores: string[];
}
