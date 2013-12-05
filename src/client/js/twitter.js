

$(document).ready(function() {

    $('#broadcast').click(function(){
    $('#broadcast').prop("disabled",true);
    $('#topic').prop("disabled",true);
    var topic = $('#topic').val();
    var peerID = $('#pid').text();
    request = $.ajax({
        url: "http://127.0.0.1:5000/twitter",
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