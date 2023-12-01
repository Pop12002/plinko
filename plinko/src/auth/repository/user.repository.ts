import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async exists(user: User): Promise<boolean> {
    const result = await this.userModel.countDocuments(
      { email: user.email },
      { limit: 1 },
    );
    const returnValue = result > 0;
    return returnValue;
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findOne(userFilerQuery: FilterQuery<User>): Promise<User> {
    return this.userModel.findOne(userFilerQuery);
  }

  async find(userFilerQuery: FilterQuery<User>): Promise<User[]> {
    return this.userModel.find(userFilerQuery);
  }
}
