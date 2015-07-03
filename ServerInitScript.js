var conn = new Mongo();
var db = conn.getDB("byu-classifieds");

db.users.drop();
db.ads.drop();

var usersToInsert = [{
        "username": "sean",
        "firstName": "Sean",
        "lastName": "Lane",
        "address": {
            "street": "12345 Center St",
            "state": "UT",
            "zip": "84602",
            "city": "Provo"
        },
        "phoneNumber": {
            "type": "cell",
            "number":"8018675309"
        },
        "email": "byuclassifieds1@byu.edu"
    },
    {
        "username": "michael",
        "firstName": "Michael",
        "lastName": "Walker",
        "address": {
            "street": "98765 Center St",
            "state": "UT",
            "zip": "84600",
            "city": "Not Provo"
        },
        "phoneNumber": {
            "type": "cell",
            "number":"5551113333"
        },
        "email":"byuclassifieds2@byu.edu"
    },
    {
        "username": "steve",
        "firstName": "Steven",
        "lastName": "Carroll",
        "address": {
            "street": "555 Center St",
            "state": "UT",
            "zip": "84605",
            "city": "Provorem"
        },
        "phoneNumber": {
            "type": "cell",
            "number": "4844658464"
        },
        "email": "byuclassifieds3@byu.edu"
    },
    {
        "username": "scott",
        "firstName": "Scott",
        "lastName": "Hampton",
        "address": {
            "street": "777 Center St",
            "state": "UT",
            "zip": "84607",
            "city": "Provost"
        },
        "phoneNumber": {
            "type": "cell",
            "number": "7778889999"
        },
        "email": "byuclassifieds4@byu.edu"
    }];

db.users.insert(usersToInsert);

var adsToInsert = [
    {
        "title": "Crappy Laptop",
        "userID": db.users.findOne({ 'username': 'sean' })._id,
        "postDate": Date(),
        "category": "Computers",
        "bought": 0,
        "comments": [
            {
                "userID": db.users.findOne({ 'username': 'steve' })._id,
                "text" : "This is literally the worst laptop I have ever seen."
            }
        ]
    },
    {
        "title": "Lamp",
        "userID": db.users.findOne({ 'username': 'steve' })._id,
        "postDate": Date(),
        "category": "Furniture",
        "bought": 0,
        "comments": [
            {
                "userID": db.users.findOne({ 'username': 'michael' })._id,
                "text": "I love lamp."
            }
        ]
    },
    {
        "title": "CS 360 Textbook",
        "userID": db.users.findOne({ 'username': 'scott' })._id,
        "postDate": Date(),
        "category": "Textbooks",
        "bought": 0,
        "comments": [
            {
                "userID": db.users.findOne({ 'username': 'sean' })._id,
                "text": "If we fail the course, you might still need this."
            }
        ]
    },
    {
        "title": "Snowboard",
        "userID": db.users.findOne({ 'username': 'michael' })._id,
        "postDate": Date(),
        "category": "Sport Gear",
        "bought": 0,
        "comments": [
            {
                "userID": db.users.findOne({ 'username': 'scott' })._id,
                "text": "Wicked board, bro!"
            }
        ]
    }
];
db.ads.insert(adsToInsert);

