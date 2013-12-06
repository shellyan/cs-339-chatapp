

$(document).ready(function() {

    $('#history').click(function(){
        $('#history').prop("disabled",true);
        $('#history').prop("value",'Generating shared link...');
        alert("saved to evernote");


        var history = document.getElementById('container')
        request = $.ajax({
            url: 'http://cs-339-chatapp.herokuapp.com/history',
            type: "post",
            data: {
                "content":history.innerText
            }
        });
        request.done(function (response, textStatus, jqXHR){
            // log a message to the console
//            alert("saved to evernote");
            $('#shared_url').text(response);
            $('#shared_url').prop("href",response);
            $('#history').prop("disabled",false);
            $('#history').prop("value",'Save chat history');

        });

        request.always(function () {
            // reenable the inputs
        });

        request.fail(function (jqXHR, textStatus, errorThrown){
            // log the error to the console
            alert(
                "The following error occured: "+
                textStatus, errorThrown
            );
        });


//        console.log(history.innerText);


});


});