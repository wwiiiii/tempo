﻿var server_ip = 'localhost';
var mongodb = require('mongodb');
var server = new mongodb.Server(server_ip, 27017, { auto_reconnect: true });

var db = new mongodb.Db('mydb', server);
db.open(function (err, db) {
    if (!err) {
        db.collection('widget', function (err, collection) {
            if (err) console.log(err);
            collection.remove(null, { safe: true }, function (err, result) {
                if (!err) {
                    console.log('result of remove ' + result);
                    var widget1 = {
                        title: 'first widget',
                        desc: 'this is desc',
                        prices: 14.99
                    };
                    var widget2 = {
                        title: 'second widget',
                        desc: 'this is desc2',
                        prices: 25.99
                    };
                    collection.insert(widget1);
                    collection.insert(widget2, { safe: true }, function (err, result) {
                        if (err) console.log(err);
                        else console.log(result);
                        db.close();
                    });
                    collection.find({ prices: 25.99 }).toArray(function (err, docs) {
                        if (err) console.log(err);
                        else console.log(docs);
                    });
                }
                else console.log(err);
            });
        });
    }
    else console.log(err);
});