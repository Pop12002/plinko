import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UpdateBetConfigDto } from './configuration/dto/update-bet-config.dto';
import { BetService } from './bet.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { GetUser } from '../auth/decorator';

@UseGuards(JwtGuard)
@Controller('bet')
export class BetController {
  constructor(private communicationService: BetService) {}

  @Post('process-bet')
  processBet(
    @GetUser('id') userId: string,
    @Body() createBetDto: CreateBetDto,
  ) {
    return this.communicationService.processBet(userId, createBetDto);
  }

  @Post('change-bet-config')
  updateBetConfig(@Body() updateBetConfigDto: UpdateBetConfigDto) {
    return this.communicationService.updateConfig(updateBetConfigDto);
  }
}
