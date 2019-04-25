import {Router} from 'express'
import Game from '../models/game'
import Item from '../models/item'
import User from '../models/user'
import * as _ from "lodash"
import Category from "../models/category"
import Usergame from "../models/usergame"

const api = Router()

// get all games
api.get('/', async (request, response) => {
    try {
        const game = await Game.findAll({where: {status: ['upcoming', 'in progress']}})

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
            obj.idGame = game[index].id
            obj.startGame = game[index].startGame
            obj.endGame = game[index].endGame
            obj.status = game[index].status
            obj.categoryLibelle = category[index].libelle
            obj.itemLibelle = item[index].libelle
            result.push(obj)
        })

        const usergame = await Usergame.findAll();

        let usergameArray = []

        usergame.forEach(element => {
            usergameArray.push(element.dataValues.GameId)
        });

        let res = []

        result.forEach(element => {
            if (!(usergameArray.includes(element.idGame))) {
                res.push(element)
            }
        });

        if (game.length !== 0) {
            console.log(`[PaperTrail][Game] Games found`);
            response.status(200).json(res);
        } else {
            response.status(200).json({msg: "Aucune parties n'est présente"});
        }
    } catch (error) {
        response.status(400).send({error: error.message})
    }
});

// get a game by its id
api.get('/:game_id', async (req, res) => {
    try {
        const game = await Game.findOne({where: {id: req.params.game_id}})

        const item = await Item.findOne({where: {id: game.id_item}})

        let obj = {
            id: game.id,
            startGame: game.startGame,
            endtGame: game.endGame,
            status: game.status,
            itemLibelle: item.libelle
        }

        if (game) {
            console.log(`[PaperTrail][Game] Game ${req.params.game_id} found`);
            res.status(200).json(obj)
        } else {
            console.log(`[PaperTrail][Game] Game ${req.params.game_id} not found`);
            res.status(404).json("Oops, the game you want doesn't exist.")
        }
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})


api.post('/:game_id', async (req, res) => {

    let {pourcentage, uuid, time} = req.body

    try {
        const user = await User.findOne({where: {uuid: uuid}})

        let calcul = parseInt(pourcentage) * parseInt(time);

        if (user.dataValues.points == null) {
            user.dataValues.points = 0;
        }
        let calculUser = calcul + parseInt(user.dataValues.points)

        user.update({
            points: parseInt(calculUser)
        }).then(() => {
        })

        Usergame.sequelize.query(`INSERT INTO game_user (score, user_uuid, game_id) values (${parseInt(calcul)}, '${uuid}', ${req.params.game_id})`)

        if (user) {
            console.log(`[PaperTrail][Game][User] Game data score send --> User: ${uuid} `);
            res.status(200).json({calcul: calcul})
        } else {
            console.log(`[PaperTrail][Game][User] Bad id for this route`);
            res.status(404).json("Oops, the game you want doesn't exist.")
        }
    } catch (error) {
        res.status(400).send({error: error.message})
    }
})

export default api
