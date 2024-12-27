import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from '../services/chat.service';


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create-room')
  async createRoom(@Body('name') name: string, @Body('participants') participants: string[]) {
    return this.chatService.createRoom(name, participants);
  }

  @Post('send-message')
  async sendMessage(
    @Body('sender') sender: string,
    @Body('chatRoom') chatRoom: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(sender, chatRoom, content);
  }

  @Get('messages/:roomId')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId);
  }
}
