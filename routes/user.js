import { Router } from 'express';
import User from '../models/user';
import _ from "lodash";

import dotenv from 'dotenv';
dotenv.config();

let api = Router();

api.get("/:uuid/profil", async (request, response) => {
    try {
        console.log('test')
        const uuid = request.params.uuid;
        const user = await User.findOne({ where: { uuid } });
        if (user) {
            response.status(200).json({
                data: {
                    user,
                    meta: {},
                }
            });
        } else {
            response.status(404).send();
        }
    } catch (error) {
        response.status(400).json({
            err: error.message
        });
    }
});

api.put("/:uuid/profil", async (request, response) => {
    try {
        const uuid = request.params.uuid;
        const user = await User.findOne({ where: { uuid } });
        if (!user) {
            response.status(404).send();
            return;
        }
        let field = _.pick(request.body, [
            "nickname",
            "email",
            "firstname",
            "lastname",
            "birthdate"
        ]);
        await user.update(field);
        response.status(204).send();
    } catch (error) {
        response.status(400).json({
            err: error.message
        });
    }
});

api.get("/:uuid/historic", async (request, response) => {
    try {
        console.log('test')
        const uuid = request.params.uuid;
        const user = await User.findOne({ where: { uuid } });
        if (user) {
            response.status(200).json({
                data: {
                    user,
                    meta: {},
                }
            });
        } else {
            response.status(404).send();
        }
    } catch (error) {
        response.status(400).json({
            err: error.message
        });
    }
});

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
      const user = element.dataValues
      const { uuid } = user
      user.position = index += 1

      if (uuid === currentUserID) {
        user.isCurrentUser = true
      }
    })
    res.status(200).send(users)
  } catch (error) {
    res.status(400).send({error: error.message})
  }
})

export default api