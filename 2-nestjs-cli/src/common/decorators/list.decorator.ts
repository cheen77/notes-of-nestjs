import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const List = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  //   return request.list

  const list = request.list

  return data ? list && list[data] : list
})
