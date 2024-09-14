import {
  Controller,
  Get,
  Req,
  Request,
  Query,
  Headers,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Header,
  UseFilters,
  ForbiddenException,
  HttpStatus,
  HttpException,
  UseInterceptors,
} from '@nestjs/common'
import { DocService } from './doc.service'

// 引入异常过滤器HttpExceptionFilter
import { HttpExceptionFilter } from '../../common/filter'
import { LoggingInterceptor } from 'src/common/logging.interceptor'

import { ApiTags } from "@nestjs/swagger";
@Controller('doc')
@ApiTags("doc")
// UseInterceptors() 装饰器
// DocController 中定义的每个路由处理程序都将使用 LoggingInterceptor。
// 当有人调用  接口 时，将在控制台窗口中看到以下输出：
// Before...
// After... 1ms
@UseInterceptors(LoggingInterceptor) //传递的是 LoggingInterceptor 类型而不是实例，让框架承担实例化责任并启用依赖注入
// @UseInterceptors(new LoggingInterceptor()) //传递立即创建的实例
export class DocController {
  constructor(private readonly docService: DocService) { }

  // get

  //1. 可以通过 @Request()或者@Req req 获取请求对象 req.query获取请求参数
  @Get('get1') //前端通过doc/get1?name=chen&age=18访问
  find(@Req() req) {
    // console.log('req', req.query)

    return {
      code: 200,
      success: 'ok',
      data: req.query,
    }
  }

  //2. 可以通过 @Query
  @Get('get2') //前端通过doc/get2?name=chen&age=18访问
  find2(@Query() query) {
    // console.log('query', query)
    return {
      code: 200,
      success: 'ok',
      data: query,
    }
  }

  //3. 还可以直接获取key
  @Get('get2') //前端通过doc/get2?name=chen&age=18访问
  find3(@Query('name') query) {
    // console.log('query', query) //chen
    return {
      code: 200,
      success: 'ok',
      data: query,
    }
  }

  // post

  //1. 可以通过 @Request()或者@Req req 获取请求对象 req.body获取请求参数

  @Post('post1')
  create(@Req() req) {
    // console.log('req', req.body)

    return {
      code: 200,
      success: 'ok',
      data: req.body,
    }
  }

  //  2.可以通过 @Body直接获取

  @Post('post2')
  create2(@Body() body) {
    // console.log('body', body)

    return {
      code: 200,
      success: 'ok',
      data: body,
    }
  }

  // 还可以直接获取key
  @Post('post3')
  create3(@Body('name') body) {
    // console.log('body', body) // chen

    return {
      code: 200,
      success: 'ok',
      data: body,
    }
  }

  //  动态路由

  // 1.通过 @Req  req.params获取
  @Get('get1/:id')
  findOne(@Req() req) {
    // console.log('params', req.params)
    return {
      code: 200,
      success: 'ok',
      data: req.params,
    }
  }

  // 2.通过 @Param  params获取
  @Get('get2/:id')
  findOne1(@Param() params) {
    // console.log('params', params)
    return {
      code: 200,
      success: 'ok',
      data: params,
    }
  }

  // 获取header信息
  @Get(':id')
  findId(@Headers() header) {
    // console.log('header', header)

    return {
      code: 200,
      success: 'ok',
      data: header,
    }
  }

  @Post('post4')
  @Header('Cache-Control', 'none') //设置头
  create4(@Req() req) {
    // console.log('req', req)

    return 'This action adds a new cat'
  }

  // 状态码
  @Get('code/:id')
  @HttpCode(500)
  findId2(@Headers() header) {
    // console.log('header', header)

    return {
      code: 200,
      success: 'ok',
      data: header,
    }
  }

  // 绑定拦截器

  // 绑定过滤器
  @Post('post5')
  @UseFilters(new HttpExceptionFilter())
  async create22(@Body() body) {
    throw new ForbiddenException()
  }

  // 绑定过滤器
  @Post('post6')
  @UseFilters(HttpExceptionFilter)
  async create23(@Body() body) {
    throw new ForbiddenException()
  }

  // 绑定过滤器  没生效
  @Get('get5')
  async findAll() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      },
      HttpStatus.FORBIDDEN,
    )
  }
}
