// JavaScript Document
var client;
var uniqid = Date.now();

$(function () {
    $(".note").draggable();
    $(".note").each(function () {
        var numberW = $(this)[0].dataset.xpos;
        var numberH = $(this)[0].dataset.ypos;
        $(this).animate({
            left: "+=" + numberW,
            top: "+=" + numberH
        }, 1000);
    });
});

$(document).ready(function () {
    $("#notes-ul").on("dragstop", "li", function (event, ui) {
        client.publish('/updates', {
            client: uniqid,
            id: ui.helper[0].dataset.noteid,
            xpos: ui.position.left,
            ypos: ui.position.top
        });
        $.ajax({
            type: "POST",
            url: "/note/" + ui.helper[0].dataset.noteid,
            data: {
                xpos: ui.position.left,
                ypos: ui.position.top
            }
        });
    });
    //
    $("#notes-ul").on("click", "i", function (e) {
        var noteID = $(this).parent('a').parent('li')[0]['dataset'].noteid;
        $(this).parent('a').parent('li').remove();
        client.publish('/notes', {
            client: uniqid,
            status: 'delete',
            id: noteID
        });
        $.ajax({
            type: "DELETE",
            url: "/note/" + noteID
        });
    });
    //
    $('#addicon').magnificPopup({
        type: 'inline',
        preloader: false,
        src: 'test-form',
        callbacks: {
            beforeOpen: function () {
                if ($(window).width() < 700) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#note_t';
                }
            }
        }
    });
    //
    $("#test-form").submit(function (event) {
        event.preventDefault();
        $.magnificPopup.close();
        var messageD = $('#note_t').val();
        $.ajax({
            type: "POST",
            url: "/notes/",
            data: {
                message: messageD
            },
        })
            .done(function (res) {
                $('#note_t').val("");
                $("#notes-ul").append("<li class='note' id='" + res.id + "' data-noteid=" + res.id + " data-xpos=0 data-ypos=0><a><h2>" + res.title + "</h2><p>" + messageD + "</p><i class='fa fa-trash-o fa-2x trash-icon'></i></a></li>");
                client.publish('/notes', {
                    client: uniqid,
                    status: 'new',
                    id: res.id,
                    title: res.title,
                    message: messageD
                });
                $(".note").draggable();
            });
    });
});

$(window).load(function () {
    // executes when complete page is fully loaded, including all frames, objects and images
    client = new Faye.Client('/messages');
    var subscription = client.subscribe('/updates', function (message) {
        if (message.client == uniqid) return;
        $('#' + message.id).animate({
            left: message.xpos,
            top: message.ypos
        }, 1000);
    });
    // end callback
    var subscription2 = client.subscribe('/notes', function (message) {
        if (message.client == uniqid) return;
        if (message.status == 'new') {
            $("#notes-ul").append("<li class='note' id='" + message.id + "' data-noteid=" + message.id + " data-xpos=0 data-ypos=0><a><h2>" + message.title + "</h2><p>" + message.message + "</p><i class='fa fa-trash-o fa-2x trash-icon'></i></a></li>");
            $(".note").draggable();
        } else {
            // delete note
            $('#' + message.id).remove();
        }
    });
});
