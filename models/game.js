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
                    type: DataTypes.DATE,
                    allowNull: false
                },
                endGame: {
                    type: DataTypes.DATE,
                    allowNull: false
                },
                status: {
                    type: DataTypes.ENUM('upcoming', 'in progess', 'completed'),
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
