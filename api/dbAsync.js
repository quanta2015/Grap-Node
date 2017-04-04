var mongoose = require('mongoose');
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var Job = require('./schema/job');
var config = require("../config")
mongoose.Promise = Promise;

exports.connect = function() {
    return new Promise(function(resolve, reject) {
        opt = {
            server: {
                reconnectTries: Number.MAX_VALUE,
                reconnectInterval: 1000
            }
        };
        mongoose.connect(config.url.db, opt);
        mongoose.connection.once("open", resolve);
        mongoose.connection.on("error", reject);
    })
}

mongoose.connection.on('connected', function() {
    console.log('mongoose default connection open to:' + config.url.db);
})


mongoose.connection.on('error', function(err) {
    console.log('mongoose 连接错误' + err);
})

mongoose.connection.on('disconnected', function() {
    console.log('mongoose 断开连接...');
})

exports.getUrl = function() {
    return new Promise(function(resolve, reject) {
        Job.find({}, function(err, ret) {
            if (err) {
                reject(err)
            } else {
                resolve(ret)
            }
        })
    })
}


exports.disconnect = function() {
    mongoose.connection.close()
}


exports.saveJobEx = function(posname, comp, money, area, pubdate, exp, edu, desc, url) {

    var job = new Job({
        posname: posname,
        company: comp,
        money: money,
        area: area,
        pubdate: pubdate,
        exp: exp,
        edu: edu,
        desc: desc,
        url: url
    })

    job.save(function(err, doc) {
        if (err) {
            console.log(err);
        }
    })
}


exports.updateDetail = function(id, count, type) {

    Job.update({
        _id: id
    }, {
        $set: {
            'count': count,
            'type': type
        }
    }, {
        upsert: true
    }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(index + ' update ok');
        }
    })

}