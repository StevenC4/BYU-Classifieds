var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var fs = require('fs-extra');
var qt=require('quickthumb');
var url = require('url');
var app = express();
var util=require('util');
var formidable=require('formidable');
var crypto=require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser=require("cookie-parser");
var methodOverride=require('method-override');
var session=require('express-session');
var mongoose=require('mongoose');
mongoose.connect("mongodb://localhost/byu-classifieds");
var db= mongoose.db;
var userSchema = mongoose.Schema({
    username: String,
    password: String,
    firstname: String,
    lastname: String,
    address: [],
    phoneNumbers: [],
    ads: [],
    email: String,
    fb: Boolean
});
userSchema.methods.validPassword=function(pwd){
    return (this.password===pwd);
};
var User = mongoose.model('users', userSchema);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({secret: 'blah', resave: true,
saveUninitialized: true}));
app.use(methodOverride());
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: 12345678910,
    clientSecret: "a",
    callbackURL: "http://52.10.83.44/auth/facebook/callback",
    profileFields: ['id', 'emails', 'displayName', 'name']
  },
  function(access_token, refresh_token, profile, done) {
   
    process.nextTick(function() {
      console.log(profile); 
      // find the user in the database based on their facebook id
      User.findOne({ 'id' : profile.id }, function(err, user) {
 
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);
 
          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
            // if there is no user found with that facebook id, create them
            var newUser = new User();
 
            // set all of the facebook information in our user model
            newUser.username    = profile.id; // set the users username                 
                               
            newUser.firstname=profile.name.givenName;
	    newUser.lastname=profile.name.familyName;
	    newUser.fb=true;
            // save our user to the database
            newUser.save(function(err) {
              if (err)
                throw err;
 
              // if successful, return the new user
              return done(null, newUser);
            });
         } 
      });
    });
})
);

//if login is called with username and password, it will redirect to success if auth is successful
//or it will redirect to failureRedirect if auth is a failure
//failuerFlash will flash a warning if it is set to True and the page is configured right
app.post('/login',
  passport.authenticate('local', { successRedirect: '/#/profile/',
                                   failureRedirect: '/#/404',
     					failureFlash: false})
);

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if(user.fb) //the user was created through fb
      {
	   return done(null, false, { message: 'Must use facebook'});
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user); //the user is legit
    });
  }
));

app.get('/logout', function(req, res){
  req.logout(); //kills the cookie
  res.redirect('/');
});

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/#/profile/',
                                      failureRedirect: '/#/404' }));

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//Can use this function as middleware for any protected endpoints
//Can also change the redirect to point to whatever page when user is not logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {return next(); }
  res.redirect('/#/login')
}

http.createServer(app).listen(80);

app.use('/', express.static('./html', {maxAge: 60*60*1000}));

app.use(qt.static(__dirname + '/'));

app.post('/upload', function (req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
  });

  form.on('end', function(fields, files) {
    var temp_path = this.openedFiles[0].path;
    var file_name = this.openedFiles[0].name;
    
    var new_location = 'uploads/';
    var id = crypto.randomBytes(20).toString('hex');
    fs.copy(temp_path, new_location + id + file_name, function(err) {  
      if (err) {
        console.error(err);
	res.end("error");
      } else {
	res.end(id+file_name);
        console.log("success!")
      }
    });
  });
});

// Show the upload form	
app.get('/uploadform', function (req, res){
 res.writeHead(200, {'Content-Type': 'text/html' });
  var form = '<form action="/upload" enctype="multipart/form-data" method="post"><input multiple="multiple" name="upload" type="file" /><br><br><input type="submit" value="Upload" /></form>';
  res.end(form); 
}); 

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
                    if(items){
                        res.cookie('user', JSON.stringify(items));
                        res.end(JSON.stringify(items));
                    } else {
                        res.end("-1");
                    }
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
                    res.end("created");
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

app.get('/getuser', function(req, res){
    var jsonData = '';
    req.on('data', function(chunk){jsonData += chunk});
    req.on('end', function(){
        jsonData=JSON.parse(jsonData);
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect("mongodb://localhost/byu-classifieds", function(err, db){
            if (err)
                throw err;
            db.collection("users").findOne({_id: jsonData.id}, function(err, record){
                if (!record) {
                    res.writeHead(200);
                    res.end(-1);
                } else {
                    res.writeHead(200);
                    res.end(record);
                }
            })
        })
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
        console.log("\nGet Category Items, JSON Request:\n" + jsonData);
        jsonData =JSON.parse(jsonData);
        console.log("\nGet Category Items, Parsed JSON:\n" + JSON.stringify(jsonData, null, 2));
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
