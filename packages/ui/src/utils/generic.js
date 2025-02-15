/**
 * Format a number with commas as thousand separators
 * @param {number} num - The number to format
 * @returns {string} - The formatted number
 */
export const formatNumber = (num) => {
    if (num === null || num === undefined) return '0'
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Format a number to a compact representation (e.g., 1.2K, 1.2M)
 * @param {number} num - The number to format
 * @returns {string} - The formatted number
 */
export const formatCompactNumber = (num) => {
    if (num === null || num === undefined) return '0'
    if (num < 1000) return num.toString()
    
    const suffixes = ['', 'K', 'M', 'B', 'T']
    const magnitude = Math.floor(Math.log10(num) / 3)
    const scaled = num / Math.pow(1000, magnitude)
    const formatted = scaled.toFixed(1).replace(/\.0$/, '')
    return `${formatted}${suffixes[magnitude]}`
}

/**
 * Format a price/cost value to currency format
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'USD')
 * @returns {string} - The formatted amount
 */
export const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '$0.00'
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount)
}

/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format to use (short, medium, long)
 * @returns {string} - The formatted date
 */
export const formatDate = (date, format = 'medium') => {
    if (!date) return ''
    const d = new Date(date)
    const options = {
        short: { month: 'numeric', day: 'numeric' },
        medium: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }
    }
    return d.toLocaleDateString('en-US', options[format])
}

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - The maximum length
 * @returns {string} - The truncated string
 */
export const truncateString = (str, length = 50) => {
    if (!str) return ''
    if (str.length <= length) return str
    return str.substring(0, length) + '...'
}

/**
 * Calculate percentage and format it
 * @param {number} part - The part value
 * @param {number} total - The total value
 * @param {number} decimals - Number of decimal places
 * @returns {string} - The formatted percentage
 */
export const calculatePercentage = (part, total, decimals = 1) => {
    if (!total) return '0%'
    const percentage = (part / total) * 100
    return `${percentage.toFixed(decimals)}%`
} 