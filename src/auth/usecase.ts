import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

class AuthUseCase {
  async login(req: Request, res: Response) {
    const { username, password } = req.body
    const invalidUsername = username !== process.env.ADMIN_USERNAME
    const invalidPassword = password !== process.env.ADMIN_PASSWORD
    console.log('body', username, password)
    console.log('env', process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD)
    if (invalidPassword || invalidUsername) {
      res.status(401).json({
        error: 'Invalid Username or Password',
      })
      return
    }
    const payload = {
      username,
      password,
    }
    const sk = process.env.ADMIN_SECRET_KEY || ''
    const token = jwt.sign(payload, sk, {
      expiresIn: '24h',
    })
    res.status(200).json({
      token,
      error: null,
    })
  }
  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization
      const token = authHeader?.split(' ')[1]
      if (!token) {
        res.status(401).json({
          error: 'Invalid token',
        })
        return
      }
      const validJWT = jwt.verify(
        token,
        process.env.ADMIN_SECRET_KEY || ''
      ) as { username: string; password: string }
      const { username, password } = validJWT
      const validUsername = username === process.env.ADMIN_USERNAME
      const validPassword = password === process.env.ADMIN_PASSWORD
      if (validUsername && validPassword) {
        res.status(201).json({
          status: 'OK',
        })
        return
      }
      res.status(401).json({
        error: 'Invalid token',
      })
    } catch (error) {
      res.status(401).json({
        error: String(error),
      })
    }
  }
  static async checkToken(req: Request, res: Response, next: NextFunction) {
    try {
      const secretKey = process.env.ADMIN_SECRET_KEY
      if (!secretKey) {
        return next(new Error('Server configuration error'))
      }
      const authHeader = req.headers.authorization
      const token = authHeader?.split(' ')[1]
      if (!token) {
        return next(new Error('Invalid token'))
      }
      const validJWT = jwt.verify(token, secretKey) as {
        username: string
        password: string
      }
      const { username, password } = validJWT
      const validUsername = username === process.env.ADMIN_USERNAME
      const validPassword = password === process.env.ADMIN_PASSWORD
      if (validUsername && validPassword) {
        return next()
      }

      return next(new Error('Invalid token'))
    } catch (error) {
      return next(error)
    }
  }
}
export default AuthUseCase
