import { PartialType } from '@nestjs/mapped-types';
import { CreateUser2Dto } from './create-user2.dto';

export class UpdateUser2Dto extends PartialType(CreateUser2Dto) {}
