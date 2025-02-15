import { subDays, subHours, addHours } from 'date-fns'

const generateMockData = (timeRange) => {
    const now = new Date()
    let startDate
    let dataPoints
    
    switch (timeRange) {
        case '24h':
            startDate = subHours(now, 24)
            dataPoints = 24
            break
        case '7d':
            startDate = subDays(now, 7)
            dataPoints = 7
            break
        case '30d':
            startDate = subDays(now, 30)
            dataPoints = 30
            break
        default:
            startDate = subHours(now, 24)
            dataPoints = 24
    }

    const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-2', 'gemini-pro']
    const data = []

    for (let i = 0; i < dataPoints; i++) {
        const timestamp = timeRange === '24h'
            ? addHours(startDate, i)
            : addHours(startDate, i * 24)

        const modelData = models.reduce((acc, model) => {
            const baseTokens = Math.floor(Math.random() * 10000) + 1000
            acc[model] = {
                promptTokens: Math.floor(baseTokens * 0.4),
                completionTokens: Math.floor(baseTokens * 0.6),
                totalTokens: baseTokens,
                cost: baseTokens * (model === 'gpt-4' ? 0.00003 : 0.00001)
            }
            return acc
        }, {})

        const totalTokens = Object.values(modelData).reduce((sum, m) => sum + m.totalTokens, 0)
        const totalCost = Object.values(modelData).reduce((sum, m) => sum + m.cost, 0)

        data.push({
            timestamp,
            totalTokens,
            cost: totalCost,
            ...Object.entries(modelData).reduce((acc, [model, data]) => ({
                ...acc,
                [`${model}_tokens`]: data.totalTokens,
                [`${model}_cost`]: data.cost
            }), {})
        })
    }

    return data
}

export const getMockUsageData = (timeRange) => {
    const data = generateMockData(timeRange)
    const totalTokens = data.reduce((sum, record) => sum + record.totalTokens, 0)
    const totalCost = data.reduce((sum, record) => sum + record.cost, 0)

    return {
        usage: data,
        aggregated: {
            totalTokens,
            totalCost,
            promptTokens: Math.floor(totalTokens * 0.4),
            completionTokens: Math.floor(totalTokens * 0.6)
        }
    }
}

export const getMockModelUsageData = (timeRange) => {
    const data = generateMockData(timeRange)
    const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-2', 'gemini-pro']
    
    return models.reduce((acc, model) => {
        const modelTokens = data.reduce((sum, record) => sum + record[`${model}_tokens`], 0)
        const modelCost = data.reduce((sum, record) => sum + record[`${model}_cost`], 0)
        
        acc[model] = {
            totalTokens: modelTokens,
            cost: modelCost,
            promptTokens: Math.floor(modelTokens * 0.4),
            completionTokens: Math.floor(modelTokens * 0.6)
        }
        return acc
    }, {})
}

export const getMockAlertConfig = () => ({
    dailyLimit: 50,
    monthlyLimit: 1000,
    emailNotifications: true,
    email: 'user@example.com'
}) 