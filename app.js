const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');


//db connection
const dbURI = "mongodb+srv://wissam_6:@phone-shop.oo0ji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(dbURI);

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

    //check if email exists
    

    dbo.collection('users').find({email: email}).toArray((err,result)=> {
      if(result.length>0) {
        console.log('email has been taken');
        var emailExists = 'yes';
      }
      else {
        var emailExists = 'no';
      }

    });
    console.log(emailExists);

    /*dbo.collection('users').find({username: username}).toArray((err,result)=> {
      if(result.length>0) {
        console.log('username has been taken');
      }
      else {
        dbo.collection('users').insertOne(user, (err,res) => {
          console.log(res);
        })
      }
    });*/

     /*dbo.collection('users').insertOne(user, (err,res) => {
        console.log(res);
      })*/

 
  })
});
