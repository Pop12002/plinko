import { Module } from '@nestjs/common';
import { BetService } from './bet.service';
import { NormalDistributionService } from './calculation/normal-distribution.service';
import { BetConfigService } from './configuration/bet-config.service';
import { BetController } from './bet.controller';
import { BetConfigRepository } from './configuration/repositories/bet-config.repository';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BetConfig,
  BetConfigSchema,
} from './configuration/schemas/bet-config.schema';
import { Bet, BetSchema } from './schemas/bet.schema';
import { BetRepository } from './repositories/bet.repository';
@Module({
  controllers: [BetController],
  imports: [
    MongooseModule.forFeature([
      { name: BetConfig.name, schema: BetConfigSchema },
      { name: Bet.name, schema: BetSchema },
    ]),
  ],
  providers: [
    BetService,
    BetRepository,
    NormalDistributionService,
    BetConfigService,
    BetConfigRepository,
  ],
  exports: [BetService],
})
export class BetModule {}
