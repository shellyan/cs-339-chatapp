var conn;
var username = "<span class = 'username' =>You: </span>";
var othername;
// Connect to PeerJS, have server assign an ID instead of providing one
var peer = new Peer({key: 'lwjd5qra8257b9', debug: true});
		peer.on('open', function(id){
		$('#pid').text(id);
  });  
  
// Await connections from others
peer.on('connection', connect);
 function connect(c) {
    conn = c;
    $('#container').empty().append('Now chatting with ' + conn.peer); 
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
	  else
	  {
		$('#container').append('<br>' + othername + ' ' + data);
		$("#container").scrollTop($("#container").prop("scrollHeight"));
	  }
    });
    conn.on('close', function(err){ alert(conn.peer + ' has left the chat.') });
 }

$(document).ready(function() {
    // Connect to a peer
    $('#connect').click(function(){
      var c = peer.connect($('#rid').val());
      c.on('open', function(){
        connect(c);
      });
      c.on('error', function(err){ alert(err) });  
    });
	
    // Send a chat message
    $('#send').submit(function(e){
	  e.preventDefault();
      var msg = $('#text').val();
      conn.send(msg);
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