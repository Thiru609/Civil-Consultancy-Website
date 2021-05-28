const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database')

//CONNECTION TO DATABASE
mongoose.connect(config.database);
let db = mongoose.connection;

//CONNECTION TO DATA BASE MESSAGE
db.on('open', function(){
  console.log('Connected to MongoDB');
});

//storage engine CREATION
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file, cb){
    cb(null,path.basename(file.originalname) + '-' + Date.now() + path.extname(file.originalname));
  }
});

//upload variable FOR STORAGE ENGINE
const upload = multer({
  storage:storage,
  limits:{fileSize:1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
  }).single('myFile');

  //checking type OF FILE
function checkFileType(file, cb){
const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
const mimetype = filetypes.test(file.mimetype);

if(mimetype && extname){
  return cb(null,true);
}  else{
  cb('err : Images, PDF and Word Documents Only');
}
}

//MONGO ERROR MESSAGE
db.on('error', function(err){
  console.log(err);
});

//MODELS DECALARATION
let Article=require('./models/article')
let User=require('./models/user')


const app = express();

//SETTING VIEWS
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//public
app.use(express.static(path.join(__dirname, 'public')));

//Express sesh middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true

}))

//Express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//express expressValidator
app.use(expressValidator());

//passport config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//logoutglobal
app.get('*', function(req,res,next){
  res.locals.user = req.user || null;
  next();
});

// Home
app.get('/', function(req,res){
  Article.find({}, function(err, articles){

    if(err){
      console.log(err);
    }else{
    res.render('index',{
    title:'Articles',
    articles: articles,

  });
}

});
});

//upload render
app.get('/upload', function(req,res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }else{
    res.render('upload');
}

  });
});

//UPLOAD POST
app.post('/upload', (req, res) =>{
  upload(req, res, (err)=>{
    if(err){
      res.render('upload', {msg: err});
    } else{
      if(req.file == undefined){
          res.render('upload', {msg: 'Error: No File Selected!'});
      } else{
        res.redirect('/');
      }
    }
  });
});

// route files lets
let articles = require('./routes/articles');
let users = require('./routes/users');
let job = require('./routes/applications');
let query = require('./routes/querys');
let admin = require('./routes/admins');

// route file apps
app.use('/articles', articles);
app.use('/users', users);
app.use('/applications', job);
app.use('/querys',query)
app.use('/admin',admin);

//server
app.listen(3000,function(){
  console.log('server started on port 3000....');
});
