import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { OneToOneDto } from './dto/oneToOneDto'
import { OneToManyDto } from './dto/oneToManyDto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/oneToOneApi')
  oneToOneApi(@Body() oneToOneDto: OneToOneDto) {
    return this.userService.oneToOneApi(oneToOneDto)
  }

  @Post('/oneToManyApi')
  oneToManyApi(@Body() oneToManyDto: OneToManyDto) {
    return this.userService.oneToManyApi(oneToManyDto)
  }

  @Get('/getOneToMany')
  getOneToMany(@Query() query) {
    return this.userService.getOneToMany()
  }

  @Post('/manyToManyApi')
  manyToManyApi(@Body() params: { tags: string[]; userId: string }) {
    return this.userService.manyToManyApi(params)
  }

  @Get('/getManyToMany')
  getManyToMany(@Query() query) {
    return this.userService.getManyToMany()
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  findAll(@Query() query: { keyWord: string; page: number; pageSize: number }) {
    return this.userService.findAll(query)
  }

  @Get('/getOneToOne')
  getOneToOne(@Query() query) {
    return this.userService.getOneToOne()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
