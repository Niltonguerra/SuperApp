import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { ChatRoom, ChatRoomDocument } from '../schemas/chatRoom.schema';
import { UsuarioDocument } from 'implementations/user/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('usuario') private userModel: Model<UsuarioDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoomDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private validateObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid ID format');
    }
    return new Types.ObjectId(id);
  }

  async createRoom(name: string, participants: string[]): Promise<ChatRoom> {
    const room = new this.chatRoomModel({ name, participants });
    return room.save();
  }

  async sendMessage(sender: string, chatRoom: string, content: string): Promise<Message> {
    const senderId = this.validateObjectId(sender);
    const chatRoomId = this.validateObjectId(chatRoom);

    const message = new this.messageModel({
      sender: senderId,
      chatRoom: chatRoomId,
      content,
    });

    const savedMessage = await message.save();

    this.eventEmitter.emit('message.created', { chatRoom, message: savedMessage });
    return savedMessage;
  }

  async getMessages(chatRoomId: string): Promise<Message[]> {
    const roomId = this.validateObjectId(chatRoomId);

    return this.messageModel
      .find({ chatRoom: roomId })
      .populate('sender', '_id name')
      .exec();
  }
}
