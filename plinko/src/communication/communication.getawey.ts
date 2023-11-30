import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { CommunicationService } from './communication.service';

@Injectable()
@WebSocketGateway()
export class CommunicationGateway {
    @WebSocketServer()
    server: Server;

    constructor(private communicationService: CommunicationService) {}

    @SubscribeMessage('placeBet')
    async handlePlaceBet(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
        console.log(`Opklada primljena od ${client.id}:`, data);
        try {
            const result = await this.communicationService.processBet(data, client.id);
            client.emit('betResponse', result);
        } catch (error) {
            client.emit('error', { message: error.message });
        }
    }

    @SubscribeMessage('someOtherMessage')
    async handleSomeOtherMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket): Promise<void> {
        try {
            const response = await this.communicationService.processOtherMessage(data);
            client.emit('otherMessageResponse', response);
        } catch (error) {
            client.emit('error', { message: error.message });
        }
    }

    sendMultiplierToClients(): void {
        const multiplier = this.communicationService.generateBellCurveChoice();
        this.server.emit('multiplierUpdate', { multiplier });
    }
}
