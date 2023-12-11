import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BetDocument = Bet & Document;
@Schema()
export class Bet {
  @Prop()
  userId: string;

  @Prop()
  amount: number;

  @Prop()
  multiplier: number;

  @Prop()
  winAmount: number;
}

export const BetSchema = SchemaFactory.createForClass(Bet);
