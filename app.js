const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');

//Passport Config
require('./configure/passport')(passport);

// //Body-Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false
}))
//Serving Static Files
app.use(express.static(__dirname + '/public'));

//Set View Engine
app.set('view engine','ejs');

//Express Session Middleware *important to put here
app.use(session({
    secret: 'secrete',
    resave: true,
    saveUninitialized: true
  }));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global vars
app.use(function(req, res, next) {
    res.locals.error = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.success_subitted = req.flash('success_subitted');
    res.locals.error_subitted = req.flash('error_subitted');

    next();
  });
  
//Routes
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server running on port ${PORT}`));