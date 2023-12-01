import { Module } from '@nestjs/common';
import { BetConfigService } from './bet-config.service';
import { BetConfigController } from './bet-config.controller';
import { NormalDistributionService } from '../calculation/normal-distribution.service';

@Module({
  providers: [BetConfigService, NormalDistributionService],
  controllers: [BetConfigController],
})
export class BetConfigModule {}
