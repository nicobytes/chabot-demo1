import { Injectable } from '@nestjs/common';
import { BotFrameworkAdapter } from 'botbuilder';
import { LuisRecognizer, LuisApplication, LuisPredictionOptions } from 'botbuilder-ai';

import { ConfigService } from './../../core/services/config.service';

@Injectable()
export class BotAdapterService {

  private botAppId: string;
  private botAppPassword: string;
  private luisAppId: string;
  private luisAppKey: string;

  botFrameworkAdapter: BotFrameworkAdapter;
  luisRecognizer: LuisRecognizer;

  constructor(
    private config: ConfigService,
  ) {
    this.botAppId = this.config.get('BOT_APP_ID');
    this.botAppPassword = this.config.get('BOT_APP_PASSWORD');
    this.luisAppId = this.config.get('LUIS_APP_ID');
    this.luisAppKey = this.config.get('LUIS_API_KEY');
    this.generateAdapter();
    this.generateRecognizer();
  }

  // proceessActivity(request, response) {
  //   this.botFrameworkAdapter.processActivity(request, response, async (turnContext) => {
  //     if (turnContext.activity.type === 'message') {
  //       if (turnContext.activity.text === 'hola') {
  //         return await turnContext.sendActivity(`Hola, ¿cómo estás?`);
  //       }else {
  //         return await turnContext.sendActivity(`no se`);
  //       }
  //     }
  //   });
  // }

  proceessActivity(request, response) {
    this.botFrameworkAdapter.processActivity(request, response, async (turnContext: any) => {
      if (turnContext.activity.type === 'message') {
        const results = await this.luisRecognizer.recognize(turnContext);
        const topIntent = results.luisResult.topScoringIntent;
        console.log('-------');
        console.log(results);
        console.log('-------');
        console.log(topIntent);
        switch (topIntent.intent) {
          case 'Saludos':
            return await turnContext.sendActivity(`Hola, ¿cómo estás?`);
          case 'Reconocer la cedula':
            const entities: any[] = results.luisResult.entities;
            let dni = '';
            if (entities.length > 0) {
              dni = entities[0].entity;
            }
            return await turnContext.sendActivity(`gracias por su cédula, ${dni}`);
          default:
            return await turnContext.sendActivity(`Lo siento no etendí`);
        }
      }
    });
  }

  private generateAdapter() {
    const botFramework = {
      appId: this.botAppId,
      appPassword: this.botAppPassword,
    };
    this.botFrameworkAdapter = new BotFrameworkAdapter(botFramework);
  }

  private generateRecognizer() {
    const luisApplication: LuisApplication = {
      applicationId: this.luisAppId,
      endpointKey: this.luisAppKey,
    };
    const luisPredictionOptions: LuisPredictionOptions = {
      includeAllIntents: true,
      log: true,
      staging: false,
    };
    this.luisRecognizer = new LuisRecognizer(luisApplication, luisPredictionOptions, true);
  }
}
