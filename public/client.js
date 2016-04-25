/*globals io */
/*eslint-env jquery, browser*/
$(function() {
  
  var socket = io();
  
  function updateWord(message)
  {
  	document.getElementById("word").innerHTML = message;
  }

  // Socket events
	
  //Give the users the word
  socket.on('get word', function (data) {
    updateWord(data);
  });

});