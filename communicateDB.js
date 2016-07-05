﻿module.exports = {
    sendContactToDb: sendContactToDb//,
    //find: findAllFromDb
}

var mycon = require('./connToMongo');
var server_ip = 'localhost';
var mongodb = require('mongodb');
var async = require('async');
var server = new mongodb.Server(server_ip, 27017, { auto_reconnect: true });
var log = console.log;
var db = new mongodb.Db('mydb', server);




function sendContactToDb(clientdata) {
    var phoneContact = clientdata.phoneContact;
    var userid = clientdata.userid;
    var userpw = clientdata.userpw;

    try {
        async.waterfall([
            function (callback) {
                log("waterfall 1");
                db.open(function (err, db) {
                    if (err) callback(err, db);
                    else callback(null, db);
                });
            },
            function (db, callback) {
                log("waterfall 2");
                db.collection('myElement', function (err, collection) {
                    if (err) callback(err, db);
                    else callback(null, collection);
                });
            },
            function (collection, callback) {
                log("waterfall 3");
                for (var i = 0; i < phoneContact.length; i++) {
                    mycon.insert(collection, phoneContact[i], callback);
                }
                callback(null, collection);
                
            },
            function (collection, callback) {
                log("waterfall 4");
                var cons = { _id: 1 };
                var opt = {};
                async.waterfall([
                    function (callback) { mycon.find(collection, cons, opt, callback); },
                    function (docs, callback) { console.log(docs); callback(null, null); }
                ], function (err, res) {
                    if (err) callback(err);
                    else callback(null, null);
                })
            }
        ],
        function (err, result) {
            log("waterfall end");
            if (err) throw err;
            else log(result);
            db.close();
        });
    } catch (err) {
        log("waterfall error");
        log(err);
    }
}



function sendContactToDb2(clientdata) {
    var phoneContact = clientdata.phoneContact;
    var userid = clientdata.userid;
    var userpw = clientdata.userpw;
    db.open(function (err, db) {
        if (err) console.log(err);
        db.collection(userid, function (err, collection) {
            if (err) console.log(err);
            var tasks = {};
            for (var i = 0; i < phoneContact.length; i++) {
                tasks['func' + i] = new function (callback) {
                    mycon.insert(collection, phoneContact[i], callback);
                }
            }
            async.parallel(tasks, function (err, results) {
                if (err) console.log(err);
                console.log(results);
            });
        });
    });
}
