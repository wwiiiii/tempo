﻿var mycon = require('./connToMongo');

var server_ip = 'localhost';
var mongodb = require('mongodb');
var async = require('async');
var server = new mongodb.Server(server_ip, 27017, { auto_reconnect: true });
var log = console.log;
var db = new mongodb.Db('mydb', server);

try{
    async.waterfall([
        function (callback) {
            log("waterfall 1");
            db.open(function (err, db) {
                if (err) callback(err, db);
                else callback(null,db);
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
            var elem1 = {_id:1, name:"정태영", phone:"01044257107",email:"wwiiiii@kaist.ac.kr"};
            var elem2 = {_id:2, name:"이현",phone:"01087963194",email:"haneone15@kaist.ac.kr"};
            mycon.insert(collection , elem1);
            mycon.insert(collection , elem2);
            callback(null, collection);
        },
        function (collection, callback) {
            log("waterfall 4");
            var cons = {_id:1};
            var opt  = {};
            var res = mycon.find(collection , cons, opt);
            log(res);
            callback(null, res);
        }
    ],
    function (err, result) {
        log("waterfall end");
        if(err) throw err;
        else log(result);
        db.close();
    });    
} catch (err) {
    log("waterfall error");
    log(err);
}