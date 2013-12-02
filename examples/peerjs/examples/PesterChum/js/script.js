/* 
This is the javascript used in conjunction with index.html and style.css
*/


var conn;
var username = "<span class = 'username' =>You: </span>"; //your 'name; output to screen next to your messages

var allConns = new Array();
var allPeers = new Array();

// Connect to PeerJS, server assigns ID
var peer = new Peer({key: 'lwjd5qra8257b9', debug: true});
		peer.on('open', function(id){
		$('#pid').text(id);
		allPeers.push(id);
		updateConns();
  });  

// Await connections from others
peer.on('connection', connect);

// Connects our peers
function connect(c) {
    conn = c;
    $('#container').append('Now chatting with ' + conn.peer + '<br>');
    
	notifyOthers(c.peer);
	addConns(conn);
	
	var othername = "<span class = 'othername' => <font color=\"green\">" + conn.peer + ":</font> </span>";
	
	//when you get data
	conn.on('data', function(data){
	
	if(data.indexOf("/nick") === 0)
	{
			var array = data.split(" ");
			data = array[1];
			$('#container').append(othername + ' changed name to ' + data + '. <br>'); 
			othername = "<span class = 'othername' => <font color=\"green\">" + data + ":</font> </span>";
			
	}
	  else if(data.indexOf("/add") === 0)
	  {
		var array = data.split(" ");
		data = array[1];
		console.log(data);
		
		if($.inArray(data, allPeers) === -1) {
			c = peer.connect(data);
			connect(c);
		}
	  }
	  else
	  {
		$('#container').append(othername + ' ' + data + '<br>');
		$("#container").scrollTop($("#container").prop("scrollHeight"));
	  }
    });
	//when someone leaves
    conn.on('close', function(err){ 
	removeConns(conn);
	$('#container').append(conn.peer + 'has left the chat.<br>');
	});
 }

 function processCommand(command, data){
	
 }
 
 
 //tells others to add to call.
 function notifyOthers(peer) {
	for(var i = 0; i < allConns.length; i++)
	{
		allConns[i].send("/add " + peer);
	}
 }
 
 //adds a peer + conn
 function addConns(c) {
	//console.log($.inArray(c, allConns));
	if($.inArray(c.peer, allPeers) === -1) {
		allConns.push(c);
		allPeers.push(c.peer);
		updateConns();
	}
}
 
 //removes a peer
 function removeConns(c) {
	var index = allPeers.indexOf(c.peer);
	if(index!=-1){
		allPeers.splice(index, 1);
		updateConns();
	}
 }
 
 //updates UI
 function updateConns() {
	$('#connections').empty();
	$('#connections').append('Peers in Chat');
	for(var i = 0; i < allPeers.length; i++) {
		$('#connections').append('<br>' + allPeers[i]);
	}
 }
 
$(document).ready(function() {
    
	// Connect to a peer
    $('#connect').click(function(){
      var c = peer.connect($('#rid').val());
      c.on('open', function(){
        connect(c); //sets up a connection between the peers
      });
      c.on('error', function(err){ alert(err) });  
    });
	
    // Send a chat message
    $('#send').submit(function(e){
	  e.preventDefault();
      var msg = $('#text').val();
      for(var i = 0; i < allConns.length; i++)
	  {
		allConns[i].send(msg);
	  }
	  
	  if(msg.indexOf("/nick") === 0)
	  {
			var array = msg.split(" ");
			data = array[1];
			$('#container').append('<br>You changed your nickname to ' + data + '.');
			$('#text').val('');
			$('#container').scrollTop($("#container").prop("scrollHeight"));			
	  }
	  else
	  {
			$('#container').append(username + msg + '<br>' );
			$('#text').val('');
			$("#container").scrollTop($("#container").prop("scrollHeight"));
	  }
	});
  });  