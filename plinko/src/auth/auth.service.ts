import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './repository/user.repository';
import { User } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable({})
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private userRepository: UserRepository,
  ) {}

  async signup(dto: AuthDto) {
    const user = new User();
    user.id = uuidv4();
    user.email = dto.email;
    user.hash = await argon.hash(dto.password);

    if (await this.userRepository.exists(user)) {
      throw new ForbiddenException('Credentials taken');
    }

    const userDb = await this.userRepository.create({
      id: user.id,
      email: user.email,
      hash: user.hash,
    });

    return this.signToken(userDb.id, user.email);
  }

  async signin(dto: AuthDto) {
    const user = await this.userRepository.findOne({ email: dto.email });
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }

    const passMatches = await argon.verify(user.hash, dto.password);
    if (!passMatches) {
      throw new ForbiddenException('Password incorrect');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
