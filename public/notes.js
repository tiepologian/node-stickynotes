// JavaScript Document
$(function() {
	$( ".note" ).draggable({
	    stop: function(event, ui) {
		$.ajax({
		    type: "POST",
		    url: "/note/" + ui.helper[0].dataset.noteid,
		    data: { xpos: ui.position.left, ypos: ui.position.top }
		});
	    }
	});	
	$(".note").each(function() {
	    var numberW = $(this)[0].dataset.xpos;
	    var numberH = $(this)[0].dataset.ypos;
		$(this).animate({
		    left: "+=" + numberW,
		    top: "+=" + numberH
	    }, 1000);
	});
});

$(document).ready(function() {
	$('#addicon').magnificPopup({
		type: 'inline',
		preloader: false,
		src: 'test-form',
		callbacks: {
			beforeOpen: function() {
				if($(window).width() < 700) {
					this.st.focus = false;
				} else {
					this.st.focus = '#note_t';
				}
			}
		}
	});
	//
    $('.trash-icon').click(function(e) {
        var noteID = $(this).parent('a').parent('li')[0]['dataset'].noteid;
	$(this).parent('a').parent('li').remove();
	$.ajax({
	    type: "DELETE",
	    url: "/note/"+noteID
	});
    });
    //
    $( "#test-form" ).submit(function( event ) {
        event.preventDefault();
	$.magnificPopup.close();
	var messageD = $('#note_t').val();
	$.ajax({
            type: "POST",
            url: "/notes/",
	    data: { message: messageD },
	})
	.done(function(res) {
	    console.log(res.id);
	    $('#note_t').val("");
	    $("#notes-ul").append("<li class='note' data-noteid=" + res.id + " data-xpos=0 data-ypos=0><a><h2>" + res.title + "</h2><p>" + messageD + "</p><i class='fa fa-trash-o fa-2x trash-icon'></i></a></li>");
	    $( ".note" ).draggable({
            stop: function(event, ui) {
                $.ajax({
                    type: "POST",
                    url: "/note/" + ui.helper[0].dataset.noteid,
                    data: { xpos: ui.position.left, ypos: ui.position.top }
                });
            }
        });
	});
    });
});
