import { Module } from '@nestjs/common';
import { User2Service } from './user2.service';
import { User2Controller } from './user2.controller';

@Module({
  controllers: [User2Controller],
  providers: [User2Service],
})
export class User2Module {}
