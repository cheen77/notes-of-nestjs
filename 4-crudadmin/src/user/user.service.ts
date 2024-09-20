import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { Repository, Like } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { OneToOneDto } from './dto/oneToOneDto'
import { Profile } from './entities/profile.entity'
import { OneToManyDto } from './dto/oneToManyDto'
import { BankCard } from './entities/bankCard.entity'
import { Game } from './entities/game.entity'

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
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
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
    return this.userRepository.update(id, updateUserDto)
  }

  remove(id: string) {
    return this.userRepository.delete(id)
  }

  async oneToOneApi(oneToOneApi: OneToOneDto) {
    const profile = new Profile()
    profile.name = oneToOneApi.name
    profile.code = oneToOneApi.code
    const userInfo = await this.userRepository.findOne({
      where: {
        id: oneToOneApi.id,
      },
    })
    userInfo.profile = profile
    // await this.profileRepository.save(profile)
    await this.userRepository.save(userInfo) //注意我们级联关系绑在那边，就是用那边进行数据库操作
    return true
  }

  async getOneToOne() {
    // return this.userRepository.find({
    //   //查询的时候如果需要联合查询需要增加 relations
    //   relations: ['profile'],
    // })

    return this.profileRepository.find({
      //查询的时候如果需要联合查询需要增加 relations
      relations: ['user'],
    })
  }

  async oneToManyApi(oneToManyApi: OneToManyDto) {
    const bankCard = new BankCard()
    bankCard.name = oneToManyApi.name
    bankCard.cardNumber = oneToManyApi.cardNumber

    const userInfo = await this.userRepository.findOne({
      where: {
        id: oneToManyApi.id,
      },
    })

    userInfo.bankCards = [bankCard]
    await this.userRepository.save(userInfo) //注意我们级联关系绑在那边，就是用那边进行数据库操作
    return true //一定是多对一 多的那一边带着一的id
  }

  async getOneToMany() {
    return this.userRepository.find({
      //查询的时候如果需要联合查询需要增加 relations
      relations: ['bankCards'],
    })
  }

  async manyToManyApi(params: { tags: string[]; userId: string }) {
    console.log(params)
    const gamelist: Game[] = []
    for (let index = 0; index < params.tags.length; index++) {
      const game = new Game()
      game.name = params.tags[index]
      gamelist.push(game)
    }
    const userInfo = await this.userRepository.findOne({
      where: {
        id: params.userId,
      },
    })
    userInfo.games = gamelist
    await this.userRepository.save(userInfo)
    return true
  }

  async getManyToMany() {
    // return this.userRepository.find({
    //   relations: ['games'],
    // })

    return this.gameRepository.find({
      relations: ['users'],
    })
  }
}
