import { Controller, Get, Req, Res } from '@nestjs/common';
import { BotAdapterService } from './../services/bot-adapter.service';

@Controller('api/messages')
export class MessagesController {

  constructor(
    private botAdapter: BotAdapterService,
  ) {}

  @Get()
  async messages(@Req() request, @Res() response) {
    return await this.botAdapter.proceessActivity(request, response);
  }
}
