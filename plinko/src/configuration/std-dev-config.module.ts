import { Module } from '@nestjs/common';
import { StandardDeviationConfigurationService } from './std-dev-config.service';
import { StandardDeviationConfigurationController } from './std-dev-config.controller';
import { NormalDistributionService } from '../calculation/normal-distribution.service';

@Module({
  providers: [StandardDeviationConfigurationService, NormalDistributionService],
  controllers: [StandardDeviationConfigurationController],
})
export class StandardDeviationConfigurationModule {}
