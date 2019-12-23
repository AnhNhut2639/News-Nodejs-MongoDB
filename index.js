const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const port = 3000;
app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

//var router = express.Router();

app.get('/', function(req,res){ //endpoint này sẽ viết trang cho người dùng là đọc giả
    res.render('index.pug');
})

app.listen(port, () => console.log(`Deployed${port}!`))