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
var server = app.listen(appEnv.port, '0.0.0.0', function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
  
  
});

<<<<<<< HEAD
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
	
	console.log("a user connected!");
	
	socket.on('disconnect', function() {
		console.log('user disconnected');
	})
	
});




=======
//MYSQL Query for One Word: SELECT "dictionary" FROM "USER17809"."words" ORDER BY RAND() LIMIT 1
>>>>>>> 905212ee2437c67a416c93178784d093cd81ecad
