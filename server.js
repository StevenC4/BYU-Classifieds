var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
var MongoClient=require('mongodb').MongoClient;
app.use(bodyParser.json());
http.createServer(app).listen(80);
app.use('/', express.static('./html', {maxAge: 60*60*1000}));

//---------------------------------------------------
//Directs the user to the home page
//---------------------------------------------------
app.get('/', function (req, res) {
  res.send("Home Page");
});

//---------------------------------------------------
//Directs the user to the page that lists the
//categories of advertisements
//---------------------------------------------------
app.get('/categories', function (req, res) {
  res.send("Categories Page");
});

//---------------------------------------------------
//Directs the user to the page that allows them
//to search all of the advertisements
//---------------------------------------------------
app.get('/search', function (req, res) {
  res.send("Search Page");
});

//---------------------------------------------------
//Directs the user to the product page. Honestly,
//I don't really know what this does and how it
//differs from the advertisement page, but it was
//on the google doc as a separate thing.
//---------------------------------------------------
app.get('/product', function (req, res) {
  res.send("Product Page");
});

//---------------------------------------------------
//Directs the user to a specific advertisement page.
//Right now, I've set it up to receive a query that
//I was thinking could be the advertisement ID number
//that way the server will know exactly which ad to
//send back
//---------------------------------------------------
app.get('/ad', function (req, res) {
  res.send("Advertisement Page " + req.query.q);
});


//Still testing
app.post('/validateuser', function(req,res){
	var username=req.body.username;
	var pass=req.body.password;
	var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
        if(err) throw err;
        db.collection("users", function(err, users){
          if(err) throw err;
          users.find(req.body,function(err, items){
            res.status(200);
            res.end(items);
          });
        });
      });
});

//---------------------------------------------------
//Directs the user to a user profile. This could be
//a page that only the user can see their own profile
//or if we want we can let them view other user
//profiles.
//---------------------------------------------------
app.get('/profile', function (req, res) {
  res.send("User Profile " + req.query.q);
});
