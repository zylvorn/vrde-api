import { Router } from 'express'
import ProjectUsecase from './usecase'
import AuthUseCase from '../auth/usecase'
import multer from 'multer'

const projectsRouter = Router()
const usecase = new ProjectUsecase()
const checkToken = AuthUseCase.checkToken

const multerMiddleWare = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'images' },
])
projectsRouter.get('/', usecase.getProject)
projectsRouter.get('/tags', usecase.getTags)
projectsRouter.get('/html', usecase.getHTML)
projectsRouter.get('/getID/:id', usecase.getProjectByID)
projectsRouter.put('/tags', checkToken, usecase.updateTags)
projectsRouter.post(
  '/project',
  checkToken,
  multerMiddleWare,
  usecase.createProject
)
projectsRouter.put(
  '/project',
  checkToken,
  multerMiddleWare,
  usecase.updateProject
)
projectsRouter.post('/editor', checkToken, usecase.updateEditor)
projectsRouter.delete('/project/:id', checkToken, usecase.deleteProject)
export default projectsRouter
