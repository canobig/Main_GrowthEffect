import metricsClient from './metricsClient'
import { getMockUsageData, getMockModelUsageData, getMockAlertConfig } from '@/views/token-usage/mockData'

const USE_MOCK_DATA = true // Set to false when backend is ready

/**
 * Get token usage data for the specified time range
 * @param {string} timeRange - The time range (24h, 7d, 30d)
 * @returns {Promise<Object>} - The token usage data
 */
export const getTokenUsage = async (timeRange = '24h') => {
    if (USE_MOCK_DATA) {
        return getMockUsageData(timeRange)
    }

    try {
        const response = await metricsClient.get(`/token-usage?timeRange=${timeRange}`)
        return response.data
    } catch (error) {
        console.error('Error fetching token usage:', error)
        throw error
    }
}

/**
 * Get token usage data grouped by model
 * @param {string} timeRange - The time range (24h, 7d, 30d)
 * @returns {Promise<Object>} - The token usage data by model
 */
export const getTokenUsageByModel = async (timeRange = '24h') => {
    if (USE_MOCK_DATA) {
        return getMockModelUsageData(timeRange)
    }

    try {
        const response = await metricsClient.get(`/token-usage/by-model?timeRange=${timeRange}`)
        return response.data
    } catch (error) {
        console.error('Error fetching token usage by model:', error)
        throw error
    }
}

/**
 * Get token usage alert settings
 * @returns {Promise<Object>} - The alert settings
 */
export const getTokenUsageAlerts = async () => {
    if (USE_MOCK_DATA) {
        return getMockAlertConfig()
    }

    try {
        const response = await metricsClient.get('/token-usage/alerts')
        return response.data
    } catch (error) {
        console.error('Error fetching token usage alerts:', error)
        throw error
    }
}

/**
 * Update token usage alert settings
 * @param {Object} alertConfig - The alert configuration
 * @returns {Promise<Object>} - The updated alert settings
 */
export const updateTokenUsageAlert = async (alertConfig) => {
    if (USE_MOCK_DATA) {
        console.log('Mock: Updating alert config', alertConfig)
        return alertConfig
    }

    try {
        const response = await metricsClient.post('/token-usage/alerts', alertConfig)
        return response.data
    } catch (error) {
        console.error('Error updating token usage alert:', error)
        throw error
    }
}

/**
 * Get token usage forecast
 * @param {string} timeRange - The time range to forecast (7d, 30d)
 * @returns {Promise<Object>} - The forecast data
 */
export const getTokenUsageForecast = async (timeRange = '7d') => {
    if (USE_MOCK_DATA) {
        // Generate mock forecast data based on current usage patterns
        const currentUsage = await getMockUsageData(timeRange)
        const avgDailyTokens = currentUsage.aggregated.totalTokens / (timeRange === '7d' ? 7 : 30)
        const avgDailyCost = currentUsage.aggregated.totalCost / (timeRange === '7d' ? 7 : 30)

        return {
            forecastedTokens: avgDailyTokens * (timeRange === '7d' ? 7 : 30) * 1.1, // 10% growth
            forecastedCost: avgDailyCost * (timeRange === '7d' ? 7 : 30) * 1.1
        }
    }

    try {
        const response = await metricsClient.get(`/token-usage/forecast?timeRange=${timeRange}`)
        return response.data
    } catch (error) {
        console.error('Error fetching token usage forecast:', error)
        throw error
    }
}

/**
 * Export token usage report
 * @param {string} timeRange - The time range for the report
 * @param {string} format - The export format (csv, pdf)
 * @returns {Promise<Blob>} - The report file
 */
export const exportTokenUsageReport = async (timeRange = '30d', format = 'csv') => {
    if (USE_MOCK_DATA) {
        // Generate mock CSV data
        const data = await getMockUsageData(timeRange)
        const csvContent = [
            ['Date', 'Model', 'Prompt Tokens', 'Completion Tokens', 'Total Tokens', 'Cost'].join(','),
            ...data.usage.map((record) =>
                [
                    new Date(record.timestamp).toISOString(),
                    'All Models',
                    Math.floor(record.totalTokens * 0.4),
                    Math.floor(record.totalTokens * 0.6),
                    record.totalTokens,
                    record.cost.toFixed(4)
                ].join(',')
            )
        ].join('\n')

        return new Blob([csvContent], { type: 'text/csv' })
    }

    try {
        const response = await metricsClient.get(`/token-usage/export?timeRange=${timeRange}&format=${format}`, {
            responseType: 'blob'
        })
        return response.data
    } catch (error) {
        console.error('Error exporting token usage report:', error)
        throw error
    }
} 