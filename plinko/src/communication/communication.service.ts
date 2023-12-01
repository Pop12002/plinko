import { Injectable } from '@nestjs/common';
import { NormalDistributionService } from '../calculation/normal-distribution.service';
import { BetConfigService } from '../configuration/bet-config.service';
import { BetConfig } from '../configuration/schemas/bet-config.schema';
import { UpdateBetConfigDto } from '../configuration/dto/update-bet-config.dto';

@Injectable()
export class CommunicationService {
  constructor(
    private normalDistributionService: NormalDistributionService,
    private betConfigService: BetConfigService,
  ) {
    this.currentConfiguration = this.betConfigService.getConfiguration();
  }

  private currentConfiguration: BetConfig;

  public processBet(betData: any) {
    this.currentConfiguration = this.betConfigService.getConfiguration();
    const multiplier = this.normalDistributionService.generateBellCurveChoice(
      this.currentConfiguration.multipliers,
      this.currentConfiguration.mean,
      this.currentConfiguration.standardDeviation,
    );
    const winAmount = betData.amount * multiplier;
    return { multiplier, winAmount };
  }

  public async updateConfig(dto: UpdateBetConfigDto) {
    dto.multipliers.sort();
    const mean = dto.multipliers[0];
    const numSimulations = 100000;
    const numCorrections = 1000;
    const standardDeviation =
      await this.betConfigService.calculateStandardDeviationForRTP(
        dto.multipliers,
        mean,
        dto.targetRTP,
        numSimulations,
        numCorrections,
      );
    this.currentConfiguration = this.betConfigService.getConfiguration();
    return this.currentConfiguration;
  }
}
