import { Injectable } from '@nestjs/common';
import { StandardDeviationConfiguration } from './std-dev-config.model';
import { NormalDistributionService } from '../calculation/normal-distribution.service';

@Injectable()
export class StandardDeviationConfigurationService {
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

    this.currentConfiguration = new StandardDeviationConfiguration(
      multipliers,
      mean,
      targetRTP,
      numSimulations,
      numCorrections,
      standardDeviation,
    );
  }
  standardDeviationConfigurationCache: StandardDeviationConfiguration[] = [];
  private currentConfiguration: StandardDeviationConfiguration;

  standardDeviationFromCache(
    standardDeviationConfiguration: StandardDeviationConfiguration,
  ): StandardDeviationConfiguration | undefined {
    for (const element of this.standardDeviationConfigurationCache) {
      if (standardDeviationConfiguration.isSame(element)) {
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
    const standardDeviationConfiguration = new StandardDeviationConfiguration(
      multipliers,
      mean,
      targetRTP,
      numSimulations,
      numCorrections,
      0,
    );

    const standardDeviationCache = this.standardDeviationFromCache(
      standardDeviationConfiguration,
    );

    if (standardDeviationCache) {
      return standardDeviationCache.standardDeviation;
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

    standardDeviationConfiguration.addStandardDeviation(standardDeviation);
    this.standardDeviationConfigurationCache.push(
      standardDeviationConfiguration,
    );

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

  updateConfiguration(
    standardDeviationConfiguration: StandardDeviationConfiguration,
  ) {
    this.currentConfiguration = standardDeviationConfiguration;
  }
}
