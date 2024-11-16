import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import data from '../data/home.json'
import projects from '../data/projects.json'
import { TProject } from '../projects/usecase'
class HomeUsecase {
  async getHome(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(data)
  }
  async submitChangeData(req: Request, res: Response) {
    try {
      let tempData = data
      const file = req.file
      const pp = path.join(__dirname, '../static/home')
      if (file) {
        const fileName = 'home' + path.extname(file.originalname)
        fs.writeFileSync(path.join(pp, fileName), file.buffer)
        tempData.image_path = `/static/home/${fileName}`
      }
      const { html } = req.body
      tempData.html = html
      fs.writeFileSync(
        path.join(__dirname, '../data/home.json'),
        JSON.stringify(tempData)
      )
      res.status(200).json({ data: tempData, error: null })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
  async getShowProject(req: Request, res: Response) {
    try {
      const p = projects.projects as TProject[]
      const latestProject = p.find((x) => x.showOnHomeButton)
      if (latestProject) {
        res.status(200).json({
          id: latestProject.id,
          buttonTextHome: latestProject.buttonTextHome,
        })
      } else {
        res.status(200).json({ id: null, buttonTextHome: null })
      }
    } catch (error) {
      res.status(500).json({ error })
    }
  }
}
export default HomeUsecase
