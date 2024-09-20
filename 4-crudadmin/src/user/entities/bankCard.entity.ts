import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, ManyToOne } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class BankCard {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  cardNumber: number

  @ManyToOne(() => User, (user) => user.bankCards)
  user: User
}
