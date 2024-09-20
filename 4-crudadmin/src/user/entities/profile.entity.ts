import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    type: 'bigint',
    comment: '身份证号',
  })
  code: number

  @Column({
    type: 'varchar',
    comment: '姓名',
  })
  name: string

  @OneToOne(() => User, (user) => user.profile) // 将另一面指定为第二个参数
  user: User
}
