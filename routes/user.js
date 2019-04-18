import { Router } from 'express'
import User from '../models/user'

const api = Router()

// users ranking
api.get('/scoreboard/:uuid', async (req, res) => {
  try {
    const currentUserID = req.params.uuid
    
    const users = await User.findAll({
      order: [
        ['points', 'DESC']
      ],
      attributes: [
        'uuid', 'nickname', 'points'
      ]
    })
    users.forEach((element, index) => {
      const {uuid, nickname, points } = element.dataValues
      element.dataValues.position = index += 1

      if (uuid === currentUserID) {
        element.dataValues.isCurrentUser = true
      }
    })
    res.status(200).send(users)
  } catch (error) {
    res.status(400).send({error: error.message})
  }
})

export default api