import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  jest.setTimeout(100000);
  it('should run without repetitions', async () => {
    await service.init('http://localhost:3000/', 1, 3);
    const urls = await service.crawl(0);
    expect(urls).toContain('http://localhost:3000/')
    expect(urls).toContain('https://www.reddit.com/')
  })
});
