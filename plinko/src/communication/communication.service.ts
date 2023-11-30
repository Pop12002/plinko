import { Injectable } from '@nestjs/common';

@Injectable()
export class CommunicationService {
    private multipliers: number[] = [0.5, 1.0, 1.1, 1.4, 3.0, 8.9];
    private mean = this.multipliers[0];
    private standardDeviation = 0.99;
    private targetRTP = 98;
    private numSimulations = 1000;

    public generateBellCurveChoice(): number {
        const probabilities = this.multipliers.map(value => this.normalDistribution(value, this.mean, this.standardDeviation));
        const totalProbability = probabilities.reduce((acc, probability) => acc + probability, 0);
        const randomValue = Math.random() * totalProbability;

        let cumulativeProbability = 0;
        for (let i = 0; i < this.multipliers.length; i++) {
            cumulativeProbability += probabilities[i];
            if (randomValue <= cumulativeProbability) {
                return this.multipliers[i];
            }
        }

        return this.multipliers[this.multipliers.length - 1];
    }

    public processBet(betData: any, clientId: string): Promise<any> {
        console.log(`Obrada opklade za klijenta ${clientId}`, betData);
        const isValidBet = this.validateBet(betData);
        if (!isValidBet) {
            return Promise.reject({ success: false, message: 'Nevalidna opklada' });
        }

        const outcome = this.calculateBetOutcome(betData);
        return Promise.resolve({ success: true, outcome });
    }

    public processOtherMessage(messageData: any): Promise<any> {
        console.log('Obrada druge vrste poruka', messageData);
        const response = this.handleCustomMessage(messageData);
        return Promise.resolve({ success: true, response });
    }

    private validateBet(betData: any): boolean {
        return betData.amount > 0 && betData.amount <= 1000; // Primer validacije
    }

    private calculateBetOutcome(betData: any): any {
        const multiplier = this.generateBellCurveChoice();
        return { multiplier, winAmount: betData.amount * multiplier };
    }

    private handleCustomMessage(messageData: any): any {
        return { message: 'Poruka obrađena', data: messageData };
    }

    private normalDistribution(x: number, mean: number, standardDeviation: number): number {
        const coefficient = 1 / (standardDeviation * Math.sqrt(2 * Math.PI));
        const exponent = -((x - mean) ** 2) / (2 * standardDeviation ** 2);
        return coefficient * Math.exp(exponent);
    }
}
