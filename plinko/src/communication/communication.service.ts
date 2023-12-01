import { Injectable } from '@nestjs/common';
import { NormalDistributionService } from '../calculation/normal-distribution.service';
import { BetConfigService } from '../configuration/bet-config.service';
import { BetConfig } from '../configuration/model/bet-config.model';
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

  public processBet(betData: any, clientId: string): Promise<any> {
    const isValidBet = this.validateBet(betData);
    if (!isValidBet) {
      return Promise.reject({ success: false, message: 'Invalid bet' });
    }

    const outcome = this.calculateBetOutcome(betData);
    return Promise.resolve({ success: true, outcome });
  }

  public updateConfig(dto: UpdateBetConfigDto) {
    dto.multipliers.sort();
    const mean = dto.multipliers[0];
    const numSimulations = 100000;
    const numCorrections = 1000;
    const standardDeviation =
      this.betConfigService.calculateStandardDeviationForRTP(
        dto.multipliers,
        mean,
        dto.targetRTP,
        numSimulations,
        numCorrections,
      );

    const betConfig = new BetConfig(
      dto.multipliers,
      mean,
      dto.targetRTP,
      numSimulations,
      numCorrections,
      standardDeviation,
    );

    this.betConfigService.updateConfiguration(betConfig);
  }

  private validateBet(betData: any): boolean {
    return betData.amount > 0 && betData.amount <= 1000;
  }

  private calculateBetOutcome(betData: any): any {
    this.currentConfiguration = this.betConfigService.getConfiguration();
    const multiplier = this.normalDistributionService.generateBellCurveChoice(
      this.currentConfiguration.multipliers,
      this.currentConfiguration.mean,
      this.currentConfiguration.standardDeviation,
    );
    const winAmount = betData.amount * multiplier;
    return { multiplier, winAmount };
  }
}
