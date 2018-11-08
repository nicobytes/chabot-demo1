import { ConfigService } from './config.service';

export const SERVICES: any[] = [
  {
    provide: ConfigService,
    useValue: new ConfigService(`enviroments/${process.env.NODE_ENV}.env`),
  },
];
