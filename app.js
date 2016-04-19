/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

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

//var ibmdb = require('ibm_db');
//ibmdb.open("DRIVER={DB2};DATABASE=SQLDB;HOSTNAME=75.126.155.153;UID=user17809;PWD=PWHK2WEyIvEo;PORT=50000;PROTOCOL=TCPIP", function (err,conn) {




//SQL Query for One Word: SELECT "dictionary" FROM "USER17809"."words" ORDER BY RAND() LIMIT 1
