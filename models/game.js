import {Model} from 'sequelize'

export default class Game extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                startGame: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                endGame: {
                    type: DataTypes.INTEGER,
                    allowNull: false
                },
                status: {
                    type: DataTypes.STRING,
                    allowNull: false
                }
            },
            {
                sequelize,
                tableName: "game",
            },
        )
    }
}
