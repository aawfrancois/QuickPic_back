const SGmail = require('@sendgrid/mail')
import dotenv from 'dotenv'

dotenv.config()

export function newUserEmail(email, name) {
    SGmail.setApiKey(process.env.SENDGRID_API_KEY)
    const message = {
        to: email,
        from: 'quickpicapi@gmail.com',
        message: `Hi there, ${name}`,
        template_id: "d-64b8dd107e4d45ca98e4365859870922",
        dynamic_template_data: {
            subject: 'Testing Templates',
            name: name
        },
        html: `Test`
    };
    SGmail.send(message)
}

