import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

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
}
