import { Injectable } from '@nestjs/common';
import * as botbuilder from 'botbuilder';

import { ConfigService } from './../../core/services/config.service';
import { async } from 'rxjs/internal/scheduler/async';

@Injectable()
export class BotAdapterService {

  private appId: string;
  private appPassword: string;

  botFrameworkAdapter: botbuilder.BotFrameworkAdapter;

  constructor(
    private config: ConfigService,
  ) {
    this.appId = this.config.get('APP_ID');
    this.appPassword = this.config.get('APP_PASSWORD');
    this.generateAdapter();
  }

  proceessActivity(request, response) {
    this.botFrameworkAdapter.processActivity(request, response, async (turnContext) => {
      if (turnContext.activity.type === 'message') {
        const utterance = turnContext.activity.text;
        await turnContext.sendActivity(`Tu dijiste ${utterance}`);
      }
    });
  }

  private generateAdapter() {
    this.botFrameworkAdapter = new botbuilder.BotFrameworkAdapter({
      appId: this.appId,
      appPassword: this.appPassword,
    });
  }
}
