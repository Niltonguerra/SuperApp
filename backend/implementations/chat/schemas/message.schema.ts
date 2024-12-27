import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Message {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'usuario', required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true })
  chatRoom: Types.ObjectId;

  @Prop({ default: Date.now })
  sentAt: Date;
}

export type MessageDocument = Message & Document;
export const MessageSchema = SchemaFactory.createForClass(Message);
