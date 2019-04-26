import {Router} from 'express'
import Game from '../models/game'
import Item from '../models/item'
import User from '../models/user'
import * as _ from "lodash"
import Category from "../models/category"
import Usergame from "../models/usergame"

const api = Router()

// get all games
api.get('/:uuid', async (req, res) => {
    try {
        const usergame = await Usergame.findAll({where: {user_uuid: req.params.uuid}})

        let userGameId  = []

        usergame.forEach((element) => {
            userGameId.push(element.dataValues.id);
        })

        let game = await Game.findAll({where: {status: [ 'upcoming', 'in progress']}});
        let category = await Category.findAll();
        let item = await Item.findAll();

        let result = []
        game.forEach(el => {
            let obj = {}
            obj.idGame = el.dataValues.id
            obj.startGame = el.dataValues.startGame
            obj.endGame = el.dataValues.endGame
            obj.status = el.dataValues.status
            let goodItem = item.filter(  data => data.dataValues.id === el.dataValues.id_item)
            obj.itemLibelle = goodItem[0].libelle

            let goodCat = category.filter(  data=> data.dataValues.id === goodItem[0].id_category)
            obj.categoryLibelle = goodCat[0].libelle

            if (!userGameId.includes(obj.idGame)){
                result.push(obj)
            }
        });

        console.log(result);

        if (result.length !== 0) {
            console.log(`[PaperTrail][Game] Games found`);
            res.status(200).json(result);
        } else {
            res.status(200).json({msg: "Aucune parties n'est présente"});
        }
    } catch (error) {
        res.status(400).send({error: error.message})
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
