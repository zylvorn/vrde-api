import { Router } from 'express'
import ContactUsecase from './usecase'
import AuthUseCase from '../auth/usecase'

const contactRouter = Router()
const usecase = new ContactUsecase()
const checkToken = AuthUseCase.checkToken
contactRouter.get('/', usecase.getContact)
contactRouter.post('/', checkToken, usecase.submitChangeData)

export default contactRouter
