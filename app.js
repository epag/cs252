/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

/*globals word:true */
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


app.get('/', function(res) {
		res.sendFile('/public/index.html');
});

var word;
var time2;
var SSID;

//We pull the word because the first time is always undefined
pullWord();
console.log(word);

var clients = {};

io.on("connection", function (socket) {
	
	console.log("a user connected!");	
	clients[socket.id] = socket;
	
  socket.on('get word', function () {
	pullWord();

	console.log("Get Word: " + word);
  	
    io.emit('message', word);
  });
  
  	socket.on("select winner", function(time1)
  	{
  		if(time2 !== null)
  		{
  			if(time1 > time2)
			{
				console.log("Winner is user1");
				socket.sendFile("/public/win.html");
				clients[SSID].sendFile("/public/lose.html");
				SSID = null;
				time2 = null;
			}
			else if (time1 < time2)
			{
				console.log("Winner is user2");
				socket.sendFile("/public/lose.html");
				clients[SSID].sendFile("/public/win.html");
				SSID = null;
				time2 = null;
			}
			else if (time1 === time2)
			{
				//Highly unlikely
				console.log("Tie");
				socket.sendFile("/public/win.html");
				clients[SSID].sendFile("/public/win.html");
			}
  		}
  		else
  		{
  			time2 = time1;
  			SSID = socket.id;
  		}
  	});
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	
});

http.listen(appEnv.port, function(){
	console.log("listening on " + appEnv.port);
});


function pullWord(){
	//********************Connect to database and get string********************
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
      		word = rows[0].dictionary;
      		//console.log("Database returns: " + rows[0].dictionary + "\n");
      		//console.log(word);
      		connection.close(function(err2) { 
        	if(err2) console.log(err2); });
      		return;
  		}

      	connection.close(function(err2) { 
        	if(err2) console.log(err2);
      	});
    	});
	});
	
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

