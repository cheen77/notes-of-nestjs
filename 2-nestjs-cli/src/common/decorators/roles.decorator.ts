import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles); //roles是前端key , ['admin'] 是一个特定的值 ，附加到 findAll() 方法
