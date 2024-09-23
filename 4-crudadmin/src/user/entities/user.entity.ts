import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn, OneToMany, JoinTable, ManyToMany } from 'typeorm'
import { Profile } from './profile.entity'
import { BankCard } from './bankCard.entity'
import { Game } from './game.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string
  @Column({ type: 'varchar' })
  name: string
  @Column({ type: 'varchar' })
  desc: string
  @CreateDateColumn({ type: 'timestamp' })
  createdTime: Date

  // 一对一
  @JoinColumn() //必选项并且只能在关系的一侧设置。 你设置@JoinColumn的哪一方，哪一方的表将包含一个"relation id"和目标实体表的外键。
  @OneToOne(() => Profile, {
    cascade: true, // 级联操作,启用级联后，只需一次save调用即可保存此关系。
    onDelete: 'CASCADE', // 删除user时，自动删除profile
    onUpdate: 'CASCADE', // 更新user时，自动更新profile
  })
  profile: Profile

  // 一对多  第一个参数是个函数返回关联的BankCard类 所以在bankCard表关联user ,  第二个参数 创建双向关系
  @OneToMany(() => BankCard, (bankCard) => bankCard.user, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  bankCards: BankCard[]

  // 多对多
  @JoinTable() // 多对多关系 必须把@JoinTable放在关系的一个（拥有）方面。
  @ManyToMany(() => Game, (game) => game.users, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  games: Game[]

  @Column({ type: 'int' })
  age: number
}
