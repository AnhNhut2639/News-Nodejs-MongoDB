module.exports.checkLogin = function(req,res,next){
  if(!req.signedCookies.ID){
    res.redirect('/login');
    return;
}

// var user = db.get('citys').find({id: req.signedCookies.ID}).value();

// if(!user){
//     res.redirect('/login');
//     return;
// }

// res.locals.userN = user; // truyền userN qua common để hiển thị tên ng đăng nhập sau khi đăng nhập thành công

next();
}