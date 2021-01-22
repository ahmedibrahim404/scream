const express = require('express'), app = express();
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/screamMe');


app.use(express.json({
  type: ['application/json', 'text/plain']
}))
app.use(bodyParser.urlencoded({
    extended:false
}))

app.set('view engine','ejs');
app.set('views', [ path.join(__dirname, 'views'), path.join(__dirname, 'views/main/'),path.join(__dirname, 'views/components'),path.join(__dirname, 'views/messages') ]);
app.use(express.static(path.join(__dirname, 'files')));
app.set('trust proxy', 1)


app.use(session({
  secret: 'secret-session-ya-wlah',
  resave:true,
  saveUninitialized: true
}))

var routes = require('./routes/routes');
var authRoutes = require('./routes/auth.routes');
var messageRoutes = require('./routes/message.routes');
var userRoutes = require('./routes/user.routes');

app.use('/', routes)
app.use('/', authRoutes)
app.use('/', userRoutes)
app.use('/', messageRoutes)

app.listen(5555, () => console.log('Run on 5555'));
