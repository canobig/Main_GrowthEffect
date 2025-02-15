import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm'

@Entity()
export class TokenUsage {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    modelName: string

    @Column()
    promptTokens: number

    @Column()
    completionTokens: number

    @Column()
    totalTokens: number

    @Column('decimal', { precision: 10, scale: 4 })
    cost: number

    @Column()
    userId: string

    @Column({ nullable: true })
    chatflowId: string

    @Column({ nullable: true })
    agentflowId: string

    @CreateDateColumn()
    @Index()
    timestamp: Date
}

@Entity()
export class TokenUsageAlert {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    userId: string

    @Column('decimal', { precision: 10, scale: 2 })
    dailyLimit: number

    @Column('decimal', { precision: 10, scale: 2 })
    monthlyLimit: number

    @Column({ default: true })
    emailNotifications: boolean

    @Column({ nullable: true })
    email: string

    @CreateDateColumn()
    createdAt: Date

    @Column({ type: 'timestamp', nullable: true })
    lastNotificationSent: Date
} 