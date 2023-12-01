import { Injectable } from '@nestjs/common';
import { BetConfig } from './model/bet-config.model';
import { NormalDistributionService } from '../calculation/normal-distribution.service';

@Injectable()
export class BetConfigService {
  constructor(private normalDistributionService: NormalDistributionService) {
    const multipliers = [0.5, 1.0, 1.1, 1.4, 3.0, 8.9];
    const mean = multipliers[0];
    const targetRTP = 99;
    const numSimulations = 100000;
    const numCorrections = 1000;
    const standardDeviation = this.calculateStandardDeviationForRTP(
      multipliers,
      mean,
      targetRTP,
      numSimulations,
      numCorrections,
    );

    this.currentConfiguration = new BetConfig(
      multipliers,
      mean,
      targetRTP,
      numSimulations,
      numCorrections,
      standardDeviation,
    );
  }
  betConfigCache: BetConfig[] = [];
  private currentConfiguration: BetConfig;

  betConfigFromCache(betConfig: BetConfig): BetConfig | undefined {
    for (const element of this.betConfigCache) {
      if (betConfig.isSame(element)) {
        return element;
      }
    }
    return undefined;
  }

  calculateStandardDeviationForRTP(
    multipliers: number[],
    mean: number,
    targetRTP: number,
    numSimulations: number,
    numCorrections: number,
  ): number {
    const betConfig = new BetConfig(
      multipliers,
      mean,
      targetRTP,
      numSimulations,
      numCorrections,
      0,
    );

    const betConfigCache = this.betConfigFromCache(betConfig);

    if (betConfigCache) {
      return betConfigCache.standardDeviation;
    }

    let standardDeviation = 1;
    let numCorrectionsCurrent = 0;

    while (numCorrectionsCurrent < numCorrections) {
      const currentRTP = this.calculateRTP(
        multipliers,
        mean,
        standardDeviation,
        numSimulations,
      );

      if (standardDeviation < 0) {
        return 0;
      }

      if (Math.abs(currentRTP - targetRTP) < 0.01) {
        break;
      } else if (currentRTP < targetRTP) {
        standardDeviation += 0.01;
      } else {
        standardDeviation -= 0.01;
      }

      numCorrectionsCurrent++;
    }

    betConfig.addStandardDeviation(standardDeviation);
    this.betConfigCache.push(betConfig);

    return standardDeviation;
  }

  calculateRTP(
    multipliers: number[],
    mean: number,
    standardDeviation: number,
    numSimulations: number,
  ): number {
    let totalMultiplier = 0;

    for (let i = 0; i < numSimulations; i++) {
      const multiplier = this.normalDistributionService.generateBellCurveChoice(
        multipliers,
        mean,
        standardDeviation,
      );
      totalMultiplier += multiplier;
    }

    const averageMultiplier = totalMultiplier / numSimulations;
    const rtp = 100 + (averageMultiplier - 1) * 100; // RTP is expressed as a percentage

    return rtp;
  }

  getConfiguration() {
    return this.currentConfiguration;
  }

  updateConfiguration(betConfig: BetConfig) {
    this.currentConfiguration = betConfig;
  }
}
