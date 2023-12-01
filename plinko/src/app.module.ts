import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunicationModule } from './communication/communication.module';
import { BetConfigModule } from './configuration/bet-config.module';

@Module({
  imports: [CommunicationModule, BetConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
