var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true} );
db = new Db('locdb', server, {safe:true});

db.open(function(err, db) {
    console.log("Opening 'locdb' database");
    if(!err) {
        console.log("Connected to 'locdb' database");
        db.collection('locs', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'locs' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving loc: ' + id);
    db.collection('locs', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByName = function(req, res) {
    var name = req.params.name;
    console.log('Retrieving name: ' + name);
    db.collection('locs', function(err, collection) {
        collection.findOne({'name': name}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('locs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addLoc = function(req, res) {
    var loc = req.body;
    console.log('Adding loc: ' + JSON.stringify(loc));
    db.collection('locs', function(err, collection) {
        collection.insert(loc, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateLoc = function(req, res) {
    var id = req.params.id;
    var loc = req.body;
    console.log('Updating loc: ' + id);
    console.log(JSON.stringify(loc));
    db.collection('locs', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, loc, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating loc: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(loc);
            }
        });
    });
}

exports.deleteLoc = function(req, res) {
    var id = req.params.id;
    console.log('Deleting loc: ' + id);
    db.collection('locs', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.getValues = function(req, res) {
    db.collection('locs', function(err, collection) {
        collection.find({camera:req.params.id}, {value2:1,file:1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// // You'd typically not find this code in a real-life app, since the database would already exist.
 var populateDB = function() {

     var locs = [
         {
                 name: "1234567891",
                 lat : "40.479732600",
                 long  : "-3.5898299",
                 comment: "Madrid"
         },
         {
                 name: "1234567892",
                 long: "2.1744721999999683",
                 lat: "41.40357079",
                 comment: "Sagrada Familia"
         },
         {
                 name: "1234567893",
                 long: "-5.66082499999993",
                 lat:   "43.391522400",
                 comment: "Pola de Siero."
         }
    ];

    db.collection('locs', function(err, collection) {
        collection.insert(locs, {safe:true}, function(err, result) {});
    });
};
