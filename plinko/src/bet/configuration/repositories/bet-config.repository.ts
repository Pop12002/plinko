import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BetConfig, BetConfigDocument } from '../schemas/bet-config.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class BetConfigRepository {
  constructor(
    @InjectModel(BetConfig.name)
    private betConfigModel: Model<BetConfigDocument>,
  ) {}

  async create(betConfig: BetConfig): Promise<BetConfig> {
    const newBetConfig = new this.betConfigModel(betConfig);
    return newBetConfig.save();
  }

  async findOne(
    betConfigFilerQuery: FilterQuery<BetConfig>,
  ): Promise<BetConfig> {
    return this.betConfigModel.findOne(betConfigFilerQuery);
  }
}
