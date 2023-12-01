import { Injectable } from '@nestjs/common';
import { Bet, BetDocument } from '../schemas/bet.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BetRepository {
  constructor(
    @InjectModel(Bet.name)
    private betModel: Model<BetDocument>,
  ) {}

  async create(bet: Bet): Promise<Bet> {
    const newBet = new this.betModel(bet);
    return newBet.save();
  }
}
