import { Router } from 'express'
import auth from './auth'

let api = Router()

api.get('/', (req, res) => {
    res.json({ hi: 'startupWeek API' })
})

api.use('/auth', auth)

export default api
