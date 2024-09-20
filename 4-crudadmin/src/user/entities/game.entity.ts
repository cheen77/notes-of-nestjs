import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, ManyToMany } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @ManyToMany(() => User, (user) => user.games)
  users: User[]
}
