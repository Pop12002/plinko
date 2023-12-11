import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UpdateBetConfigDto } from './configuration/dto/update-bet-config.dto';
import { BetService } from './bet.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { AuthMiddlewareData } from '../auth/middleware/middleware.interfaces';

@Controller('bet')
export class BetController {
  constructor(private betService: BetService) {}

  @Post('process-bet')
  processBet(
    @Body() createBetDto: CreateBetDto,
    @Res({ passthrough: true }) response: AuthMiddlewareData,
  ) {
    return this.betService.processBet(response.locals.user.id, createBetDto);
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
