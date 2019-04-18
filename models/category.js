import { Model } from "sequelize";

export default class Category extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                libelle: {
                    type: DataTypes.STRING,
                },
            },
            {
                sequelize,
                tableName: "category",
            },
        )
    }
}
