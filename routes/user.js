import {Router} from 'express';
import User from '../models/user';
import UserGame from '../models/usergame'
import Item from '../models/item'
import Category from '../models/category'
import _ from "lodash";

import dotenv from 'dotenv';
import Game from "../models/game";

dotenv.config();

let api = Router();

api.get("/profil/:uuid", async (request, response) => {
    try {
        const uuid = request.params.uuid;
        const user = await User.findOne({where: {uuid}});
        if (user) {
            console.log(`[PaperTrail][User] User ${uuid} profil find`);
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

api.delete('/:uuid', async (req, res) => {
    try {
        let user = await User.destroy({where: {uuid: req.params.uuid}});
        console.log(`[PaperTrail][User] Deleted user: ${user} `);
        res.status(200).json({succes: `${user} deleted`});
    } catch (e) {
        res.status(400);
    }
});

api.get("/", async (request, response) => {
    try {
        let user = await User.findAll()
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

api.put("/profil/:uuid", async (request, response) => {
    try {
        const uuid = request.params.uuid;
        const user = await User.findOne({where: {uuid}});
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
        console.log(`[PaperTrail][User] User ${uuid} update`);
        response.status(204).json({true: "update ok"});
    } catch (error) {
        response.status(400).json({
            err: error.message
        });
    }
});

api.get("/history/:uuid", async (request, response) => {
    try {

        const uuid = request.params.uuid;
        const usergame = await UserGame.findAll({where: {user_uuid: uuid}});

        let idGames = []

        usergame.forEach((elementUsergame) => {
            idGames.push(elementUsergame.dataValues.GameId)
        })
        let game = await Game.findAll({where: {id: idGames}});

        let idItems = []

        game.forEach((elementGame) => {
            idItems.push(elementGame.dataValues.id_item)
        })

        let item = await Item.findAll({where: {id: idItems}});

        let idCategory = []

        item.forEach((elementCategory) => {
            idCategory.push(elementCategory.dataValues.id_category)
        })

        let category = await Category.findAll({where: {id: idCategory}});

        game.forEach((element, index) => {
            if (!item[index] === undefined) {
                if (element.dataValues.id_item == item[index].id && item.length < game.length)
                    item.push(item[index])
            }
        })

        item.forEach((element, index) => {
            if (element.dataValues.id_category == category[index].id && category.length < item.length)
                category.push(category[index])
        })

        let result = []

        category.forEach((element, index) => {
            let obj = {}
            obj.score = usergame[index].score
            obj.categoryLibelle = category[index].libelle
            obj.itemLibelle = item[index].libelle
            result.push(obj)
        })

        if (usergame.length !== 0) {
            console.log(`[PaperTrail][User] User ${uuid} history game find`);
            response.status(200).json(result);
        } else {
            console.log(`[PaperTrail][User] User ${uuid} games not found`);
            response.status(200).json({msg: "Vous n'avez pas encore jouer de parties."});
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
                ['points', 'ASC']
            ],
            attributes: [
                'uuid', 'nickname', 'points'
            ]
        })

         let usersSort = users.sort(function(a, b) {
            return b.points - a.points;
        });
        usersSort.forEach((element, index) => {
            const user = element.dataValues
            const {uuid} = user
            user.position = index += 1

            if (uuid === currentUserID) {
                user.isCurrentUser = true
            }
        })
        res.status(200).send(usersSort)
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

export default api
