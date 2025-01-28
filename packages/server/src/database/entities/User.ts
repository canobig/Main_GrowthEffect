import { Column, Entity, PrimaryColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'
import { IApiKey, IUser } from '../../Interface'

@Entity('user')
export class User implements IUser {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column()
    name: string
    @Column()
    surname: string
    @Column()
    userEmail: string
    @Column()
    encryptPass: string
    @Column()
    loginTimestamp: Date
    @Column()
    counter: number
    @Column()
    passUpdatedDate: Date
}
