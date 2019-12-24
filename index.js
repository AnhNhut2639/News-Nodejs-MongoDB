const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000;
var login = require('./routes/auth.route');
app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

//var router = express.Router();
var mongoose = require('mongoose'); // use mongoose db
//mongoose.connect(process.env.MONGO_URL);
mongoose.connect('mongodb://localhost/ITNews');

app.get('/', function(req,res){ //endpoint này sẽ viết trang cho người dùng là đọc giả
    res.render('index.pug');
})

app.use('/',login);


app.listen(port, () => console.log(`Deployed${port}!`))