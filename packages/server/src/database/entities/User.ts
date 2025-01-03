import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { IApiKey, IUser } from '../../Interface'

@Entity('user')
export class User implements IUser {
    id: string
    name: string
    surname: string
    userEmail: string
    encryptPass: string
    loginTimestamp: Date
    counter: number
    passUpdatedDate: Date
}
