import { Test, TestingModule } from '@nestjs/testing';
import { UserAccessService } from './shared.service';

describe('SharedService', () => {
  let service: UserAccessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAccessService],
    }).compile();

    service = module.get<UserAccessService>(UserAccessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
