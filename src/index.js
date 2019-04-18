"use strict";
require("dotenv/config");
import express from 'express'
import bodyParser from 'body-parser'
import {db} from '../models'
import passport from 'passport'
import '../middleware/passport'

import routes from '../routes'

const app = express()

app.use(bodyParser.json())
app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false}))

db.sync({ force: false }).then(() => {
    app.use('/api', routes)

    app.use((err, res, next) => {
        res.json({ err: err.message })
    })

    app.listen(process.env.PORT, err => {
        if (err) {
            console.log(err.end)
            process.exit(1)
        }
        console.log(`Server is running at port ${process.env.PORT}`);
    })
})




