/* 
This is the javascript used to add functionality to our PeerJS app.
*/

var username = "<span class = 'username' =>You: </span>"; //your 'name'; output to screen next to your messages

var allConns = new Array(); //list of all current connections
var allPeers = new Array(); //list of all current peers of allConns (needed so we do not have duplicate conncetions)

// Connect to PeerJS, server assigns ID
var peer = new Peer({key: 'lwjd5qra8257b9', debug: true});
		peer.on('open', function(id){
		$('#pid').text(id);
		allPeers.push(id);
		updateConns();
  });  
// Await connections from others
peer.on('connection', connect);

//Prompts the user that their twitter discussion will be removed if they leave the page.
window.onbeforeunload = function(){
    if($('#connect').is(":disabled")==true&&$('#broadcast').is(":disabled")==true){
        deleteTweet($('#pid').text());
        return null;
    }
    return null;
}

// Connect to a peer
$('#connect').click(function(){
  var c = peer.connect($('#rid').val());
  $('#rid').val("");
  c.on('open', function(){
    connect(c); //sets up a connection between the peers
  });
  c.on('error', function(err){ alert(err) });
});





function searchTopic(id){
    request = $.ajax({
    url: 'http://cs-339-chatapp.herokuapp.com/search',
//    url: 'http://127.0.0.1:5000/search',
    type: "post",
    data: {
        "content": id
    }
    });
    request.done(function (response, textStatus, jqXHR){
        // log a message to the console
//        alert("Hooray, posted to twitter!");
        $('#chat_title').text(response)
    });


    request.fail(function (jqXHR, textStatus, errorThrown){
        // log the error to the console

        alert(
            "The following error occured: "+
            textStatus, errorThrown
        );
    });
}


// Connects our peers
function connect(c) {
    var conn = c;
    $('#container').append('Now chatting with ' + conn.peer + '<br>');
    if($('#chat_title').text().indexOf('Chat')>0){
        searchTopic(conn.peer);
    }
	notifyOthers(c.peer);
	addConns(conn);
	
	//disable connect button once connected
    $('#broadcast_radio').prop('disabled', true);
	
	var othername = "<span class = 'othername' => <font color=\"green\">" + conn.peer + ":</font> </span>";
	
	//when you get data
	conn.on('data', function(data){
	
	var array = data.split(" ");
	
	//different commands
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
	$('#container').append(conn.peer + ' has left the chat.<br>');
    deleteTweet(conn.peer);
	});
 }

 //tells others to add your new peer to their list of connections.
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


 //deletes the tweet once the broadcaster leaves the room
function deleteTweet(id){
        console.log('trying to delete '+ id);
        request = $.ajax({
            url: 'http://cs-339-chatapp.herokuapp.com/delete',
    //        url: 'http://127.0.0.1:5000/delete',
            type: "post",
            async: false,

            data: {
                "content": id

            }
        });

        request.done(function (response, textStatus, jqXHR){
        });

        request.fail(function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR);
        });

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
	  
	  //various commands
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