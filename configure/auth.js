module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
    req.flash('error','Please Login First View This Content');
    res.redirect('/user/login');
    }
}