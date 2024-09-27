import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { Socket } from 'socket.io';

@Injectable()
export class MessagesService {
  // 用内存数组作为演示,你也可以使用数据库来存储聊天数据
  messages: Message[] = []; // 聊天数据
  clientToUser = {}; //记录客户端连接的用户名和id映射
  async create(createMessageDto: CreateMessageDto, clientId: string) {
    createMessageDto.name = this.clientToUser[clientId];
    createMessageDto.id = clientId;
    const message = { ...createMessageDto };
    this.messages.push(message);
    return message;
  }

  findAll() {
    return this.messages;
  }

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;
    return clientId;
  }

  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }

  async typing(isTyping: boolean, client: Socket) {
    const name = await this.getClientName(client.id);
    // 向用户发送提示,除了自己接收
    client.broadcast.emit('typing', {
      name,
      isTyping,
      id: client.id,
    });
  }

  getTimestamp() {
    const d = new Date();
    const hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0'); // 确保分钟是两位数
    return `${hours}:${minutes}`;
  }
}
