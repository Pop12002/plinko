import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UpdateBetConfigDto } from './configuration/dto/update-bet-config.dto';
import { BetService } from './bet.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bet')
export class BetController {
  constructor(private betService: BetService) {}

  @Post('process-bet')
  processBet(
    @GetUser('id') userId: string,
    @Body() createBetDto: CreateBetDto,
  ) {
    return this.betService.processBet(userId, createBetDto);
  }

  @Post('change-bet-config')
  updateBetConfig(@Body() updateBetConfigDto: UpdateBetConfigDto) {
    return this.betService.updateConfig(updateBetConfigDto);
  }

  @Get('calculate-rtp')
  getCurrentRtp() {
    return this.betService.getCurrentRtp();
  }
}
