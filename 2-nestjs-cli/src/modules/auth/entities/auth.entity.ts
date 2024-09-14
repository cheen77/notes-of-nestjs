import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    token: string

    @CreateDateColumn()
    createdTime: Date
}
