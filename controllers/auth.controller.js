//import userModel from '../model/users';

module.exports.requireLogin= function(req,res){
    res.render('auth/login');
};

module.exports.postLogin= async function(req,res,next){
    res.render('admin/manager');

}
module.exports.adminCreate= function(req,res){
    res.render('admin/create.pug');
};
module.exports.manager= function(req,res){
    res.render('admin/manager.pug');
}