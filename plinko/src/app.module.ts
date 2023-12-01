import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunicationModule } from './communication/communication.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    CommunicationModule,
    MongooseModule.forRoot('mongodb://localhost/plinkoDb'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
