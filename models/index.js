import Sequelize, { Op } from 'sequelize'
import User from './user'
import Game from './game'
import Category from './category'
import Item from './item'
import UserGame from "./usergame"
import dotenv from 'dotenv'
dotenv.config()

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


//User.belongsToMany(Game, {through: 'game_user', foreignKey: 'user_id'});

User.belongsToMany(Game, { through: UserGame });
Game.belongsToMany(User, { through: UserGame });

Category.hasOne(Item, {foreignKey: 'id_category'});
Item.hasOne(Game, {foreignKey: 'id_item'});
