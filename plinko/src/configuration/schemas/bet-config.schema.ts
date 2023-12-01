import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BetConfigDocument = BetConfig & Document;

@Schema()
export class BetConfig {
  @Prop()
  multipliers: number[];

  @Prop()
  mean: number;

  @Prop()
  targetRTP: number;

  @Prop()
  numSimulations: number;

  @Prop()
  numCorrections: number;

  @Prop()
  standardDeviation: number;
}

export const BetConfigSchema = SchemaFactory.createForClass(BetConfig);
