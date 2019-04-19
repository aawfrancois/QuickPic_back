const SGmail = require('@sendgrid/mail')
import dotenv from 'dotenv'
dotenv.config()

export function newUserEmail(email, name){
    SGmail.setApiKey(process.env.SENDGRID_API_KEY)
    const message = {
        to : email, //email variable
        from : 'antoinefrancois95@gmail.com' ,
        message : `Hi there, ${name}`,
        subject : "Welcome Mail",
        html: `Hi there, ${name}`
    }
    SGmail.send(message)
}

