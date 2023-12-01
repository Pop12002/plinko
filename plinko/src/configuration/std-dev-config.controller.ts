import { Body, Controller, Post } from '@nestjs/common';
import { StandardDeviationConfiguration } from './std-dev-config.model';
import { StandardDeviationConfigurationService } from './std-dev-config.service';
import { UpdateStandardDeviationConfiguration } from './dto/update-std-dev-config.dto';

@Controller('standard-deviation-config')
export class StandardDeviationConfigurationController {
  constructor(
    private standardDeviationConfigurationService: StandardDeviationConfigurationService,
  ) {}
  @Post()
  updateStdDevConfig(
    @Body()
    dto: UpdateStandardDeviationConfiguration,
  ) {
    dto.multipliers.sort();
    const mean = dto.multipliers[0];
    const numSimulations = 100000;
    const numCorrections = 1000;
    const standardDeviation =
      this.standardDeviationConfigurationService.calculateStandardDeviationForRTP(
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

    this.standardDeviationConfigurationService.updateConfiguration(
      standardDeviationConfiguration,
    );
  }
}
