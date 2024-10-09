import { Request, Response } from 'express'
import data from '../data/projects.json'
import fs from 'fs'
import path from 'path'

type TTag = {
  name: string
  group: string
  id: string
}
type TProjectFE = {
  id: string
  name: string
  client: string
  location: string
  date: string
  tags: TTag[]
  team: string
  images: { name: string; id: string; isExisting?: boolean }[]
}
type TProject = {
  id: string
  client: string
  location: string
  name: string
  date: string
  tags: TTag[]
  team: string
  images: string[]
}
type TData = {
  projects: TProject[]
  tags: TTag[]
  html: string
}
const generateUUID = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length

  for (let i = 0; i < 16; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

class ProjectUseCase {
  async getProject(req: Request, res: Response) {
    res.status(200).json(data.projects)
  }
  async getTags(req: Request, res: Response) {
    res.status(200).json(data.tags)
  }
  async getHTML(req: Request, res: Response) {
    res.status(200).json(data.html)
  }
  async getProjectByID(req: Request, res: Response) {
    const tempData = data as TData
    const dataItem = tempData.projects.find((x) => x.id === req.params.id)
    if (dataItem) {
      res.status(200).json(dataItem)
    } else {
      res.status(404).json('Not found')
    }
  }
  async updateTags(req: Request, res: Response) {
    try {
      let tempData = data as TData
      const tags = req.body.tags as TTag[]
      tempData.tags = tags
      fs.writeFileSync(
        path.join(__dirname, '../data/projects.json'),
        JSON.stringify(tempData)
      )
      res.status(200).json({ data: tempData.tags, error: null })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
  async createProject(req: Request, res: Response) {
    try {
      const ssProject = req.body.data as string
      const project = JSON.parse(ssProject) as TProjectFE
      let images: string[] = []
      // @ts-ignore
      const files = (req.files?.images || []) as Express.Multer.File[]
      files.forEach((file) => {
        const filename = generateUUID() + path.extname(file.originalname)
        const savePath = path.join(__dirname, '../static/projects', filename)
        fs.writeFileSync(savePath, file.buffer)
        images.push(filename)
      })
      const dataSaved: TProject = {
        id: project.id,
        name: project.name,
        client: project.client,
        location: project.location,
        date: project.date,
        team: project.team,
        tags: project.tags,
        images: images,
      }
      let tempData: TData = data
      tempData.projects = tempData.projects.concat(dataSaved)
      fs.writeFileSync(
        path.join(__dirname, '../data/projects.json'),
        JSON.stringify(tempData)
      )
      res.status(200).json({ data: tempData.projects, error: null })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
  async updateProject(req: Request, res: Response) {
    try {
      const pp = req.body.data
      const project = JSON.parse(pp) as TProjectFE
      // @ts-ignore
      const files = (req.files?.images || []) as Express.Multer.File[]
      let updatedImage: string[] = []
      project.images.forEach((image) => {
        if (!image.isExisting) {
          const imageFind = files.find((x) => x.originalname === image.name)
          if (imageFind) {
            const filename =
              generateUUID() + path.extname(imageFind.originalname)
            const savePath = path.join(
              __dirname,
              '../static/projects',
              filename
            )
            fs.writeFileSync(savePath, imageFind.buffer)
            updatedImage.push(filename)
          } else {
            updatedImage.push(image.name)
          }
        } else {
          updatedImage.push(image.name)
        }
      })
      const dataSaved: TProject = {
        id: project.id,
        name: project.name,
        location: project.location,
        client: project.client,
        date: project.date,
        images: updatedImage,
        tags: project.tags,
        team: project.team,
      }
      let tempData: TData = data
      tempData.projects = tempData.projects.map((item) => {
        if (item.id === project.id) {
          return dataSaved
        }
        return item
      })
      fs.writeFileSync(
        path.join(__dirname, '../data/projects.json'),
        JSON.stringify(tempData)
      )
      res.status(200).json({ data: tempData.projects, error: null })
    } catch (error) {
      console.log(error)
      res.status(500).json({ error })
    }
  }
  async updateEditor(req: Request, res: Response) {
    const { html } = req.body
    const tempData = data
    data.html = html
    fs.writeFileSync(
      path.join(__dirname, '../data/projects.json'),
      JSON.stringify(tempData)
    )
    res.status(200).json({ data: tempData.html, error: null })
  }
  async deleteProject(req: Request, res: Response) {
    const id = req.params.id
    const tempData = data as TData
    const projects = tempData.projects as TProject[]
    const dataFiltered = projects.filter((x) => x.id !== id)
    tempData.projects = dataFiltered
    fs.writeFileSync(
      path.join(__dirname, '../data/projects.json'),
      JSON.stringify(tempData)
    )
    res.status(200).json({ data: dataFiltered, error: null })
  }
}
export default ProjectUseCase
