import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'

import type { Request } from 'express'
@Injectable()
export class RolesGuard implements CanActivate {
  // 注入依赖  为了访问路由的角色(自定义元数据)，我们将使用在 @nestjs/core 中提供的 Reflector 帮助类。
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    console.log('经过了守卫', context)

    const roles = this.reflector.get<string[]>('roles', context.getHandler()) //与key对应
    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    if (roles.includes(request.query.role as string)) {
      return true
    } else {
      return false
    }
  }
}
