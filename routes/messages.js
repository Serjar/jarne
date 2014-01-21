var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true} );
dbmsgs= new Db('msgdb', server, {safe:true});

dbmsgs.open(function(err, dbmsgs) {
    console.log("Opening 'msgs' database");
    if(!err) {
        console.log("Connected to 'msgs' database");
        dbmsgs.collection('msgs', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'msgss' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
        dbmsgs.collection('convs', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'convs' collection doesn't exist. Creating it with sample data...");
                populateDBConvs();
            }
        });        
    }
});

exports.getAll = function(req,res) {
    dbmsgs.collection('msgs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
}


exports.addMessage = function(req, res) {
    var loc = req.body;
    console.log('Adding msg: ' + JSON.stringify(loc));
    dbmsgs.collection('msgs', function(err, collection) {
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

exports.getMessagesForReceiver = function(req, res) {
    dbmsgs.collection('msgs', function(err, collection) {
        collection.find({destination:req.params.id}).toArray(function(err, items) {
            res.send(items);
        });
    });
}

/*
// conversaciones
//
//
*/

exports.getAllConvs = function(req, res) {
    dbmsgs.collection('convs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
		});
}

exports.openConversation = function(req,res) {
    var loc = req.body,
        code = 0;
		loc.user = "*";
    loc.usertype = "*";
    loc.code = 0;

    console.log('Open Conv: ' + JSON.stringify(loc));

    dbmsgs.collection('convs', function(err, collection) {

        collection.find({creator : loc.creator}).toArray(function(err, items) {
            if ((items.length)>0)  {
								res.statusCode = 201;
								res.send({'error':'Conversation exists'});
            }
						else {
								res.statusCode = 0;
								do {
										code = Math.floor(Math.random() * 9999)+1;
										console.log('Code:',code);
								}
								while (collection.find({code:code}).length == 1)
									
								loc.code = code;
								collection.insert(loc, {safe:true}, function(err, result) {
										if (err) {
											res.statusCode = 299;
											res.send({'error':'An error has occurred'});
										}
										else {	
												console.log('Success: ' + code); 
												res.send({'code' : code});
										}
								});
						}  
				});
    });
}

exports.joinConversation = function(req,res) {
        
    var loc = req.body;
    console.log('Join Conv: ' + JSON.stringify(loc));

    dbmsgs.collection('convs', function(err, collection) {

        collection.find({code : loc.code}).toArray(function(err, items) {
            if ((items.length)==0)  {
                res.statusCode = 203;
                res.send({'error':'Conversation not found'});
            }
						else {
								collection.update({ "_id":items[0]._id }, {$set : { user: loc.user, usertype: loc.usertype}}, function(err, result) {
                    if (err) {
                      res.statusCode = 299;
                      res.send({'error':'An error has occurred'});
                    }
                    else {  
                        console.log('Success: ' + loc.code ); 
                        res.send({'Connected': loc.code});
                    }
								});
						}
				});	
		});			
}




/* get YYYY:MM:DD */
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day + ":" + month + ":" + year + " - " + hour + ":" + min + ":" + sec;
}

exports.getServerTime = function(req, res) {
    res.send(getDateTime()); 
}
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with init  data -- Only used once: the first time the application is started.
 var populateDB = function() {

     var msg = [
         {
             link: "1234567891",
             lat : "40.479732600",
             long  : "-3.5898299",
             comment: "Welcome to Jarne",
             sender: "0",
             destination: "*"    
         }
    ];

    dbmsgs.collection('msgs', function(err, collection) {
        collection.insert(msg, {safe:true}, function(err, result) {});
    });
};

 var populateDBConvs = function() {

     var conv = [
         {
             code: "1234",
             creator : "0",
						 creatortype: "iOS7",
             user: "1",
             usertype:"iOS7"
         }
    ];

    dbmsgs.collection('convs', function(err, collection) {
        collection.insert(conv, {safe:true}, function(err, result) {});
    });
}


