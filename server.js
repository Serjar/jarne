var express = require('express'),
    loc = require('./routes/locs');
    msg = require('./routes/messages'); 
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});



//
// Mensajes
//
//

app.get('/msg/getmaster/:id', msg.getAll);
app.get('/msg/servertime',msg.getServerTime);

app.post('/msg/write', msg.addMessage);
app.get('/msg/get/:id', msg.getMessagesForReceiver);

// Links de conversacion
//

app.get('/msg/getconvs', msg.getAllConvs);


// json : devicetoken, devicetype
app.put('/msg/openlink', msg.openConversation);
// json : devicetoken, devicetype, conversation
app.post('/msg/joinlink', msg.joinConversation);



app.listen(80);
console.log('Listening on port   80...');

















