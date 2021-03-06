var mongo = require('mongodb').MongoClient;
var config = require("../config")

exports.connect = function() {
    mongo.connect(config.url.db, function(err, db) {
        if (err) {
            return
        }
        console.log('connected to mongo')
        global._db = db
    });
};

exports.disconnect = function() {
    global._db.close()
};

exports.saveJobEx = function(posname, comp, money, area, pubdate, exp, edu, desc, url) {

    var job = {
        posname: posname,
        company: comp,
        money: money,
        area: area,
        pubdate: pubdate,
        exp: exp,
        edu: edu,
        desc: desc,
        url: url
    };
    var options = {
        upsert: true
    };

    var collection = global._db.collection('tmp');
    collection.insert(job, function(err, ret) {
        if (err) {
            console.log(err)
        }
    })
}