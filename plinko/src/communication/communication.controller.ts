import { Body, Controller, Post } from '@nestjs/common';
import { UpdateBetConfigDto } from '../configuration/dto/update-bet-config.dto';
import { CommunicationService } from './communication.service';
import { CreateBetDto } from './dto/create-bet.dto';

@Controller('communication')
export class CommunicationController {
  constructor(private communicationService: CommunicationService) {}
  @Post('process-bet')
  processBet(@Body() createBetDto: CreateBetDto) {
    return this.communicationService.processBet(createBetDto);
  }

  @Post('change-bet-config')
  updateBetConfig(@Body() updateBetConfigDto: UpdateBetConfigDto) {
    return this.communicationService.updateConfig(updateBetConfigDto);
  }
}
