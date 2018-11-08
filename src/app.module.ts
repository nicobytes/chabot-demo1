import { Module } from '@nestjs/common';

import { CoreModule } from './core/core.module';
import { ChatBotModule } from './chatbot/chatbot.module';

@Module({
  imports: [ CoreModule, ChatBotModule ],
})
export class AppModule {}
