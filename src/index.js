"use strict";
require("dotenv/config");
import express from 'express'
import bodyParser from 'body-parser'
import {db} from '../models'
import passport from 'passport'

const app = express()
// Parse incoming request available "req.body"
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(bodyParser.urlencoded({ extended: false}))


db.sync({
    force: true,
    logging(str) {
        console.log('ERROR', str)
    },
})




// respond with "hello world" when a GET request is made to the homepage
// app.get('/', function (req, res) {
//     res.send('hello world')
// })


app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))


