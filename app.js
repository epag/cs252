/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

console.log("App started");

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
//var server = app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  //console.log("server starting on " + appEnv.url);
  
  
//});


var http = require('http').Server(app);

var io = require('socket.io')(http);

http.listen(appEnv.port);

io.on('connection', function (socket) {
	
	console.log("a user connected!");
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	});
	
});

var env = null;
   var key = -1;
   // Look for an entry in the VCAP_SERVICES environment variable that has 
   // the serviceName string in it
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
    connection.query("SELECT \"dictionary\" FROM \"USER17809\".\"words\" ORDER BY RAND() LIMIT 1", function (err1, rows) {
      if (err1) console.log(err1);
      else console.log(rows);
      connection.close(function(err2) { 
        if(err2) console.log(err2);
      });
    });
});

function findKey(obj,lookup) {
   for (var i in obj) {
      if (typeof(obj[i])==="object") {
         if (i.toUpperCase().indexOf(lookup) > -1) {
            // Found the key
            return i;
         }
         findKey(obj[i],lookup);
      }
   }
   return -1;
}


//SQL Query for One Word: SELECT "dictionary" FROM "USER17809"."words" ORDER BY RAND() LIMIT 1
