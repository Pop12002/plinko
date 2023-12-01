import { Body, Controller, Post } from '@nestjs/common';
import { BetConfig } from './model/bet-config.model';
import { BetConfigService } from './bet-config.service';
import { UpdateBetConfigDto } from './dto/update-bet-config.dto';

@Controller('standard-deviation-config')
export class BetConfigController {
  constructor(private betConfigService: BetConfigService) {}
  @Post()
  updateStdDevConfig(
    @Body()
    dto: UpdateBetConfigDto,
  ) {
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
}
