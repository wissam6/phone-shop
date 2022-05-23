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


  client.connect().then(() => app.listen(3000)).catch((err) => console.log(err));


app.get('/', (req,res) => {
  MongoClient.connect(dbURI, (err,db) => {
    var dbo = db.db('phone-shop');
    dbo.collection('phones').find({}).toArray((err,result)=> {
      res.render('index', {data: result} ); 
      });
  });
 
  
});

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

app.get('/login', (req,res) => {
  res.render('login');
});

//create collection
/*MongoClient.connect(dbURI, function(err, db) {
    if (err) throw err;
    var dbo = db.db("phone-shop");
    dbo.createCollection("phones", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      //db.close();
    });
  });*/

  //insert
  /*MongoClient.connect(dbURI,(err,db) => {
    var dbo = db.db('phone-shop');
    var phone = {
      brand: 'Samsung',
      price: 1000,
      used: true,
      model: "A53"

    };
    dbo.collection('phones').insertOne(phone, () => console.log('inserted'));
  })*/