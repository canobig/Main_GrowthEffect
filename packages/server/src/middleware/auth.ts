import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthenticatedRequest extends Request {
    user?: {
        id: string
        [key: string]: any
    }
}

export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' })
        }

        const token = authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
        req.user = decoded as { id: string }
        next()
    } catch (error) {
        console.error('Authentication error:', error)
        res.status(401).json({ error: 'Invalid token' })
    }
} 