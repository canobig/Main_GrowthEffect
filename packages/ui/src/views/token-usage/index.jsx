import { useState, useEffect } from 'react'
import {
    Grid,
    Box,
    Card,
    Typography,
    Stack,
    IconButton,
    MenuItem,
    Menu,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Switch,
    FormControlLabel,
    Alert,
    Tooltip,
    CircularProgress
} from '@mui/material'
import {
    IconDotsVertical,
    IconClock,
    IconAlertTriangle,
    IconDownload,
    IconRefresh,
    IconSettings
} from '@tabler/icons-react'
import MainCard from '@/ui-component/cards/MainCard'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts'
import { formatNumber } from '@/utils/generic'
import { getTokenUsage, getTokenUsageByModel, getTokenUsageAlerts, updateTokenUsageAlert } from '@/api/tokenUsage'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE']

const TokenUsageDashboard = () => {
    const [timeRange, setTimeRange] = useState('24h')
    const [anchorEl, setAnchorEl] = useState(null)
    const [usageData, setUsageData] = useState([])
    const [modelUsage, setModelUsage] = useState({})
    const [totalTokens, setTotalTokens] = useState(0)
    const [totalCost, setTotalCost] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [alertDialogOpen, setAlertDialogOpen] = useState(false)
    const [alertConfig, setAlertConfig] = useState({
        dailyLimit: 0,
        monthlyLimit: 0,
        emailNotifications: true,
        email: ''
    })

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    const handleTimeRangeChange = async (range) => {
        setTimeRange(range)
        handleMenuClose()
        await fetchData(range)
    }

    const fetchData = async (selectedTimeRange = timeRange) => {
        setLoading(true)
        setError(null)
        try {
            const [usageResponse, modelUsageResponse, alertResponse] = await Promise.all([
                getTokenUsage(selectedTimeRange),
                getTokenUsageByModel(selectedTimeRange),
                getTokenUsageAlerts()
            ])

            setUsageData(usageResponse.usage)
            setModelUsage(modelUsageResponse)
            setTotalTokens(usageResponse.aggregated.totalTokens)
            setTotalCost(usageResponse.aggregated.totalCost)
            setAlertConfig(alertResponse)
        } catch (err) {
            setError('Failed to fetch token usage data')
            console.error('Error fetching data:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleAlertConfigSave = async () => {
        try {
            await updateTokenUsageAlert(alertConfig)
            setAlertDialogOpen(false)
        } catch (err) {
            setError('Failed to update alert configuration')
            console.error('Error updating alert config:', err)
        }
    }

    const handleExport = () => {
        const csvContent = [
            ['Date', 'Model', 'Prompt Tokens', 'Completion Tokens', 'Total Tokens', 'Cost'].join(','),
            ...usageData.map((record) =>
                [
                    new Date(record.timestamp).toISOString(),
                    record.modelName,
                    record.promptTokens,
                    record.completionTokens,
                    record.totalTokens,
                    record.cost
                ].join(',')
            )
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `token-usage-${timeRange}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const modelUsageData = Object.entries(modelUsage).map(([model, data]) => ({
        name: model,
        value: data.totalTokens
    }))

    return (
        <Box>
            <MainCard
                title={
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Typography variant="h3">Token Usage Dashboard</Typography>
                        <Stack direction="row" spacing={1}>
                            <Tooltip title="Refresh Data">
                                <IconButton onClick={() => fetchData()} size="small">
                                    <IconRefresh />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Export Data">
                                <IconButton onClick={handleExport} size="small">
                                    <IconDownload />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Alert Settings">
                                <IconButton onClick={() => setAlertDialogOpen(true)} size="small">
                                    <IconSettings />
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={handleMenuClick} size="small">
                                <IconDotsVertical />
                            </IconButton>
                        </Stack>
                    </Stack>
                }
            >
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => handleTimeRangeChange('24h')}>Last 24 Hours</MenuItem>
                    <MenuItem onClick={() => handleTimeRangeChange('7d')}>Last 7 Days</MenuItem>
                    <MenuItem onClick={() => handleTimeRangeChange('30d')}>Last 30 Days</MenuItem>
                </Menu>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {/* Summary Cards */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ p: 2 }}>
                                <Stack spacing={1}>
                                    <Typography variant="h6" color="textSecondary">
                                        Total Tokens Used
                                    </Typography>
                                    <Typography variant="h4">{formatNumber(totalTokens)}</Typography>
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ p: 2 }}>
                                <Stack spacing={1}>
                                    <Typography variant="h6" color="textSecondary">
                                        Estimated Cost
                                    </Typography>
                                    <Typography variant="h4">${totalCost.toFixed(2)}</Typography>
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ p: 2 }}>
                                <Stack spacing={1}>
                                    <Typography variant="h6" color="textSecondary">
                                        Daily Limit Usage
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="h4">
                                            {alertConfig.dailyLimit > 0
                                                ? `${((totalCost / alertConfig.dailyLimit) * 100).toFixed(1)}%`
                                                : 'No Limit'}
                                        </Typography>
                                        {alertConfig.dailyLimit > 0 && totalCost >= alertConfig.dailyLimit && (
                                            <IconAlertTriangle color="error" />
                                        )}
                                    </Stack>
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ p: 2 }}>
                                <Stack spacing={1}>
                                    <Typography variant="h6" color="textSecondary">
                                        Time Range
                                    </Typography>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <IconClock size={20} />
                                        <Typography variant="h6">
                                            {timeRange === '24h'
                                                ? 'Last 24 Hours'
                                                : timeRange === '7d'
                                                ? 'Last 7 Days'
                                                : 'Last 30 Days'}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Card>
                        </Grid>

                        {/* Usage Charts */}
                        <Grid item xs={12} md={8}>
                            <Card sx={{ p: 2 }}>
                                <Typography variant="h5" mb={2}>
                                    Token Usage Over Time
                                </Typography>
                                <Box sx={{ width: '100%', height: 400 }}>
                                    <ResponsiveContainer>
                                        <LineChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="timestamp"
                                                tickFormatter={(timestamp) =>
                                                    new Date(timestamp).toLocaleDateString()
                                                }
                                            />
                                            <YAxis />
                                            <RechartsTooltip
                                                formatter={(value, name) => [
                                                    formatNumber(value),
                                                    name === 'cost' ? 'Cost ($)' : name
                                                ]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="totalTokens"
                                                stroke="#8884d8"
                                                name="Total Tokens"
                                            />
                                            <Line type="monotone" dataKey="cost" stroke="#82ca9d" name="Cost ($)" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Card>
                        </Grid>

                        {/* Model Distribution */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ p: 2 }}>
                                <Typography variant="h5" mb={2}>
                                    Usage by Model
                                </Typography>
                                <Box sx={{ width: '100%', height: 400 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={modelUsageData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                                }
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {modelUsageData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </MainCard>

            {/* Alert Configuration Dialog */}
            <Dialog open={alertDialogOpen} onClose={() => setAlertDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Token Usage Alert Settings</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 2 }}>
                        <TextField
                            label="Daily Cost Limit ($)"
                            type="number"
                            value={alertConfig.dailyLimit}
                            onChange={(e) =>
                                setAlertConfig((prev) => ({ ...prev, dailyLimit: parseFloat(e.target.value) }))
                            }
                            fullWidth
                        />
                        <TextField
                            label="Monthly Cost Limit ($)"
                            type="number"
                            value={alertConfig.monthlyLimit}
                            onChange={(e) =>
                                setAlertConfig((prev) => ({ ...prev, monthlyLimit: parseFloat(e.target.value) }))
                            }
                            fullWidth
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={alertConfig.emailNotifications}
                                    onChange={(e) =>
                                        setAlertConfig((prev) => ({
                                            ...prev,
                                            emailNotifications: e.target.checked
                                        }))
                                    }
                                />
                            }
                            label="Email Notifications"
                        />
                        {alertConfig.emailNotifications && (
                            <TextField
                                label="Email Address"
                                type="email"
                                value={alertConfig.email}
                                onChange={(e) => setAlertConfig((prev) => ({ ...prev, email: e.target.value }))}
                                fullWidth
                            />
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAlertDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAlertConfigSave} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default TokenUsageDashboard 