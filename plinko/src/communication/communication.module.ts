import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { NormalDistributionService } from '../calculation/normal-distribution.service';
import { StandardDeviationConfigurationService } from '../configuration/std-dev-config.service';
import { CommunicationGateway } from './communication.getawey';
import { StandardDeviationConfigurationModule } from '../configuration/std-dev-config.module';
@Module({
  imports: [StandardDeviationConfigurationModule],
  providers: [
    CommunicationGateway,
    CommunicationService,
    NormalDistributionService,
    StandardDeviationConfigurationService,
  ],
  exports: [CommunicationService],
})
export class CommunicationModule {}
