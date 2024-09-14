import { Controller, Get, Query, Post, Body, Patch, Param, Delete, ParseFloatPipe, ParseIntPipe, ParseUUIDPipe, ParseBoolPipe, DefaultValuePipe } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { ValidationPipe } from "~/common/pipes/validation.pipe";
import { ApiSecurity, ApiBasicAuth, ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiHeader } from "@nestjs/swagger";
// @ApiSecurity('basic')
// @ApiBasicAuth()
@ApiBearerAuth()
@Controller('list')
@ApiTags("list")
// @ApiHeader({
//   name: 'Authorization',
//   description: 'Auth token'
// })
export class ListController {
  constructor(private readonly listService: ListService) { }

  // 案例1 ParseIntPipe
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   console.log("id", id, typeof id);

  //   return this.listService.findOne(+id);
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   console.log("id", id, typeof id); // 1 number

  //   return this.listService.findOne(+id);
  // }


  // 案例2 ParseUUIDPipe
  @Get(':id')
  @ApiOperation({ summary: '获取列表', description: '这是一个获取id为xxx的列表' })
  @ApiParam({ name: 'id', description: '列表id', type: 'string', example: "1" })

  findOne(@Param('id', ParseUUIDPipe) id: string) {
    console.log("id", id, typeof id); //d485e074-e0f6-48ab-8ae1-51c11a8c1034 string
    return this.listService.findOne(+id);
  }

  // 访问 http://localhost:3000/list?name=123&flag=true&page=1
  @Get()
  @ApiQuery({ name: 'flag', description: '开关阈值', type: 'boolean', example: true, required: true })
  @ApiQuery({ name: 'page', description: '页数', type: 'number', example: 10, required: true })
  findAll(
    @Query("flag", new DefaultValuePipe(false), ParseBoolPipe) flag: boolean,
    @Query("page", new DefaultValuePipe(0), ParseIntPipe) page: number,
  ) {

    console.log('flag', flag, page);

    return this.listService.findAll();
  }


  // 自定义管道验证DTO 
  @Post()
  @ApiResponse({ status: 403, description: "自定义返回信息" })
  create(@Body(ValidationPipe) createListDto: CreateListDto) {
    console.log("createListDto", createListDto);
    return this.listService.create(createListDto);
  }





}

