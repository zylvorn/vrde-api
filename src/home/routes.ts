import { Router } from 'express'
import HomeUsecase from './usecase'
import AuthUseCase from '../auth/usecase'
import multer from 'multer'

const homeRouter = Router()
const usecase = new HomeUsecase()
const checkToken = AuthUseCase.checkToken
const multerMiddleWare = multer({ storage: multer.memoryStorage() }).single(
  'file'
)
homeRouter.get('/', usecase.getHome)
homeRouter.post('/', checkToken, multerMiddleWare, usecase.submitChangeData)

export default homeRouter
