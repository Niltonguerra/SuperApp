import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class Viagem {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, auto: true })
  _id?: mongoose.Types.ObjectId;

  @Prop({ type: String, required: false })
  custo: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'usuario', required: false})
  id_usuarios?: string[];

  @Prop({ type: String, required: false })
  origem: string;

  @Prop({ type: String, required: false })
  destino: string;

  @Prop({ type: String, required: false })
  data_hora_partida: Date;

  @Prop({ type: String, required: false })
  data_hora_chegada: Date;

  @Prop({ type: Number, required: false })
  quantidade_de_vagas: number;

  @Prop({ type: String, required: false })
  nome_prestador: string;

  @Prop({ type: Boolean, required: false })
  finalizada?: boolean;
}

export const ViagemSchema = SchemaFactory.createForClass(Viagem);
