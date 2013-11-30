var conn;
var username = "<span class = 'username' =>You: </span>";

var allConns = new Array();
var allPeers = new Array();

var othername;

// Connect to PeerJS, have server assign an ID instead of providing one
var peer = new Peer({key: 'lwjd5qra8257b9', debug: true});
		peer.on('open', function(id){
		$('#pid').text(id);
		allPeers.push(id);
  });  

// Await connections from others
peer.on('connection', connect);

// Connects our peers
function connect(c) {
    conn = c;
    $('#container').append('<br> Now chatting with ' + conn.peer);
    
	notifyOthers(c.peer);
	updateConns(conn);
	
	othername = "<span class = 'othername' =>" + conn.peer + ": </span>";
	
	//when you get data
	conn.on('data', function(data){
	
	if(data.indexOf("/nick") === 0)
	{
			var array = data.split(" ");
			data = array[1];
			$('#container').append('<br>' + othername + ' changed name to ' + data + '.'); 
			othername = "<span class = 'othername' =>" + data + ": </span>";
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
		$('#container').append('<br>' + othername + ' ' + data);
		$("#container").scrollTop($("#container").prop("scrollHeight"));
	  }
    });
	//when someone leaves
    conn.on('close', function(err){ alert(conn.peer + ' has left the chat.') });
 }

 //
 function notifyOthers(peer) {
	for(var i = 0; i < allConns.length; i++)
	{
		allConns[i].send("/add " + peer);
		allConns[i].send("please add " + peer);
	}
 }
 
 //updates internal and UI elements of peers
 function updateConns(c) {
	//console.log($.inArray(c, allConns));
	if($.inArray(c.peer, allPeers) === -1) {
		allConns.push(c);
		allPeers.push(c.peer);
		$('#connections').append('<br>' + c.peer);
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
			$('#container').append('<br>' + username + msg);
			$('#text').val('');
			$("#container").scrollTop($("#container").prop("scrollHeight"));
	  }
	});
  });  