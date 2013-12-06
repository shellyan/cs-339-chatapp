/* 
This is the javascript used in conjunction with index.html and style.css
*/

var username = "<span class = 'username' =>You: </span>"; //your 'name; output to screen next to your messages

var allConns = new Array();
var allPeers = new Array();

// Connect to PeerJS, server assigns ID
var peer = new Peer({key: 'lwjd5qra8257b9', debug: true});
//var peer = new Peer({host: '10.23.54.117', port: 49445, debug: true});  
		peer.on('open', function(id){
		$('#pid').text(id);
		allPeers.push(id);
		updateConns();
  });  
// Await connections from others
peer.on('connection', connect);

// Connects our peers
function connect(c) {
    var conn = c;
    $('#container').append('Now chatting with ' + conn.peer + '<br>');
    
	notifyOthers(c.peer);
	addConns(conn);
	
	var othername = "<span class = 'othername' => <font color=\"green\">" + conn.peer + ":</font> </span>";
	
	//when you get data
	conn.on('data', function(data){
	
	var array = data.split(" ");
	
	switch(array[0])
	{
		case "/add":
			data = array[1];
			console.log(data);
		
			if($.inArray(data, allPeers) === -1) {
				c = peer.connect(data);
				connect(c);
			}
			break;
		case "/nick":
			data = array[1];
			$('#container').append(othername + ' changed name to ' + data + '. <br>'); 
			othername = "<span class = 'othername' => <font color=\"green\">" + data + ":</font> </span>";
			break;
		case "(whisper)":
			var whisper = "<span class = 'whisper' => <font color=\"purple\">" + conn.peer + ': ' + data + "</font> </span>";
			$('#container').append(whisper + '<br>');
			break;
		default:
			$('#container').append(othername + ' ' + data + '<br>');
			$("#container").scrollTop($("#container").prop("scrollHeight"));
			break;
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
		index = allConns.indexOf(c);
		allConns.splice(index, 1);
		for(var i = 0; i < allConns.length; i++)
		{
			console.log("remaining connections " + allConns[i]);
		}
		updateConns();
	}
 }
 
 //updates UI
 function updateConns() {
	$('#connections').empty();
	for(var i = 0; i < allPeers.length; i++) {
		$('#connections').append( allPeers[i]+'<br>' );
	}
 }
 
$(document).ready(function() {



    //radio selection
    $('input:radio[name=type]').change(function(){
        var checkval = $(this).val();
        $('#connect').prop('disabled', checkval == 'broadcast');
        $('#rid').prop('disabled', checkval == 'broadcast');
        $('#broadcast').prop('disabled', checkval == 'connect');
        $('#topic').prop('disabled', checkval == 'connect');
    });

    //save history
//    $('#history').click(function(){
//        var history = document.getElementById('container')
//        alert(history.innerText)
//    });


	// Connect to a peer
    $('#connect').click(function(){
      var c = peer.connect($('#rid').val());
	  $('#rid').val("");
      c.on('open', function(){
        connect(c); //sets up a connection between the peers
      });
      c.on('error', function(err){ alert(err) });  
    });
	
    // Send a chat message
    $('#send').submit(function(e){
	  e.preventDefault();
      var msg = $('#text').val();
	  $('#text').val("");
	  
	  var array = msg.split(" ");
	  
	  switch(array[0]) 
	  { 
			case "/nick":
				for(var i = 0; i < allConns.length; i++)
				{
					allConns[i].send(msg);
				}
				$('#container').append('You changed your nickname to ' + data + '.<br>'); 
				$('#container').scrollTop($("#container").prop("scrollHeight")); 
				break; 
			case "/w": 
				var target = array[1]; 
				for(var i = 0; i < allConns.length; i++) 
				{ 
					if(allConns[i].peer === target) 
					{
						allConns[i].send("(whisper) " + msg.slice(3 + target.length));
						var whisper = "<span class = 'whisper' => <font color=\"purple\">" + 'You: ' +"(whisper) " + msg.slice(3 + target.length) + "</font> </span>";
						$('#container').append(whisper + '<br>'); 
						$("#container").scrollTop($("#container").prop("scrollHeight")); 
						break; 
					} 
				} 
				break; 
			default:
				for(var i = 0; i < allConns.length; i++)
				{
					allConns[i].send(msg);
				}		
				$('#container').append(username + msg + '<br>'); 
				$("#container").scrollTop($("#container").prop("scrollHeight")); 
				break; 
		}
	});
  });  