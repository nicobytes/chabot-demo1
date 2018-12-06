import { Controller, Post, Req, Res } from '@nestjs/common';
import { BotAdapterService } from './../services/bot-adapter.service';

@Controller('api/messages')
export class MessagesController {

  constructor(
    private botAdapter: BotAdapterService,
  ) {}

  @Post()
  async messages(@Req() request, @Res() response) {
    return await this.botAdapter.proceessActivity(request, response);
  }
}
