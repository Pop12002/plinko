import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunicationModule } from './communication/communication.module';
import { StandardDeviationConfigurationModule } from './configuration/std-dev-config.module';

@Module({
  imports: [CommunicationModule, StandardDeviationConfigurationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
