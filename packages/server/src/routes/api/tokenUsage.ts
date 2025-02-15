import express, { Request, Response, NextFunction } from 'express'
import { TokenUsageService } from '../../services/TokenUsageService'
import { authenticate } from '../../middleware/auth'

const router = express.Router()
const tokenUsageService = new TokenUsageService()

interface AuthenticatedRequest extends Request {
    user: {
        id: string
    }
}

type AsyncRequestHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => Promise<void>

const asyncHandler = (fn: AsyncRequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as AuthenticatedRequest, res, next)).catch(next)
}

// Get token usage for the authenticated user
router.get(
    '/token-usage',
    authenticate,
    asyncHandler(async (req, res) => {
        const timeRange = req.query.timeRange as string
        const usage = await tokenUsageService.getUsage(req.user.id, timeRange)
        res.json(usage)
    })
)

// Get token usage by model
router.get(
    '/token-usage/by-model',
    authenticate,
    asyncHandler(async (req, res) => {
        const timeRange = req.query.timeRange as string
        const usage = await tokenUsageService.getUsageByModel(req.user.id, timeRange)
        res.json(usage)
    })
)

// Get token usage alerts
router.get(
    '/token-usage/alerts',
    authenticate,
    asyncHandler(async (req, res) => {
        const alert = await tokenUsageService.getAlert(req.user.id)
        res.json(alert || {})
    })
)

// Update token usage alerts
router.post(
    '/token-usage/alerts',
    authenticate,
    asyncHandler(async (req, res) => {
        const alertConfig = req.body
        const alert = await tokenUsageService.updateAlert(req.user.id, alertConfig)
        res.json(alert)
    })
)

export default router 