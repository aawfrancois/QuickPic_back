import { Router } from 'express'
import User from '../models/user'

import passport from 'passport'
import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
dotenv.config()

let api = Router()

api.post('/register', async (req, res) => {
    let {nickname, email, password, password_confirmation} = req.body

    try {
        let user = new User({ nickname, email, password, password_confirmation })
        let data = await user.save()
        res.json({ data })
    } catch (error) {
        res.json({ error })
    }
})

api.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user) => {
        if (err) {
            return res.status(400).json({ err })
        }

        const { id, nickname, email } = user.toJSON()

        let token = jwt.sign({ id, nickname, email }, process.env.JWT_ENCRYPTION)

        res.json({ token, data: { user } })
    })(req,res)
})

export default api
