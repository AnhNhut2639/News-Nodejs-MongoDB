require('dotenv').config();
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const port = 3000;
var login = require('./routes/auth.route'); //login sẽ làm midffleware khi ai đó muốn đăng nhập vào hệ thống (localhost:3000/login)
var admin = require('./routes/admin.route');
var client = require('./routes/client.route');
//var middlewareLogin = require('./middlewares/login.middleware'); // làm middleware để yêu cầu đăng nhập
//var middlewareLogin = require('./middlewares/checkLogin.middleware');
app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

//var router = express.Router();
var mongoose = require('mongoose'); // use mongoose db
mongoose.connect(process.env.MONGO_URL);
//mongoose.connect('mongodb://localhost/ITNews');

// app.get('/', function(req,res){ //endpoint này sẽ viết trang cho người dùng là đọc giả
//     res.render('index.pug');
// })

app.use('/',client);//endpoint này sẽ viết trang cho người dùng là đọc giả

app.use('/login',login); // endpoint này sẽ dùng để làm middleware đăng nhập

//app.use('/admin',admin); // phân quyên quản lý của admin(dòng nay để test)
//app.use('/admin',middlewareLogin.checkLogin,admin); // dùng dòng này để  chạy cuối cùng khi hoàn thành dùng middleware để yêu cầu đăng nhập
app.use('/admin',admin); // dùng middleware trước của controller của endpoint


app.listen(port, () => console.log(`Deployed ${port}!`))