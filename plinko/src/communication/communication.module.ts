import { Module } from '@nestjs/common';
import { CommunicationService } from './communication.service';
import { NormalDistributionService } from '../calculation/normal-distribution.service';
import { BetConfigService } from '../configuration/bet-config.service';
import { CommunicationController } from './communication.controller';
import { BetConfigRepository } from '../configuration/repositories/bet-config.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BetConfig,
  BetConfigSchema,
} from '../configuration/schemas/bet-config.schema';
@Module({
  controllers: [CommunicationController],
  imports: [
    MongooseModule.forFeature([
      { name: BetConfig.name, schema: BetConfigSchema },
    ]),
  ],
  providers: [
    CommunicationService,
    NormalDistributionService,
    BetConfigService,
    BetConfigRepository,
  ],
  exports: [CommunicationService],
})
export class CommunicationModule {}
