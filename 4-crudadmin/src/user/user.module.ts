import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Profile } from './entities/profile.entity'
import { BankCard } from './entities/bankCard.entity'
import { Game } from './entities/game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, BankCard, Game])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
