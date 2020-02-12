require("dotenv").config();
const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const port = 3000;
const routers = require("./routers");

// var login = require("./routes/auth.route"); //login sẽ làm midffleware khi ai đó muốn đăng nhập vào hệ thống (localhost:3000/login)
let check = require("./middlewares/check.middleware");
// app.set("view engine", "pug");
// app.set("views", "./views");

app.engine(
  "handlebars",
  handlebars({
    extname: "handlebars",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials"
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//var router = express.Router();
var mongoose = require("mongoose"); // use mongoose db
mongoose.connect(process.env.MONGO_URL);
app.use(cookieParser(process.env.SESSION_SECRET));
//mongoose.connect('mongodb://localhost/ITNews');

// app.get('/', function(req,res){ //endpoint này sẽ viết trang cho người dùng là đọc giả
//     res.render('index.pug');
// })

// app.use("/", client); //endpoint này sẽ viết trang cho người dùng là đọc giả

// app.use("/login", login); // endpoint này sẽ dùng để làm middleware đăng nhập

// WebRouter -->
app.use("/", routers.web);
app.use("/admin", check.checkCookies, routers.admin);
app.use("/editor", check.checkCookies, routers.editor);
app.use("/login", routers.login);
app.use(express.static(__dirname + "/public"));
// <-- WebRouter

//app.use('/admin',admin); // phân quyên quản lý của admin(dòng nay để test)
//app.use('/admin',middlewareLogin.checkLogin,admin); // dùng dòng này để  chạy cuối cùng khi hoàn thành dùng middleware để yêu cầu đăng nhập
// app.use("/admin", middlewareLogin.checkLogin, admin); // dùng middleware xét cookie

app.listen(port, () => console.log(`Deployed ${port}!`));
