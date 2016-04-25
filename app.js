/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

console.log("App started");

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require("express");

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

var http = require('http').Server(app);

var io = require('socket.io')(http);

app.listen(appEnv.port, appEnv.bind, function() {
		console.log("Server starting on " + appEnv.url);
});



<<<<<<< HEAD
=======

>>>>>>> 28924340cf66c43e6dea0c44146f417e86a926e2
io.on("connection", function (socket) {
	
	console.log("a user connected!");
	
	
  socket.on('get word', function () {
  	var str = pullWord();
  	console.log(str);
    socket.broadcast.emit('get word', {
      word: str
    });
  });
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	
});

<<<<<<< HEAD



//********************Connect to database and get string********************
var env = null;
var key = -1;
if (process.env.VCAP_SERVICES) {
	env = JSON.parse(process.env.VCAP_SERVICES);
    key = findKey(env,'SQLDB');
}
=======
>>>>>>> 28924340cf66c43e6dea0c44146f417e86a926e2






function pullWord(){
	//********************Connect to database and get string********************
	var word = null;
	var env = null;
	var key = -1;
	if (process.env.VCAP_SERVICES) {
		env = JSON.parse(process.env.VCAP_SERVICES);
	    key = findKey(env,'SQLDB');
	}

	var ibmdb = require('ibm_db');
	var credentials = env[key][0].credentials;
	var dsnString = "DRIVER={DB2};DATABASE=" + credentials.db + ";UID=" + credentials.username + ";PWD=" + credentials.password + ";HOSTNAME=" + credentials.hostname + ";port=" + credentials.port;
      
	ibmdb.open(dsnString, function (err, connection) {
    if (err) 
    {
      	console.log(err);
      	return;
    }
    	connection.query("SELECT \"dictionary\" FROM \"USER17809\".\"words\" ORDER BY RAND() FETCH FIRST 1 ROWS ONLY", function (err1, rows) {
      	if (err1) console.log(err1);
      	else 
      	{
      		console.log(rows[0].dictionary);
      		word = rows[0].dictionary;
  		}

      	connection.close(function(err2) { 
        	if(err2) console.log(err2);
      	});
    	});
	});
	
	return word;
}

function findKey(obj,lookup) {
   for (var i in obj) {
      if (typeof(obj[i]) === "object") {
         if (i.toUpperCase().indexOf(lookup) > -1) {
            // Found the key
            return i;
         }
         findKey(obj[i],lookup);
      }
   }
   return -1;
}
//********************Connect to database and get string********************

