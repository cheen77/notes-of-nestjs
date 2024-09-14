import { Controller, Get, Post, Body, Patch, Param, Delete, Version } from '@nestjs/common'
import { User2Service } from './user2.service'
import { CreateUser2Dto } from './dto/create-user2.dto'
import { UpdateUser2Dto } from './dto/update-user2.dto'
import { ApiTags } from "@nestjs/swagger";
@Controller({
  path: 'user2',
  version: '1',
})
@ApiTags("user2")
export class User2Controller {
  constructor(private readonly user2Service: User2Service) { }

  @Post()
  create(@Body() createUser2Dto: CreateUser2Dto) {
    return this.user2Service.create(createUser2Dto)
  }

  @Get()
  // @Version('1')
  findAll() {
    return this.user2Service.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.user2Service.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser2Dto: UpdateUser2Dto) {
    return this.user2Service.update(+id, updateUser2Dto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.user2Service.remove(+id)
  }
}
