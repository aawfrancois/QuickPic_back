import { Router } from 'express'
import Game from '../models/game'

const api = Router()

// get all games
api.get('/', async (req, res) => {
  try {
    const games = await Game.findAll()
    res.status(200).json(games)
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
});

// get a game by its id
api.get('/:game_id', async (req, res) => {
  try {

    const game = await Game.findOne({ where: { id: req.params.game_id }})

    if (game) {
      res.status(200).json(game)
    } else {
      res.status(404).json("Oops, the game you want doesn't exist.")
    }
  } catch (error) {
    res.status(400).send({ error: error.message })
  }
})

export default api
