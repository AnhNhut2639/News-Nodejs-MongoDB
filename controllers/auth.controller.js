module.exports.requireLogin= function(req,res){
    res.render('auth/login');
};

module.exports.postLogin= function(req,res){
    let username = req.body.username;
    let pass = req.body.pass;
    // viết code đăng nhập ở đây

};