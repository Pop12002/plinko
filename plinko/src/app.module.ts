import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunicationModule } from './communication/communication.module'; // Uvoz CommunicationModule

@Module({
  imports: [CommunicationModule], // Dodavanje CommunicationModule u imports niz
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
