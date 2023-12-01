import { IsNotEmpty } from 'class-validator';

export class UpdateStandardDeviationConfiguration {
  @IsNotEmpty()
  multipliers: number[];

  @IsNotEmpty()
  targetRTP: number;
}
