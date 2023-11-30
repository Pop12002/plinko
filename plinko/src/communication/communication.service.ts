import { Injectable } from '@nestjs/common';
import { NormalDistributionService } from '../calculation/normal-distribution.service';
import { StandardDeviationConfigurationService } from '../configuration/std-dev-config.service';

@Injectable()
export class CommunicationService {
  constructor(
    private normalDistributionService: NormalDistributionService,
    private stdDevConfigService: StandardDeviationConfigurationService,
  ) {}

  private multipliers: number[] = [0.5, 1.0, 1.1, 1.4, 3.0, 8.9];
  private mean = this.multipliers[0];
  private targetRTP = 99;
  private numSimulations = 100000;
  private numCorrections = 1000;

  private standardDeviation =
    this.stdDevConfigService.calculateStandardDeviationForRTP(
      this.multipliers,
      this.mean,
      this.targetRTP,
      this.numSimulations,
      this.numCorrections,
    );

  public processBet(betData: any, clientId: string): Promise<any> {
    const isValidBet = this.validateBet(betData);
    if (!isValidBet) {
      return Promise.reject({ success: false, message: 'Invalid bet' });
    }

    const outcome = this.calculateBetOutcome(betData);
    return Promise.resolve({ success: true, outcome });
  }

  private validateBet(betData: any): boolean {
    return betData.amount > 0 && betData.amount <= 1000;
  }

  private calculateBetOutcome(betData: any): any {
    const multiplier = this.normalDistributionService.generateBellCurveChoice(
      this.multipliers,
      this.mean,
      this.standardDeviation,
    );
    const winAmount = betData.amount * multiplier;
    return { multiplier, winAmount };
  }
}
