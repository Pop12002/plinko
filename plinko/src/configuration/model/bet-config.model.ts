export class BetConfig {
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

  isSame(betConfig: BetConfig): boolean {
    if (betConfig.mean !== this.mean) {
      return false;
    }

    if (betConfig.targetRTP !== this.targetRTP) {
      return false;
    }

    if (betConfig.numSimulations !== this.numSimulations) {
      return false;
    }

    if (betConfig.numCorrections !== this.numCorrections) {
      return false;
    }

    for (let i = 0; i < this.multipliers.length; i++) {
      if (this.multipliers[i] !== betConfig.multipliers[i]) {
        return false;
      }
    }

    return true;
  }

  addStandardDeviation(standardDeviation: number): void {
    this.standardDeviation = standardDeviation;
  }
}
