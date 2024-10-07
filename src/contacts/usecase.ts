import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'
import data from '../data/contacts.json'
class ContactUsecase {
  async getContact(req: Request, res: Response, next: NextFunction) {
    res.status(200).json(data)
  }
  async submitChangeData(req: Request, res: Response) {
    try {
      let tempData = data
      const { html, whatsapp } = req.body
      tempData.html = html
      tempData.whatsapp = whatsapp
      fs.writeFileSync(
        path.join(__dirname, '../data/contacts.json'),
        JSON.stringify(tempData)
      )
      res.status(200).json({ data: tempData, error: null })
    } catch (error) {
      res.status(500).json({ error })
    }
  }
}
export default ContactUsecase
