//import userModel from '../model/users';
var userModel = require('../model/users');
module.exports.requireLogin= function(req,res){
    res.render('auth/login');
};

module.exports.postLogin= async function(req,res,next){
    const username = req.body.username;
    const pass = req.body.password;
    
    const user = await userModel.findOne({username});
    if(user){
        if(await user.comparePassword (pass)){
            //next();
            res.render('admin/manager');
        }
    }
    throw new Error('sai tài khoản hoặc mật khẩu');

}