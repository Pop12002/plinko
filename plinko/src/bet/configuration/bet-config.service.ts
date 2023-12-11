import { Injectable } from '@nestjs/common';
import { BetConfig } from './schemas/bet-config.schema';
import { NormalDistributionService } from '../calculation/normal-distribution.service';
import { BetConfigRepository } from './repositories/bet-config.repository';

@Injectable()
export class BetConfigService {
  constructor(
    private normalDistributionService: NormalDistributionService,
    private betConfigRepository: BetConfigRepository,
  ) {
    this.currentConfiguration = new BetConfig();
    this.currentConfiguration.multipliers = [0.5, 1.0, 1.1, 1.4, 3.0, 8.9];
    this.currentConfiguration.mean = this.currentConfiguration.multipliers[0];
    this.currentConfiguration.targetRTP = 99;
    this.currentConfiguration.numSimulations = 100000;
    this.currentConfiguration.numCorrections = 1000;
    this.currentConfiguration.standardDeviation = 1.03;
  }

  private currentConfiguration: BetConfig;

  async calculateStandardDeviationForRTP(
    multipliers: number[],
    mean: number,
    targetRTP: number,
    numSimulations: number,
    numCorrections: number,
  ): Promise<number> {
    const betConfigCache = await this.betConfigRepository.findOne({
      multipliers,
      mean,
      targetRTP,
      numSimulations,
      numCorrections,
    });

    if (betConfigCache) {
      this.currentConfiguration = betConfigCache;
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

    standardDeviation = standardDeviation;

    const betConfig = await this.betConfigRepository.create({
      multipliers,
      mean,
      targetRTP,
      numSimulations,
      numCorrections,
      standardDeviation,
    });

    this.currentConfiguration = betConfig;

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
    const rtp = 100 + (averageMultiplier - 1) * 100;

    return rtp;
  }

  getConfiguration() {
    return this.currentConfiguration;
  }

  updateConfiguration(betConfig: BetConfig) {
    this.currentConfiguration = betConfig;
  }
}
