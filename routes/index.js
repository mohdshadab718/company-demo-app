const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = require('../configure/twilioKey');
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// //Requiring Customer
const Customer = require('../models/customer');

//Database Connection
const URL = require('../configure/key').mongoURI;
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(success => console.log('Database Connected Successfully'))
    .catch(err => console.log(err))


//Home
router.get('/', (req, res) => {
    res.render('index');
})


//Contact-Form Data
router.post('/sent-data', (req, res) => {
    const result = validateData(req.body);
    if (result.error) {
        // console.log(result.error.details[0].message);
        let eror = result.error.details[0].message;
        req.flash('error_subitted', eror);
        res.redirect('/');
    }
    else {
        let { name, phone, email, subject, massage } = req.body;
        // console.log(name);
        const item = new Customer({
            name,
            phone,
            email,
            subject,
            massage
        })

        item.save()
            .then((item) => {
                console.log('Saved Successfully');
                const phone = item.phone;
                // console.log(typeof phone);
                //Send Sms
                client.messages
                    .create({
                        body:
`Thank you ${item.name} for getting in touch!
We appreciate you contacting us.
Mr SHADAB will will contact you soon with email!
Have a great day!
Website: https://www.webforupdate.com/`,
from: '+12543822726',
to: '+91' + phone
                    })
                    .then(message => console.log('Massage Successfully Send'));
            })
            .catch(err => console.log('Item Not Saved'))
        req.flash('success_subitted', 'Submitted Successfully');
        res.redirect('/');
    }
})

function validateData(body) {
    //Joi Schema
    const JoiSchema = {
        name: Joi.string().min(3).required(),
        phone: Joi.string().min(8).required(),
        email: Joi.string().min(5).email().required(),
        subject: Joi.string().min(3).max(30).required(),
        massage: Joi.string().min(6).max(300).required()
    }

    return Joi.validate(body, JoiSchema);
}

module.exports = router;