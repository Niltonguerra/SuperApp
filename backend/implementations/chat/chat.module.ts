import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatRoom, ChatRoomSchema } from './schemas/chatRoom.schema';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { UsuarioSchema } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ChatGateway } from './services/chat.gateway';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'usuario', schema: UsuarioSchema },
      { name: Message.name, schema: MessageSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
})
export class ChatModule {}
