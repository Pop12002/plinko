export class StandardDeviationConfiguration {
  multipliers: number[];
  mean: number;
  targetRTP: number;
  numSimulations: number;
  numCorrections: number;
  standardDeviation: number;

  constructor(
    multipliers: number[],
    mean: number,
    targetRTP: number,
    numSimulations: number,
    numCorrections: number,
    standardDeviation: number,
  ) {
    this.multipliers = multipliers;
    this.mean = mean;
    this.targetRTP = targetRTP;
    this.numSimulations = numSimulations;
    this.numCorrections = numCorrections;
    this.standardDeviation = standardDeviation;
  }

  isSame(
    standardDeviationConfiguration: StandardDeviationConfiguration,
  ): boolean {
    if (standardDeviationConfiguration.mean !== this.mean) {
      return false;
    }

    if (standardDeviationConfiguration.targetRTP !== this.targetRTP) {
      return false;
    }

    if (standardDeviationConfiguration.numSimulations !== this.numSimulations) {
      return false;
    }

    if (standardDeviationConfiguration.numCorrections !== this.numCorrections) {
      return false;
    }

    for (let i = 0; i < this.multipliers.length; i++) {
      if (
        this.multipliers[i] !== standardDeviationConfiguration.multipliers[i]
      ) {
        return false;
      }
    }

    return true;
  }

  addStandardDeviation(standardDeviation: number): void {
    this.standardDeviation = standardDeviation;
  }
}
