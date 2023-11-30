import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { NormalDistributionService } from '../calculation/normal-distribution.service';
import { StandardDeviationConfigurationService } from '../configuration/std-dev-config.service';
import { CommunicationGateway } from './communication.getawey';
@Module({
  providers: [
    CommunicationGateway,
    CommunicationService,
    NormalDistributionService,
    StandardDeviationConfigurationService,
  ],
  exports: [CommunicationService],
  imports: [],
})
export class CommunicationModule {}
