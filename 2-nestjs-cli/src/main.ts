import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType, ValidationPipe } from "@nestjs/common";

import { Request, Response, NextFunction } from "express";

// useStaticAssets prefix 是虚拟前缀
import { NestExpressApplication } from "@nestjs/platform-express";

import { join } from "path";

// 注册全局响应拦截器
import { iResponse } from "./common/response";

// 注册全局异常过滤器
import { HttpExceptionFilter } from "./common/filter";

// swagger
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


// 全局中间件只能使用函数模式
// const whiteList = ['/doc1']

// function middlewareAll(req: Request, res: Response, next: NextFunction) {
//   console.log('app middleware', req.originalUrl)

//   if (whiteList.includes(req.originalUrl)) {
//     next()
//   } else {
//     res.send('白名单拦截')
//   }
// }
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); //nestjs默认使用express
  // const app = await NestFactory.create<NestFastifyApplication>(ApplicationModule, new FastifyAdapter()); //改用fastify

  // 全局路由前缀
  app.setGlobalPrefix("api", {
    //排除/路由
    exclude: ["/"],
  });

  // swagger
  const options = new DocumentBuilder()
    .setTitle('API example')
    .setDescription("api接口集合")
    .setVersion("1.0")
    // .setBasePath("api")// 添加全局前缀
    // .addTag('all')
    // .addSecurity('basic', {
    //   type: 'http',
    //   scheme: 'basic'
    // })
    // .addBasicAuth()
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: false //不忽略通过 setGlobalPrefix() 设置的路由的全局前缀
  })

  SwaggerModule.setup('/api-docs', app, document);  //  localhost:3000/api 访问

  //查看静态资源   useStaticAssets prefix 是虚拟前缀
  app.useStaticAssets(join(__dirname, "uploadImages"), { prefix: "/img" }); //与前端静态资源路径一致

  // 版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });



  // 全局响应拦截器
  app.useGlobalInterceptors(new iResponse());

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局ValidationPipe管道
  app.useGlobalPipes(new ValidationPipe())

  // 全局中间件
  // app.use(middlewareAll)

  await app.listen(3000);
}
bootstrap();
