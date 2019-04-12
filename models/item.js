import { Model } from "sequelize";

export default class Item extends Model {
    static init(sequelize, DataTypes) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                libelle: {
                    type: DataTypes.STRING,
                },

            }
        )
    }
}
