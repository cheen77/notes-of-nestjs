import { Test, TestingModule } from '@nestjs/testing';
import { User2Controller } from './user2.controller';
import { User2Service } from './user2.service';

describe('User2Controller', () => {
  let controller: User2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [User2Controller],
      providers: [User2Service],
    }).compile();

    controller = module.get<User2Controller>(User2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
