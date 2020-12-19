const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
const Customer = require('../models/customer');
const nodemailer = require('nodemailer');
const {user, pass} = require('../configure/mailKey');

//Protecting Routes
const protected = require('../configure/auth').ensureAuthenticated;

//Login Page
router.get('/login', (req, res) => {
    res.render('login');
})


router.get('/dashboard', protected, async (req, res) => {
    try{
        const data = await Customer.find().sort({date:-1});
        // console.log(data);
        res.render('dashboard', { UserName: req.user.name, data: data });
    }
    catch(err){
        console.log("Data Not Found In Database");
    }
})


//Filling Modal
router.get('/fill-customer-data', async (req, res) => {
    let id = req.query.id;
    let data = await Customer.findById({ _id: id });
    res.send(JSON.stringify(data));
    // console.log(data);
});

//Send-Mail
router.post('/send-mail', (req, res) => {
    // console.log(req.body);
    const content = `
                    <div style="font-family: 'Google Sans'; border-left: 35px solid #000; min-height: 425px;padding: 2px 35px 35px 40px;background: linear-gradient(-25deg, #314156, #4d90fe,transparent);">
                     <h1 style="text-align: center;font-size: 35px;letter-spacing: 5px;border-bottom: 1px solid #4374c1;">Desi Tech</h1>
                        <div style="font-weight: 300;font-size: 16px;color: #484646;">
                                <p>Hello Dear, ${req.body.EmailTo}</p>
                                <p>This mail is from <b>Demo PVT LTD</b></p>
                                <div>
                                    <p>${req.body.massage}</p>
                                </div>
                        </div>
                    </div>
                    `
    //Step 1
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user, //Set in Env Variable
            pass: pass
        },
        tls: {
            rejectUnauthorized: false
        }
    });


    //Step 2
    let mailOption = {
        from: '"Demo" <mohdshadab0718@gmail.com>',
        cc: 'mohdshadab0718@gmail.com',
        to: req.body.EmailTo,
        subject: 'Demo PVT LTD',
        // text: 'Hello',
        html: content
    };

    //Step 3
    transporter.sendMail(mailOption, (err, data) => {
        if (err) {
            console.log('Error Occured', err);
            req.flash('error','Oops! Something Goes Wrong Mail Not Sent');
            res.redirect('dashboard');
        } else {
            console.log('Mail Sent!!');
            req.flash('success_msg','Mail Sent Successfully');
            res.redirect('dashboard');
        }
    });

})

//Delete Data
router.post('/delete-data', async (req, res) => {
    // console.log(req.body.item_id);
    Customer.findById({ _id: req.body.item_id })
        .then((data) => {
            data.deleteOne()
            req.flash('success_msg','Item Deleted Successfully');
            res.redirect('/user/dashboard');
            console.log('Item Deleted Successfully');
        })
        .catch(err => {
            console.log('Wrong ID! Item Not Deleted');
            req.flash('error','Oops! Something goes wrong Item Not Deleted')
            res.redirect('/user/dashboard');
        })
})

//Loging Handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/user/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

// //Lougout Handler
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
})

//Register Page
router.get('/register', protected, (req, res) => {
    res.render('register');
})

//POST
router.post('/register',protected, async (req,res)=> {
    const {name, email, password} = req.body;
    const hashPSW = await bcrypt.hash(password,10);
    const item = new User({
        name,
        email,
        password: hashPSW 
    });
    const result = await item.save();
    // console.log(result);
    req.flash('success_msg','Successfully Register');
    res.redirect('/user/login')
})


module.exports = router;