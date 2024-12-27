import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


@Schema()
export class UsuarioViagens extends Document {
  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'usuario', required: true })
  usuarios: string;

  @Prop({  type: mongoose.Schema.Types.ObjectId, ref: 'viagens', required: true })
  viagens: string;

  @Prop({ default: Date.now })
  data_associacao: Date;
}

export const UsuarioViagensSchema = SchemaFactory.createForClass(UsuarioViagens);
