import { Router } from 'express'
import AboutUseCase from './usecase'
import AuthUseCase from '../auth/usecase'
import multer from 'multer'

const aboutRouter = Router()
const usecase = new AboutUseCase()
const checkToken = AuthUseCase.checkToken

const multerMiddleWare = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'images' },
])
aboutRouter.get('/', usecase.getData)
aboutRouter.post('/sections', checkToken, usecase.submitSections)
aboutRouter.post(
  '/clients',
  checkToken,
  multerMiddleWare,
  usecase.submitClients
)
export default aboutRouter
