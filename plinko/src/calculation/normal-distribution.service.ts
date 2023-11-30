import { Injectable } from '@nestjs/common';

@Injectable()
export class NormalDistributionService {
  normalDistribution(
    x: number,
    mean: number,
    standardDeviation: number,
  ): number {
    const coefficient = 1 / (standardDeviation * Math.sqrt(2 * Math.PI));
    const exponent = -((x - mean) ** 2) / (2 * standardDeviation ** 2);
    return coefficient * Math.exp(exponent);
  }

  generateBellCurveChoice(
    multipliers: number[],
    meanProp: number,
    standardDeviationProp: number,
  ): number {
    const mean = meanProp;
    const standardDeviation = standardDeviationProp;

    const probabilities = multipliers.map((value) =>
      this.normalDistribution(value, mean, standardDeviation),
    );

    const totalProbability = probabilities.reduce(
      (sum, probability) => sum + probability,
      0,
    );

    const randomProbability = Math.random() * totalProbability;

    let cumulativeProbability = 0;
    for (let i = 0; i < multipliers.length; i++) {
      cumulativeProbability += probabilities[i];
      if (randomProbability <= cumulativeProbability) {
        return multipliers[i];
      }
    }

    // Fallback to the last value (shouldn't usually happen)
    return multipliers[multipliers.length - 1];
  }
}
