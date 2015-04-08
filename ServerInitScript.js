var conn = new Mongo();
var db = conn.getDB("byu-classifieds");

var usersToInsert = [
    { "username": "sean" },
    { "username": "michael" },
    { "username": "steve" },
    { "username": "scott" }];

db.users.insert(usersToInsert);

var adsToInsert = [
    {
        "title": "something awesome1",
        "picture": "",
        "userID": db.users.findOne({ 'username': 'sean' })._id,
        "postDate": "",
        "category": "",
        "bought": 0,
        "comments": []
    },
    {
        "title": "something awesome2",
        "picture": "",
        "userID": db.users.findOne({ 'username': 'sean' })._id,
        "postDate": "",
        "category": "",
        "bought": 0,
        "comments": []
    },
    {
        "title": "something awesome3",
        "picture": "",
        "userID": db.users.findOne({ 'username': 'sean' })._id,
        "postDate": "",
        "category": "",
        "bought": 0,
        "comments": []
    },
    {
        "title": "something awesome4",
        "picture": "",
        "userID": db.users.findOne({ 'username': 'scott' })._id,
        "postDate": "",
        "category": "",
        "bought": 0,
        "comments": []
    }
];
db.ads.insert(adsToInsert);

