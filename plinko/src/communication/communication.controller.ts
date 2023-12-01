import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class CommunicationController {
  @Get('process-bet')
  processBet() {}

  @Post('change-bet-config')
  updateBetConfig() {}
}
