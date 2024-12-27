import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    // console.log(`Client ${client.id} joined room: ${roomId}`);
    client.emit('joinedRoom', { roomId });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket, 
    payload: { sender: string; chatRoom: string; content: string }
  ) {
    try {
      const message = await this.chatService.sendMessage(payload.sender, payload.chatRoom, payload.content);
      
      this.server.to(payload.chatRoom).emit('receiveMessage', message); // Envia mensagem para a sala
      // console.log(`Message sent to room ${payload.chatRoom}:`, message);
    } catch (error) {
      console.error(`Error sending message: ${error.message}`);
      client.emit('error', { message: error.message });
    }
  }
}
