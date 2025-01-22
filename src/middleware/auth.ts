import type { Request, Response, NextFunction } from "express"

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.userId) {
    next()
  } else {
    res.status(401).json({ error: "Unauthorized" })
  }
}

export const createSession = (req: Request, userId: number) => {
  if (req.session) {
    req.session.userId = userId
    req.session.createdAt = Date.now()
  } else {
    throw new Error("Session is not initialized")
  }
}

export const refreshSession = (req: Request) => {
  if (req.session && req.session.userId) {
    req.session.createdAt = Date.now()
  }
}
