module.exports.requireLogin= function(req,res,next){
    if(!req.signedCookies){ // ở đây dùng cookie để xác nhận 
        res.redirect('/login');
        return;
    }
//viết tiếp code xác nhận tài khoản và mật khẩu để đăng nhập

next();
}