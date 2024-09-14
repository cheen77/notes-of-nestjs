import { Injectable } from '@nestjs/common';
import { CreateUser2Dto } from './dto/create-user2.dto';
import { UpdateUser2Dto } from './dto/update-user2.dto';

@Injectable()
export class User2Service {
  create(createUser2Dto: CreateUser2Dto) {
    return 'This action adds a new user2';
  }

  findAll() {
    return `This action returns all user2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user2`;
  }

  update(id: number, updateUser2Dto: UpdateUser2Dto) {
    return `This action updates a #${id} user2`;
  }

  remove(id: number) {
    return `This action removes a #${id} user2`;
  }
}
