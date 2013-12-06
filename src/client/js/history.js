

$(document).ready(function() {

    $('#history').click(function(){
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
            alert("Please copy the shared link:"+response);
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