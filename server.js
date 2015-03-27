var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
var MongoClient=require('mongodb').MongoClient;
app.use(bodyParser.json());
http.createServer(app).listen(8080);
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


//Takes a json template containing attributes we are looking for and returns user json if is valid or "-1" if invalid
app.post('/validateuser', function(req,res){
  var jsonData='';
   req.on('data', function(chunk){jsonData+=chunk;});
   req.on('end', function () {
   jsonData=JSON.parse(jsonData);
   var MongoClient = require('mongodb').MongoClient;
   MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
        if(err) throw err;
        db.collection("users", function(err, users){
          if(err) throw err;
          users.findOne(jsonData,function(err, items){
            res.status(200);
	    if(items)
	    	res.end(JSON.stringify(items));
	    else
		res.end("-1");
          });
        });
      });
    });
});

//call this with all the data in json that should be inserted as that user
app.post('/insertuser', function(req,res){
  var jsonData='';
   req.on('data', function(chunk){jsonData+=chunk;});
   req.on('end', function () {
   jsonData=JSON.parse(jsonData);
   var MongoClient = require('mongodb').MongoClient;
   MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
			if(err)
				throw err;
			db.collection('users').insert(jsonData, function(err,records){});
	});
   });
   res.writeHead(200);
   res.end();
});

//call this with json we want to update--also needs to include username to findthe right user
app.post('/updateuser', function(req,res){
  var jsonData='';
   req.on('data', function(chunk){jsonData+=chunk;});
   req.on('end', function () {
    jsonData=JSON.parse(jsonData);                                          
	  var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
        if(err) throw err;
        db.collection("users").findAndModify(
    		{ username: jsonData.username },     // query
    		[],               // represents a sort order if multiple matches
    		{ $set: jsonData },   // update statement
    		{ new: true },    // options - new to return the modified document
    		function(err,doc) {
    			if(err)
    				res.writeHead(500);
    			else
    			{
    				res.writeHead(200);
    				res.end(JSON.stringify(doc));
    			}
    		});
      });
    });
});

//Call this with json representing user we want to remove
app.post('/removeuser', function(req,res){
  var jsonData='';
   req.on('data', function(chunk){jsonData+=chunk;});
   req.on('end', function () {
    jsonData=JSON.parse(jsonData);                                          
	  var MongoClient = require('mongodb').MongoClient;
      MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
        if(err) throw err;
        db.collection("users").remove(jsonData, function(err,removed){
        	if(err)
        		res.writeHead(500);
        	else
        		res.writeHead(200);
        	res.end();
        });
      });
    });
});

