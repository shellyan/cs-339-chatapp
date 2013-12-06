
$(document).ready(function() {

    $('#broadcast').click(function(){
    $('#broadcast').prop("disabled",true);
    $('#topic').prop("disabled",true);
    var topic = $('#topic').val();
    var peerID = $('#pid').text();
    request = $.ajax({
        url: 'http://cs-339-chatapp.herokuapp.com/'+ "twitter",
        type: "post",
        data: {
            "content":"Topic: #"+ topic + ". PeerID: "+ peerID
        }
    });
    request.done(function (response, textStatus, jqXHR){
        // log a message to the console
        alert("Hooray, posted to twitter!");
    });

    request.always(function () {
        // reenable the inputs
        $('#broadcast').prop("disabled",true);
        $('#topic').prop("disabled",true);
    });

    request.fail(function (jqXHR, textStatus, errorThrown){
        // log the error to the console
        alert(
            "The following error occured: "+
            textStatus, errorThrown
        );
    });


    console.log(topic);


});


});