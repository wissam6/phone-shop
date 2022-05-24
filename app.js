const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const session = require('express-session');

//db connection
const dbURI = "mongodb+srv://wissam_6:@phone-shop.oo0ji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(dbURI);

//session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//defaults
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
  });

//connect to db
client.connect().then(() => app.listen(3000)).catch((err) => console.log(err));

//index page
app.get('/', (req,res) => {
  MongoClient.connect(dbURI, (err,db) => {
    var dbo = db.db('phone-shop');
    dbo.collection('phones').find({}).toArray((err,result)=> {
      res.render('index', {data: result} ); 
      });
  });
});

//sell phone || insert phone to db
app.post("/addPhone", (req,res) => {
  MongoClient.connect(dbURI,(err,db) => {
    let brand = req.body.brand;
    let model = req.body.model;
    let price = req.body.price;
    let used = req.body.used;
    let phone = {
      brand: brand,
      model: model,
      price: price,
      used: used
  };
    var dbo = db.db('phone-shop');
    dbo.collection('phones').insertOne(phone, () => console.log('inserted'));
  })
});


//login page
app.get('/login', (req,res) => {
  res.render('login');
});

//login handling
app.post('/login', (req,res) => {
  MongoClient.connect(dbURI, (err,db) => {
    let username = req.body.username;
    let password = req.body.password;
    let user = {
      username: username,
      password: password
    }
    var dbo = db.db('phone-shop'); 
    dbo.collection('users').find({username: username, password: password}).toArray((err,result)=> {
      if(result.length>0) res.redirect('/');
      else res.redirect('/login');
    });
  });

  sessionData = req.session;
  sessionData.user = {};
  sessionData.user.username = req.body.username;

});

//sign up page
app.get('/signup', (req,res) => {
  res.render('signup');
});

//signup handling
app.post('/signup', (req,res)=>{
  MongoClient.connect(dbURI, (err,db) => {
    var dbo = db.db('phone-shop');
    let user = {
      name : req.body.name,
      password : req.body.password,
      email : req.body.email,
      username: req.body.username
    }
    let email = req.body.email;
    let username = req.body.username;

    //check if email or username exist
    function Exists(result) {
      if(result.length>0) return true;
      else return false;
    }  
  
    dbo.collection('users').find({email: email}, {username: username}).toArray((err,result)=> {
      let isDuplicate = Exists(result);
      if(isDuplicate){
        console.log('email or username exist');
        res.redirect('/signup');
      }
      else{
        insertUser(user);
        res.redirect('/login');
      } 
    });
    

    function insertUser(user) {
      dbo.collection('users').insertOne(user, (err,res) => {
        console.log(res);
      })
    }
 
  })
});

//profile page
app.get('/profile', (req,res)=> {
  let username1 = sessionData.user.username;
  MongoClient.connect(dbURI, (err,db)=>{
    var dbo = db.db('phone-shop');  //change
    dbo.collection('users').find({username: username1}).toArray((err,result)=> {
       const userInfo = result;
       res.render('profile', {data: userInfo});
    });
  })
});

//update email
app.post('/newemail', (req,res)=> {
  let email = req.body.email;
  let username = sessionData.user.username;
  MongoClient.connect(dbURI, (err,db)=>{
    var dbo = db.db('phone-shop');
    dbo.collection('users').updateOne({username: username}, {$set: {email: email}}, (err,result)=> {
      console.log(result);
      res.redirect('/profile');
    })
  });
})

//update password
app.post('/newpassword', (req,res)=> {
  let password = req.body.password;
  let username = sessionData.user.username;
  MongoClient.connect(dbURI, (err,db)=>{
    var dbo = db.db('phone-shop');
    dbo.collection('users').updateOne({username: username}, {$set: {password: password}}, (err,result)=> {
      console.log(result);
      res.redirect('/profile');
    })
  });
})