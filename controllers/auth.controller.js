//import userModel from '../model/users';
var userModel = require('../model/users');
module.exports.requireLogin= function(req,res){
    res.render('auth/login');
};
module.exports.postLogin=  async function(req,res,next){
    const username = req.body.username;
    const pass = req.body.password;

    const user = await userModel.findOne({username});
    if(user){
        if(await user.comparePassword (pass)){
            res.cookie('ID',user._id,{ 
                signed: true 
            });
            res.render('admin/manager');
        }
    }
    throw new Error('sai tài khoản hoặc mật khẩu');

};



module.exports.adminCreate= function(req,res){
    res.render('admin/create.pug');
};
module.exports.manager= function(req,res){
    res.render('admin/manager.pug');
}