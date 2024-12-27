import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Historico {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, auto: true })
  _id?: mongoose.Types.ObjectId;

  @Prop({ type: String })
  custo_viagem: string;

  @Prop({ type: String })
  origem: string;

  @Prop({ type: String })
  destino: string;

  @Prop({ type: Date })
  data_hora_partida: Date;

  @Prop({ type: Date })
  data_hora_chegada: Date;

  @Prop({ type: String })
  nome_prestador: string;

  @Prop({ type: [String] })
  nome_consumidores: string[];

  @Prop({ type: String })
  modelo_carro: string;

  @Prop({ type: String })
  cor_carro: string;

  @Prop({ type: String })
  ano_carro: string;

  @Prop({ type: String })
  foto_carro: string;

  @Prop({ type: Number })
  quantidade_de_vagas_carro: Number;

  @Prop({type: Number})
  avaliacao_como_prestador: Number;

  @Prop({ type: String })
  foto_prestador: string;

  @Prop({ type: [String] })
  id_usuarios: string[];

  
}

export const HistoricoSchema = SchemaFactory.createForClass(Historico);
