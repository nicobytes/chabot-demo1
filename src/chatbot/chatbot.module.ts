import { Module } from '@nestjs/common';

import { MessagesController } from './controllers/messages.controller';
import { BotAdapterService } from './services/bot-adapter.service';

@Module({
  imports: [],
  controllers: [ MessagesController ],
  providers: [ BotAdapterService ],
})
export class ChatBotModule {}
