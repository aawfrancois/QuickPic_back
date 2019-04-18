import { Router } from 'express'
import Game from '../models/game'

const api = Router()

api.get('/', async (req, res) => {
  try {
    const games = await Game.findAll()
    res.status(200).json(games)
  } catch (error) {
    res.status(400).send({error: error.message})
  }
})

export default api

