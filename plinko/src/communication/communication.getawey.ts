import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CommunicationService } from './communication.service';

@WebSocketGateway()
export class CommunicationGateway {
  constructor(private communicationService: CommunicationService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('placeBet')
  async handlePlaceBet(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const jsonData = JSON.parse(data);

      const result = await this.communicationService.processBet(
        jsonData,
        client.id,
      );

      client.emit('betResponse', result);
    } catch (error) {
      client.emit('error', { message: error.message });
    }
  }
}
