import { IsNotEmpty } from 'class-validator';

export class UpdateBetConfigDto {
  @IsNotEmpty()
  multipliers: number[];

  @IsNotEmpty()
  targetRTP: number;
}
