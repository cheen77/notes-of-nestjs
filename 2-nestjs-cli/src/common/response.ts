import {
  NestInterceptor,
  CallHandler,
  Injectable,
  ExecutionContext,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
interface data<T> {
  data: T;
}

// 需要实现实现 NestInterceptor 接口 。 需要implements NestInterceptor
// 拦截器类
@Injectable()
export class iResponse<T = any> implements NestInterceptor {
  /**
   *
   * @param context  传递给原始处理程序的参数
   * @param next  包装执行流的对象
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<data<T>> {
    // console.log("next", next);
    // console.log("context", context);
    // 由于 handle() 返回一个RxJS Observable，我们有很多种操作符可以用来操作流。
    return next.handle().pipe(
      map((data) => {
        return {
          code: 1000,
          data,
          message: "成功",
          success: true,
        };
      })
    );
  }
}
