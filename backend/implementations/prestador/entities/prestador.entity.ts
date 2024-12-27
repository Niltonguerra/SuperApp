import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class User {

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: false, auto: true })
  _id?: mongoose.Types.ObjectId;

  @Prop({ type: String })
  CPF: string;

  @Prop({ type: Date })
  data_nascimento: Date;

  @Prop({ type: String })
  foto: string;

  @Prop({ type: Number })
  avaliacao_como_cliente: number;

  @Prop({ type: [String] })
  endereco: string[];

  @Prop({ type: String, required: true })
  tipo_conta: string;

  @Prop({ type: String })
  nome: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  senha: string;

  @Prop({ type: String })
  telefone: string;

  @Prop({ type: String, required: false })
  CNH: string;

  @Prop({ type: String, required: false })
  foto_CNH: string;

  @Prop({ type: String, required: false })
  RG: string;

  @Prop({ type: String, required: false })
  DPVAT: string;

  @Prop({ type: String, required: false })
  CRLV: string;

  @Prop({ type: Number, required: false })
  avaliacao_como_prestador: number;

  @Prop({ type: Date, required: false })
  criado_em: Date;

  @Prop({ type: Date, required: false })
  modificado_em: Date;

  @Prop({ type: Boolean })
  usuario_ativo: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'historico', required: false })
  historico_de_viagens?: string[];

  @Prop(
    raw({
      placa: { type: String, required: false },
      modelo: { type: String, required: false },
      cor: { type: String, required: false },
      ano: { type: Number, required: false },
      foto: { type: String, required: false },
      criado_em: { type: Date, required: false },
      atualizado_em: { type: Date, required: false },
    })
  )
  carro: Record<string, any>;

}

export const UserSchema = SchemaFactory.createForClass(User);
