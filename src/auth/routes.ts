import { Router } from 'express'
import AuthUseCase from './usecase'

const authRouter = Router()
const usecase = new AuthUseCase()
authRouter.post('/', usecase.login)
authRouter.get('/verify', usecase.verify)
export default authRouter
