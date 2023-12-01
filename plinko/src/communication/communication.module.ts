import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { NormalDistributionService } from '../calculation/normal-distribution.service';
import { BetConfigService } from '../configuration/bet-config.service';
import { CommunicationGateway } from './communication.getawey';
import { BetConfigModule } from '../configuration/bet-config.module';
import { CommunicationController } from './communication.controller';
@Module({
  controllers: [CommunicationController],
  imports: [BetConfigModule],
  providers: [
    CommunicationGateway,
    CommunicationService,
    NormalDistributionService,
    BetConfigService,
  ],
  exports: [CommunicationService],
})
export class CommunicationModule {}
