import { Module } from '@nestjs/common';
import { ViagemCRUDService} from './services/viagemCRUD.service';
import { ViagemUsuarioController } from './controllers/viagemUsuario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { ViagemSchema } from './entities/viagem.entity';
import { ViagemUsuarioService } from './services/viagemUsuario.service';
import { ViagemCRUDController } from './controllers/viagemCRUD.controller';
import { ChatService } from '../chat/services/chat.service';
import { Message, MessageSchema } from '../chat/schemas/message.schema';
import { ChatRoom, ChatRoomSchema } from '../chat/schemas/chatRoom.schema';
import { UsuarioSchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'usuario', schema: UsuarioSchema },
      { name: 'viagens', schema: ViagemSchema },
      { name: Message.name, schema: MessageSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
    
    JwtModule,
    UserModule
  ],
  providers: [
    ViagemUsuarioService,
    ViagemCRUDService,
    ChatService,
  ],
  controllers: [
    ViagemUsuarioController,
    ViagemCRUDController,
  ],
  exports: [
    ViagemUsuarioService,
    ViagemCRUDService,
  ]
})
export class ViagemModule {}
