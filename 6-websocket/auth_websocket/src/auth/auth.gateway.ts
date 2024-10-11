import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { MyLogger } from 'src/logger-1/logger.service';

@WebSocketGateway({
  namespace: 'auth', //作用   http://localhost:3001/auth 访问
})
export class AuthGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: MyLogger,

  ) { }

  afterInit() { }

  handleConnection() {
    this.logger.verbose('Client connected', 'WS');
  }
  handleDisconnect() { }


  @SubscribeMessage('aaa')
  async create(
    @MessageBody() body: any,
  ) {
    return true
  }
}
