import { Model } from "sequelize";
import bcrypt from 'bcrypt';

export default class User extends Model {
    static init(sequelize, DataTypes) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                username: {
                    type: DataTypes.STRING,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        isEmail: true
                    },
                    unique: {
                        args: true,
                        msg: "Email Already Use"
                    }
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false
                },
                password_confirm: {
                    type: DataTypes.VIRTUAL,
                    allowNull: false
                },
                firstname: {
                    type: DataTypes.STRING,
                },
                lastname: {
                    type: DataTypes.STRING,
                },
                birthdate: {
                    type: DataTypes.DATE,
                },
                points: {
                    type: DataTypes.INTEGER
                }
            },
            {
                sequelize,
                hooks: {
                    beforeCreate: function(User) {
                        if (User.password !== User.password_confirm) {
                            throw "error password don't match!"
                        }

                        let salt = bcrypt.genSaltSync();
                        User.password = bcrypt.hashSync(User.password, salt)
                    }
                }
            }
        )
    }
}

