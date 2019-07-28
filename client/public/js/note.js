$(document).ready(function () {

  $('#note-search').on('keyup ', function (s) {

    $.each($('.noteDraggableDiv'), function (index, item) {

      var textVal = $(item).find('.messageText').text().toLowerCase();

      if (textVal.indexOf($('#note-search').val().toLowerCase()) < 0) {
        $(item).hide();
      } else {
        $(item).show();
      }
    });
  });

  function getNoteHTMLElement(note) {
    return '<div id="noteDraggableDiv__' + note.id + '" ' +
      'class="noteDraggableDiv list-group list-group-item list-group-item-action flex-column align-items-start">' +
      '<button id="noteDeleteButton__' + note.id + '" type="button" class="close noteDeleteButton"' +
      'data-dismiss="modal" aria-label="Close">' +
      '<span aria-hidden="true">×</span>' +
      '</button>' +
      '<b><p id="noteDraggableMessage__' + note.id + '"><i class="fa fa-hashtag" aria-hidden="true"></i>&nbsp;' + '<span class="messageText">' + note.message_text + '</span>' + '</p></b>' +
      '<p class="usertitle"><i class="fa fa-user-circle-o" aria-hidden="true"></i><span>&nbsp;&nbsp;' + note.user_name + '</span></p>' +
      '<p class="datetime">Date Created: ' + note.createdAt + '"</p>' +
      '</div>'
  }

  function deleteNote(button_id) {
    var note_id = button_id.split('__')[1];

    $.ajax({
        itemId: button_id,
        url: '/api/slack/delete-agenda',
        type: "DELETE",
        data: {
          id: note_id
        }
      }).done(function (data) {
        $('#' + $(this)[0].itemId).parent().hide();
      })
      .fail(function () {})
      .always(function () {});
  }


  $(".noteDeleteButton").off('click');
  $(".noteDeleteButton").on('click', function (event) {
    deleteNote($(this)[0].id);
  });

  var addNoteForm = $("form[name='addNoteForm']").validate({
    rules: {
      noteUser: "required",
      noteMessage_text: "required"
    },
    messages: {
      noteUser: "<b>Please input your username.</b>",
      noteMessage_text: "<b>Please input a note.</b>"
    },
    submitHandler: function (form) {
      form.submit();
    }
  });


  $(".noteDraggableDiv").draggable({
    helper: "clone"
  });

  $("#addNoteButton").click(function (s) {
    //need to reset tje form messages
    $('#createNewNoteModal').modal('show');
    $('#createNewNoteModal').on('shown.bs.modal', function () {

      $('#closeNoteModalButton').off('click');
      $("#noteUser").val("");
      $("#noteMessage_text").val("");
      addNoteForm.resetForm();
      $("#addNoteModalStatus").text("");

      $('#closeNoteModalButton').click(function (s) {
        $('#createNewNoteModal').modal('hide');
      });

      $('#addNoteModalButton').off('click');
      $('#addNoteModalButton').click(function (s) {

        $("#addNoteModalStatus").text('');
        var valid = $("form[name='addNoteForm']").valid();

        if (valid) {

          $('#addNoteModalButton').prop('disabled', true);

          var noteUser = $("#noteUser").val();
          var noteMessage = $("#noteMessage_text").val();

          var newNote = {
            text: noteMessage,
            command: '',
            user_name: noteUser,
            user_id: -1
          };

          $.post("/api/slack/add-agenda", newNote,
            function (data) {
              $('#addNoteModalButton').prop('disabled', false);
              $("#addNoteModalStatus").text('Note added successfully!');

              var noteElement = getNoteHTMLElement(data)
              $('#slackNotes').prepend(noteElement);

              $(".noteDeleteButton").off('click');
              $(".noteDeleteButton").on('click', function (event) {
                deleteNote($(this)[0].id);
              });

              $(".noteDraggableDiv").draggable({
                helper: "clone"
              });

            });
          $("#noteUser").val("");
          $("#noteMessage_text").val("");
          addNoteForm.resetForm();
        }
      });
    });
  });

});