import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Repository, Like } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'

/**
    1.引入 InjectRepository typeOrm 依赖注入 接受一个实体
    2.引入类型 Repository 接受实体泛型
    3.Like 用于模糊查询
    4.save 保存  find 查询 update 更新 delete 删除
 */

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const data = new User()
    data.name = createUserDto.name
    data.desc = createUserDto.desc
    return this.userRepository.save(data)
  }

  async findAll(query: { keyWord: string; page: number; pageSize: number }) {
    const data = await this.userRepository.find({
      where: {
        name: Like(`%${query.keyWord}%`),
      },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      order: { id: 'DESC' },
    })
    const total = await this.userRepository.count({
      where: {
        name: Like(`%${query.keyWord}%`),
      },
    })

    // const where = { name: Like(`%${query.keyWord}%`) }
    // const [data, total] = await Promise.all([
    //   this.userRepository.find({
    //     where,
    //     order: { id: 'DESC' },
    //     skip: (query.page - 1) * query.pageSize,
    //     take: query.pageSize,
    //   }),
    //   this.userRepository.count({ where }),
    // ])

    return {
      data,
      total,
    }
  }

  findOne(id: string) {
    return `This action returns a #${id} user`
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log('id', id, updateUserDto)

    return this.userRepository.update(id, updateUserDto)
  }

  remove(id: string) {
    return this.userRepository.delete(id)
  }
}
