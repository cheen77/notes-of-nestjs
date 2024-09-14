import { Test, TestingModule } from '@nestjs/testing';
import { DocController } from './doc.controller';
import { DocService } from './doc.service';

describe('DocController', () => {
  let controller: DocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocController],
      providers: [DocService],
    }).compile();

    controller = module.get<DocController>(DocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
