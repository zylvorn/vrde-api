import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import logger from 'morgan'
import compression from 'compression'
import bodyParser from 'body-parser'
import router from './routes'
import path from 'path'

import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(cors())
const staticPath = path.join(__dirname, 'static')
app.use('/static', (_, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=2592000') // 1 month
  next()
})
app.use('/static', express.static(staticPath))

const port = process.env.PORT || 8080
app.use(helmet())
app.use(logger('dev'))

app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(compression())
app.use('/api', router)
app.listen(port, () => {
  console.log(`VRDE-API start in port ${port}`)
})
