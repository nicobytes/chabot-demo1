import { Test, TestingModule } from '@nestjs/testing';
import { BotAdapterService } from './bot-adapter.service';

describe('BotAdapterService', () => {
  let service: BotAdapterService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotAdapterService],
    }).compile();
    service = module.get<BotAdapterService>(BotAdapterService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
