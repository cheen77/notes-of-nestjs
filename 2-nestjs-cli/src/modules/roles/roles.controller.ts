import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiTags } from "@nestjs/swagger";

@Controller('roles')
@ApiTags("roles")
@UseGuards(RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }


  // 一个简单例子
  @Get()
  // 不推荐直接这样写，建议应该创建你自己的装饰器。
  // @SetMetadata('roles', ['admin']) //roles是前端key , ['admin'] 是一个特定的值 ，附加到 findAll() 方法

  @Roles('admin')
  findAll() {
    return this.rolesService.findAll();
  }

}
