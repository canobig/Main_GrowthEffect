import { getRepository, Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm'
import { TokenUsage, TokenUsageAlert } from '../models/TokenUsage'
import { startOfDay, endOfDay, subHours, subDays, startOfMonth, endOfMonth } from 'date-fns'
import { MetricsService } from './MetricsService'

interface ModelUsage {
    totalTokens: number
    cost: number
    promptTokens: number
    completionTokens: number
}

interface ModelUsageMap {
    [key: string]: ModelUsage
}

export class TokenUsageService {
    private tokenUsageRepo = getRepository(TokenUsage)
    private alertRepo = getRepository(TokenUsageAlert)
    private metricsService = MetricsService.getInstance()

    async recordUsage(data: {
        modelName: string
        promptTokens: number
        completionTokens: number
        totalTokens: number
        cost: number
        userId: string
        chatflowId?: string
        agentflowId?: string
    }) {
        const usage = this.tokenUsageRepo.create(data)
        await this.tokenUsageRepo.save(usage)

        this.metricsService.recordTokenUsage(data)

        await this.checkAlerts(data.userId)
        return usage
    }

    async getUsage(userId: string, timeRange: string = '24h') {
        const now = new Date()
        let startDate: Date

        switch (timeRange) {
            case '24h':
                startDate = subHours(now, 24)
                break
            case '7d':
                startDate = subDays(now, 7)
                break
            case '30d':
                startDate = subDays(now, 30)
                break
            default:
                startDate = subHours(now, 24)
        }

        const usage = await this.tokenUsageRepo.find({
            where: {
                userId,
                timestamp: Between(startDate, now)
            },
            order: {
                timestamp: 'ASC'
            }
        })

        return this.aggregateUsageData(usage)
    }

    async getUsageByModel(userId: string, timeRange: string = '24h'): Promise<ModelUsageMap> {
        const { usage } = await this.getUsage(userId, timeRange)
        
        const modelUsage = usage.reduce((acc: ModelUsageMap, record) => {
            if (!acc[record.modelName]) {
                acc[record.modelName] = {
                    totalTokens: 0,
                    cost: 0,
                    promptTokens: 0,
                    completionTokens: 0
                }
            }
            
            acc[record.modelName].totalTokens += record.totalTokens
            acc[record.modelName].cost += Number(record.cost)
            acc[record.modelName].promptTokens += record.promptTokens
            acc[record.modelName].completionTokens += record.completionTokens
            
            return acc
        }, {})

        return modelUsage
    }

    async getDailyUsage(userId: string) {
        const today = new Date()
        const usage = await this.tokenUsageRepo.find({
            where: {
                userId,
                timestamp: Between(startOfDay(today), endOfDay(today))
            }
        })

        return this.aggregateUsageData(usage)
    }

    async getMonthlyUsage(userId: string) {
        const today = new Date()
        const usage = await this.tokenUsageRepo.find({
            where: {
                userId,
                timestamp: Between(startOfMonth(today), endOfMonth(today))
            }
        })

        return this.aggregateUsageData(usage)
    }

    private aggregateUsageData(usage: TokenUsage[]) {
        const aggregated = usage.reduce(
            (acc, record) => {
                acc.totalTokens += record.totalTokens
                acc.totalCost += Number(record.cost)
                acc.promptTokens += record.promptTokens
                acc.completionTokens += record.completionTokens
                return acc
            },
            { totalTokens: 0, totalCost: 0, promptTokens: 0, completionTokens: 0 }
        )

        return {
            usage,
            aggregated
        }
    }

    async getAlert(userId: string) {
        return this.alertRepo.findOne({ where: { userId } })
    }

    async updateAlert(userId: string, alertConfig: Partial<TokenUsageAlert>) {
        let alert = await this.alertRepo.findOne({ where: { userId } })
        
        if (!alert) {
            alert = this.alertRepo.create({ userId, ...alertConfig })
        } else {
            Object.assign(alert, alertConfig)
        }
        
        return this.alertRepo.save(alert)
    }

    private async checkAlerts(userId: string) {
        const alert = await this.getAlert(userId)
        if (!alert || !alert.emailNotifications) return

        const [dailyUsage, monthlyUsage] = await Promise.all([
            this.getDailyUsage(userId),
            this.getMonthlyUsage(userId)
        ])

        const shouldNotify =
            dailyUsage.aggregated.totalCost >= alert.dailyLimit ||
            monthlyUsage.aggregated.totalCost >= alert.monthlyLimit

        if (shouldNotify) {
            // TODO: Implement notification service
            alert.lastNotificationSent = new Date()
            await this.alertRepo.save(alert)
        }
    }
} 