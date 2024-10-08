import { NextFunction, Request, Response } from 'express'
import data from '../data/about.json'
import fs from 'fs'
import path from 'path'

type TClientFE = {
  id: string
  name: string
  image: { name: string }
  isExistingImage?: boolean
}
type TClient = {
  id: string
  name: string
  image: string
}
const removeAllFiles = () => {
  const folderPath = path.join(__dirname, '../static/about')
  const files = fs.readdirSync(folderPath)
  files.forEach((file) => {
    const filePath = path.join(folderPath, file)
    fs.unlinkSync(filePath)
  })
}
class AboutUseCase {
  async getData(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(data)
  }
  async submitSections(req: Request, res: Response, next: NextFunction) {
    try {
      let tempData = data
      const { sections } = req.body
      tempData.sections = sections
      fs.writeFileSync(
        path.join(__dirname, '../data/about.json'),
        JSON.stringify(tempData)
      )
      res.status(200).json({ data: tempData, error: null })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
  async submitClients(req: Request, res: Response, next: NextFunction) {
    try {
      let tempData = data
      // @ts-ignore
      const files = (req.files?.images || []) as Express.Multer.File[]
      const bb = req.body.data as string
      const bodyData = JSON.parse(bb) as TClientFE[]
      let clients: TClient[] = []
      bodyData.forEach((client) => {
        if (!client.isExistingImage) {
          const file = files?.find((x) => x.originalname === client.image.name)
          if (file) {
            const pathFolder = path.join(__dirname, '../static/about')
            const newName = client.id + path.extname(file.originalname)
            const savePath = path.join(pathFolder, newName)
            fs.writeFileSync(savePath, file.buffer)
            const imageURL = `/static/about/${newName}`
            clients.push({
              id: client.id,
              image: imageURL,
              name: client.name,
            })
          } else {
            clients.push({
              id: client.id,
              image: client.image.name,
              name: client.name,
            })
          }
        } else {
          clients.push({
            id: client.id,
            image: client.image.name,
            name: client.name,
          })
        }
      })
      // @ts-ignore
      tempData.clients = clients
      fs.writeFileSync(
        path.join(__dirname, '../data/about.json'),
        JSON.stringify(tempData)
      )
      res.status(200).json({ data: tempData, error: null })
    } catch (error) {
      res.status(500).json(error)
    }
  }
}
export default AboutUseCase
