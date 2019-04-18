import { Router } from 'express'
import User from '../models/user'

import passport from 'passport'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const api = Router()

api.post('/register', async (req, res) => {
  let { nickname, email, password, password_confirmation } = req.body

  try {
    let user = new User({ nickname, email, password, password_confirmation })
    let data = await user.save()
    res.json({ data: data })
  } catch (error) {
    res.json({ err: error.message })
  }
})


api.post('/login', (req, res, next) => {
  try {

    passport.authenticate('local', { session: false }, (err, user) => {
      if (err) {
        return res.status(400).json({ err: err })
      }

      const { nickname, uuid, email } = user
      const payload = { uuid: user.uuid, nickname, email };
      const token = jwt.sign(payload, process.env.JWT_ENCRYPTION);

      res.json({ token, data: { user } })
    })(req, res, next)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})



export default api
