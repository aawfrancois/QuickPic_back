import { Model } from "sequelize";

export default class Game extends Model {
  static init(sequelize, DataTypes) {
    super.init(
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
        // TODO
        // Associate model to other models
      }
    )
  }
}
