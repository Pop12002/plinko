import { Injectable } from '@nestjs/common';
import { NormalDistributionService } from '../calculation/normal-distribution.service';
import { StandardDeviationConfigurationService } from '../configuration/std-dev-config.service';
import { StandardDeviationConfiguration } from '../configuration/std-dev-config.model';
import { UpdateStandardDeviationConfiguration } from '../configuration/dto/update-std-dev-config.dto';

@Injectable()
export class CommunicationService {
  constructor(
    private normalDistributionService: NormalDistributionService,
    private stdDevConfigService: StandardDeviationConfigurationService,
  ) {
    this.currentConfiguration = this.stdDevConfigService.getConfiguration();
  }

  private currentConfiguration: StandardDeviationConfiguration;

  public processBet(betData: any, clientId: string): Promise<any> {
    const isValidBet = this.validateBet(betData);
    if (!isValidBet) {
      return Promise.reject({ success: false, message: 'Invalid bet' });
    }

    const outcome = this.calculateBetOutcome(betData);
    return Promise.resolve({ success: true, outcome });
  }

  public updateConfig(dto: UpdateStandardDeviationConfiguration) {
    dto.multipliers.sort();
    const mean = dto.multipliers[0];
    const numSimulations = 100000;
    const numCorrections = 1000;
    const standardDeviation =
      this.stdDevConfigService.calculateStandardDeviationForRTP(
        dto.multipliers,
        mean,
        dto.targetRTP,
        numSimulations,
        numCorrections,
      );

    const standardDeviationConfiguration = new StandardDeviationConfiguration(
      dto.multipliers,
      mean,
      dto.targetRTP,
      numSimulations,
      numCorrections,
      standardDeviation,
    );

    this.stdDevConfigService.updateConfiguration(
      standardDeviationConfiguration,
    );
  }

  private validateBet(betData: any): boolean {
    return betData.amount > 0 && betData.amount <= 1000;
  }

  private calculateBetOutcome(betData: any): any {
    this.currentConfiguration = this.stdDevConfigService.getConfiguration();
    const multiplier = this.normalDistributionService.generateBellCurveChoice(
      this.currentConfiguration.multipliers,
      this.currentConfiguration.mean,
      this.currentConfiguration.standardDeviation,
    );
    const winAmount = betData.amount * multiplier;
    return { multiplier, winAmount };
  }
}
