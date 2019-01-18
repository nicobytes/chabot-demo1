import { Injectable } from '@nestjs/common';
import { BotFrameworkAdapter, MemoryStorage, ConversationState } from 'botbuilder';
import { LuisRecognizer, LuisApplication, LuisPredictionOptions } from 'botbuilder-ai';
import { DialogSet, WaterfallDialog, TextPrompt } from 'botbuilder-dialogs';

import { ConfigService } from './../../core/services/config.service';

const DIALOG_ONE = 'dialog_identifier_value';
const NAME_PROMPT = 'name_prompt';
@Injectable()
export class BotAdapterService {

  private botAppId: string;
  private botAppPassword: string;
  private luisAppId: string;
  private luisAppKey: string;

  botFrameworkAdapter: BotFrameworkAdapter;
  luisRecognizer: LuisRecognizer;
  storage: MemoryStorage;
  convoState: ConversationState;
  dialogs: DialogSet;

  constructor(
    private config: ConfigService,
  ) {
    this.botAppId = this.config.get('BOT_APP_ID');
    this.botAppPassword = this.config.get('BOT_APP_PASSWORD');
    this.luisAppId = this.config.get('LUIS_APP_ID');
    this.luisAppKey = this.config.get('LUIS_API_KEY');
    this.setup();
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

  // proceessActivity(request, response) {
  //   this.botFrameworkAdapter.processActivity(request, response, async (turnContext: any) => {
  //     if (turnContext.activity.type === 'message') {
  //       const results = await this.luisRecognizer.recognize(turnContext);
  //       const topIntent = results.luisResult.topScoringIntent;
  //       console.log('-------');
  //       console.log(results);
  //       console.log('-------');
  //       console.log(topIntent);
  //       switch (topIntent.intent) {
  //         case 'Saludos':
  //           return await turnContext.sendActivity(`Hola, ¿cómo estás?`);
  //         case 'Reconocer la cedula':
  //           const entities: any[] = results.luisResult.entities;
  //           let dni = '';
  //           if (entities.length > 0) {
  //             dni = entities[0].entity;
  //           }
  //           return await turnContext.sendActivity(`gracias por su cédula, ${dni}`);
  //         default:
  //           return await turnContext.sendActivity(`Lo siento no etendí`);
  //       }
  //     }
  //   });
  // }

  proceessActivity(request, response) {
      this.botFrameworkAdapter.processActivity(request, response, async (turnContext) => {
        if (turnContext.activity.type === 'message') {
          // Create a DialogContext object from the incoming TurnContext
          const dialogContext = await this.dialogs.createContext(turnContext);

          if (!turnContext.responded) {
            const status = await dialogContext.continueDialog();
          }

          // Show menu if no response sent
          if (!turnContext.responded) {
            await dialogContext.beginDialog(DIALOG_ONE);
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

  private setup() {
    this.storage = new MemoryStorage();
    this.convoState = new ConversationState(this.storage);

    const dialogState = this.convoState.createProperty('dialogState');

    this.dialogs = new DialogSet(dialogState);

    this.dialogs.add(new TextPrompt(NAME_PROMPT));

    this.dialogs.add(new WaterfallDialog(DIALOG_ONE, [
      async (stepContext) => {
        // access user input from previous step
        const last_step_answer = stepContext.result;
        // send a message to the user
        await stepContext.context.sendActivity(`Hola 1`);
        return await stepContext.prompt(NAME_PROMPT, 'Please enter your name.');
      },
      async (stepContext) => {
        // access user input from previous step
        const last_step_answer = stepContext.result;
        // send a message to the user
        await stepContext.context.sendActivity(`Bye`);
        return await stepContext.endDialog();
      },
  ]));
  }
}
