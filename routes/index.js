import { Router } from 'express'
import auth from './auth'
import passport from 'passport'
import game from './game'
import user from './user'

let api = Router()

api.get('/', (req, res) => {
    res.json({ hi: 'startupWeek API' })
})

api.use('/users', passport.authenticate('jwt', {session: false}), user);
api.use('/auth', auth)
api.use('/games', game)

export default api
