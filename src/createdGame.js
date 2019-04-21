import Game from '../models/game'
import Item from '../models/item'
import Sequelize, {Op} from "sequelize";
import User from "../models/user";
import Category from "../models/category";
import UserGame from "../models/usergame";
import dotenv from 'dotenv'
dotenv.config()
const moment = require('moment')
moment().format();


export const db = new Sequelize(process.env.DATABASE_URL, {
    operatorsAliases: Op,
    define: {
        underscored: true,
    },
})

User.init(db, Sequelize);
Game.init(db, Sequelize);
Category.init(db, Sequelize);
Item.init(db, Sequelize);
UserGame.init(db, Sequelize);


User.belongsToMany(Game, { through: UserGame });
Game.belongsToMany(User, { through: UserGame });

Category.hasOne(Item, {foreignKey: 'id_category'});
Item.hasOne(Game, {foreignKey: 'id_item'});


export async function createGame() {
    //partie 10 min
    try {
        let item = await Item.findAll();
        let itemIdArray = [];
        item.forEach((element) => {
            itemIdArray.push(element.dataValues.id)
        })

        let start_game = moment(new Date()).add('120', 'minutes').unix();

        let end_game = moment(new Date()).add('130', 'minutes').unix();

        let randomItem = itemIdArray[Math.floor(Math.random() * itemIdArray.length)];

        User.sequelize.query(`INSERT INTO game (status, start_game, end_game, id_item) values ('upcoming', ${start_game}, ${end_game}, ${randomItem})`)

    } catch (e) {
        console.log(e.message)
    }
}

createGame()
