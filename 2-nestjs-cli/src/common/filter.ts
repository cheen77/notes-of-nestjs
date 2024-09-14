import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

// 实现一个 HttpExceptionFilter类 接收异常信息

// @Catch() 装饰器绑定所需的元数据到异常过滤器上。它告诉 Nest这个特定的过滤器正在寻找 HttpException 而不是其他的。

@Catch(HttpException)
// 所有异常过滤器都应该实现通用的 ExceptionFilter<T> 接口
export class HttpExceptionFilter implements ExceptionFilter {
  //   它需要你使用有效签名提供 catch(exception: T, host: ArgumentsHost)方法
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // console.log("错误信息", exception);

    response.status(status).json({
      code: status,
      data: exception.message,
      message: "失败",
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
