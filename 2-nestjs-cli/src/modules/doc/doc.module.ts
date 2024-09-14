import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common' //包含中间件的模块必须实现 NestModule 接口
import { DocService } from './doc.service'
import { DocController } from './doc.controller'
// 引入中间件
import { LoggerMiddleware } from '../../middleware/logger/logger.middleware'

@Module({
  controllers: [DocController],
  providers: [DocService],
  exports: [DocService],
})
export class DocModule implements NestModule {
  //使用方法 在模块里面 实现 configure 返回一个消费者  consumer 通过 apply 注册中间件 通过forRoutes 指定  Controller 路由
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('doc')  //指定 Controller 路由1
    consumer.apply(LoggerMiddleware).forRoutes({ path: 'doc/get1', method: RequestMethod.GET }) //也可以指定 拦截的方法 比如拦截GET  POST 等 forRoutes 使用对象配置
    // consumer.apply(LoggerMiddleware).forRoutes(DocController) //你甚至可以直接吧 UserController 塞进去
  }
}
