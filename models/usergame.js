import {Model} from 'sequelize'

export default class UserGame extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                score: DataTypes.INTEGER
            },
            {
                sequelize,
                tableName: "game_user",
            },
        )
    }

}


