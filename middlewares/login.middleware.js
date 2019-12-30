module.exports.requireLogin= function(req,res,next){
    if(!req.signedCookies){ // ở đây dùng cookie để xác nhận  // nếu không có thì sẽ ở lại trang login
        res.redirect('/login');
    }
//viết tiếp code xác nhận tài khoản và mật khẩu để đăng nhập
    next();
}