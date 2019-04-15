import { Model } from 'sequelize'
import bcrypt from 'bcrypt'

const MIN_PASSWORD_LENGHT = 7;

export default class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                uuid: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                },
                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    validate: {
                        isEmail: true,
                    },
                    unique: {
                        args: true,
                        msg: "Email adress already in use",
                    },
                },
                nickname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                     unique: {
                         args: true,
                         msg: "Nickname already in use",
                     },
                },
                password_digest: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                password: {
                    type: DataTypes.VIRTUAL,
                     validate: {
                         isLongEnough(val) {
                             if (val.length < MIN_PASSWORD_LENGHT) {
                                 throw new Error("Password is too short")
                             }
                         },
                     },
                },
                password_confirmation: {
                    type: DataTypes.VIRTUAL,
                     validate: {
                         isEqual(val) {
                             if (this.password !== val) {
                                 throw new Error("Passwords don't match")
                             }
                         },
                     },
                },
                firstname: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                lastname: {
                    type: DataTypes.STRING,
                    allowNull: true,
                },
                birthdate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                points: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: "user",
                hooks: {
                    beforeValidate: async user => {
                        if(user.isNewRecord) {
                            user.password_digest = await user.generatePasswordHash(user.password);
                        }
                    },
                },
            },
        )
    }


    async checkPassword(password) {
        return bcrypt.compare(password, this.password_digest)
    }

    async generatePasswordHash() {
        // we choose ~10 hashes/sec

        const SALT_ROUNDS = 10

        // auto-generate a salt and hash the password
        const hash = await bcrypt.hash(this.password, SALT_ROUNDS)

        if (!hash) {
            throw new Error("USER.PASSWORD.HASH_MESSAGE")
        }

        return hash
    }

    toJson() {
        const obj = Object.assign({}, this.get());
        delete obj.password_digest;
        delete obj.password;
        delete obj.password_confirmation;
        return obj;
    }
}
