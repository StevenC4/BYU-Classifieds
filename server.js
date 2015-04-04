var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
app.use(bodyParser.json());
http.createServer(app).listen(80);
app.use('/', express.static('./html', {maxAge: 60*60*1000}));

//---------------------------------------------------
//Directs the user to the home page
//---------------------------------------------------
app.get('/', function (req, res) {
  res.sendFile('template.html', {root: './html/'});
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
        db.collection("users").findOne({username: jsonData.username}, function(err,record){
      if(!record)
      {
			   db.collection("users").insert(jsonData, function(err,records){});
         res.writeHead(200);
         res.end();
      }
      else
      {
        res.writeHead(200);
        res.end("exists");
      }
	    });
   });
   });
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


app.post('/find', function (req, res) {
  var jsonData='';
   req.on('data', function(chunk){jsonData+=chunk;});
   req.on('end', function () {
    jsonData=JSON.parse(jsonData);
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
    if(err) throw err;
    db.collection("ads", function(err, ads){
      if(err) throw err;
      ads.find({Title : new RegExp(jsonData.Title)}, function(err, items){
        items.toArray(function(err, itemArr){
          res.writeHead(200);
          res.end(JSON.stringify(itemArr));
        });
      });
    });
  });
});
});

//---------------------------------------------------
//Get All Items
//---------------------------------------------------
app.get('/get_all_items', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
    if(err) {
      res.writeHead(500);
      res.end("Error");
    }
    db.collection("ads", function(err, ads){
      if(err) {
        res.writeHead(500);
        res.end("Error");
      }
      ads.find(function(err, items){
        items.toArray(function(err, itemArr){
          console.log("Document Array: ");
          console.log(itemArr);
          res.writeHead(200);
          res.end(JSON.stringify(itemArr));
        });
      });
    });
  });
});

//---------------------------------------------------
//Get Item
//---------------------------------------------------
app.post('/get_item', function (req, res) {
  var jsonData='';
  req.on('data', function(chunk){jsonData+=chunk;});
  req.on('end', function () {
    jsonData=JSON.parse(jsonData);
    console.log(jsonData.ID);
    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
      if(err) {
        res.writeHead(500);
        res.end("Error");
      }
      db.collection("ads", function(err, ads){
        ads.findOne({_id: ObjectId(jsonData.ID)}, function(err, items) {
          if(err){
            console.log(err);
            res.writeHead(500);
            res.end("Error");
          }
          console.log(items);
          res.writeHead(200);
          res.end(JSON.stringify(items));
        });
      });
    });
  });
});

//---------------------------------------------------
//Get Items of certain category
//---------------------------------------------------
app.post('/get_category_items', function (req, res) {
  var jsonData='';
  req.on('data', function(chunk){jsonData+=chunk;});
  req.on('end', function () {
    jsonData=JSON.parse(jsonData);
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
      if(err) throw err;
      db.collection("ads", function(err, ads){
        if(err) {
          res.writeHead(500);
          res.end("Error");
        }
        ads.find({Category: new RegExp(jsonData.Category)}, function(err, items){
          items.toArray(function(err, itemArr){
            if(err){
              res.writeHead(500);
              res.end("Error");
            }
            console.log("Document Array: ");
            console.log(itemArr);
            res.writeHead(200);
            res.end(JSON.stringify(itemArr));
          });
        });
      });
    });
  });
});

//---------------------------------------------------
//Post Item
//
//Title = Name of the ad
//Picture = picture of the item
//UserID = ID of the user that posted the item
//PostDate = Date of when the item was posted
//Category = Chosen category of the item
//Bought = Boolean of whether it was bought or sold
//Comments = List of comment objects of userID and comment
//---------------------------------------------------
app.post('/post_item', function (req, res) {
  var jsonData='';
  req.on('data', function(chunk){jsonData+=chunk;});
  req.on('end', function () {
    jsonData=JSON.parse(jsonData);
    console.log(jsonData);
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
      if(err) {
        res.writeHead(500);
        res.end("Error");
      }
      db.collection('ads').insert(jsonData, function(err,records){
        if(err) {
          res.writeHead(500);
          res.end("Error");
        }
        console.log(records);
        res.writeHead(200);
        res.end("Success");
      });
    });
  });
});

//---------------------------------------------------
//Delete Item
//---------------------------------------------------
app.post('/delete_item', function (req, res) {
  var jsonData='';
  req.on('data', function(chunk){jsonData+=chunk;});
  req.on('end', function () {
    jsonData=JSON.parse(jsonData);
    console.log(jsonData.ID);
    var ObjectId = require('mongodb').ObjectID;
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
      if(err) {
        res.writeHead(500);
        res.end("Error");
      }
      db.collection('ads', {}, function(err, ads) {
          ads.remove({_id: ObjectId(jsonData.ID)}, function(err, result) {
              if (err) {
                  console.log(err);
                  db.close();
                  res.writeHead(500);
                  res.end("Error");
              }
              console.log(result);
              db.close();
              res.writeHead(200);
              res.end("Success");
          });
      });
    });
  });
});

//---------------------------------------------------
//Comment on Item
//---------------------------------------------------
app.post('/comment', function (req, res) {
  var jsonData='';
  req.on('data', function(chunk){jsonData+=chunk;});
  req.on('end', function () {
    jsonData=JSON.parse(jsonData);
    var ObjectId = require('mongodb').ObjectID;
    var Comment = {UserID: jsonData.UserID, Comment: jsonData.Comment}
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
      if(err) {
        res.writeHead(500);
        res.end("Error");
      }
      db.collection('ads').findAndModify(
        {_id: ObjectId(jsonData.ID)},
        [],
        {$addToSet: {Comments: Comment}},
        {},
        function(err, object) {
          if (err){
            console.warn(err.message);
            res.writeHead(500);
            res.end("Error");
          }
          console.log(object);
          res.writeHead(200);
          res.end("Success");
        });
    });
  });
});

app.post('/remove_all_items', function (req, res) {
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db) {
    if(err) {
      res.writeHead(500);
      res.end("Error");
    }
    db.collection('ads', {}, function(err, ads) {
        ads.remove({}, function(err, result) {
            if (err) {
                console.log(err);
                db.close();
                res.writeHead(500);
                res.end("Error");
            }
            console.log(result);
            db.close();
            res.writeHead(200);
            res.end("Success");
        });
    });
  });
});
