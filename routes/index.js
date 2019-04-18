import { Router } from 'express'
import auth from './auth'
import game from './game'
import user from './user'

let api = Router()

api.get('/', (req, res) => {
    res.json({ hi: 'startupWeek API' })
})

api.use('/auth', auth)
api.use('/games', game)
api.use('/users', user)

export default api
