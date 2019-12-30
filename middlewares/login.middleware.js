var userModel = require('../model/users');
module.exports.requireLogin=  async function(req,res,next){
//     if(!req.signedCookies){ // ở đây dùng cookie để xác nhận  // nếu không có thì sẽ ở lại trang login
//         res.redirect('/login');
//     }
// //viết tiếp code xác nhận tài khoản và mật khẩu để đăng nhập
//     next();
const username = req.body.username;
const pass = req.body.password;

const user = await userModel.findOne({username});
if(user){
    if(await user.comparePassword (pass)){
        next();
        //res.render('admin/manager');
    }
}
throw new Error('sai tài khoản hoặc mật khẩu');

}