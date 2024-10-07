import { Router } from 'express'
import homeRouter from './home/routes'
import aboutRouter from './about/routes'
import authRouter from './auth/routes'
import contactRouter from './contacts/routes'
import projectsRouter from './projects/router'

const router = Router()
router.use('/home', homeRouter)
router.use('/about', aboutRouter)
router.use('/auth', authRouter)
router.use('/contacts', contactRouter)
router.use('/projects', projectsRouter)
export default router
