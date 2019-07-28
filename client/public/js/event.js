$(document).ready(function () {

  $('#google-search').on('keyup ', function (s) {

    $.each($('.eventDraggableDiv'), function (index, item) {

      var textVal = $(item).find('.messageText').text().toLowerCase();

      if (textVal.indexOf($('#google-search').val().toLowerCase()) < 0) {
        $(item).hide();
      } else {
        $(item).show();
      }
    });
  });

  var eventIds = $('.droppableGoogleDiv').map(function () {
    return this.id.split('__')[1];
  }).get();

  var postData = eventIds;

  function getEventNotes() {
    $.ajax({
      type: "POST",
      url: '/events/notes',
      data: {
        eventIds: postData
      },
      success: function (data) {
        $.each(data.event_notes, function (index, item) {

          var droppableId = item.event_id;
          var draggableId = item.note_id;

          var selectedNotes = data.messages.filter(function (item) {
            return item.id == draggableId
          });

          if (selectedNotes.length > 0) {
            var noteDesc = selectedNotes[0].message_text;
            var noteDescTrimmed = noteDesc.substring(0, Math.min(15, noteDesc.length)) + '...';

            var toolTipSpan = '<span  id="customToolTip__' + draggableId + '__' + droppableId + '" class="customToolTip">' + noteDesc + '</span>'

            $('<span id="eventBadge__' + draggableId + '__' + droppableId + '" class="eventBadge badge badge-primary"><span class="eventBadgeMessage">' + noteDescTrimmed +
              '</span><button type="button" class="closeNoteDraggable close" aria-label="Close">' +
              '<span aria-hidden="true">×</span>' +
              '</button>' + toolTipSpan +
              '</span>').appendTo($("#droppableGoogleDivNoteArea__" + droppableId));
          }
        });
      }
    });
  }

  getEventNotes();

  $(".googleEventDeleteButton").off('click');
  $(".googleEventDeleteButton").on('click', function (event) {

    var buttonId = $(this)[0].id.split('__')[1];

    $.ajax({
        itemId: $(this)[0].id,
        url: '/api/google/delete-event',
        type: "DELETE",
        data: {
          id: buttonId
        }
      }).done(function (data) {
        $('#' + $(this)[0].itemId).parent().hide();
      })
      .fail(function () {})
      .always(function () {});
  });

  $(".droppableGoogleDiv").droppable({
    accept: ".noteDraggableDiv",
    drop: function (event, ui) {
      var draggableId = ui.draggable[0].id.split('__')[1];
      var droppableId = event.target.id.split('__')[1];

      var noteDesc = $("#noteDraggableMessage__" + draggableId)[0].innerText;
      var noteDescTrimmed = $("#noteDraggableMessage__" + draggableId)[0].innerText.substring(0, Math.min(15, noteDesc.length)) + '...';

      if ($('#eventBadge__' + draggableId + '__' + droppableId).length > 0) {
        return false;
      }

      var toolTipSpan = '<span  id="customToolTip__' + draggableId + '__' + droppableId + '" class="customToolTip">' + noteDesc + '</span>'

      $('<span id="eventBadge__' + draggableId + '__' + droppableId + '" class="eventBadge badge badge-primary"><span class="eventBadgeMessage">' + noteDescTrimmed +
        '</span><button type="button" class="closeNoteDraggable close" aria-label="Close">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' + toolTipSpan +
        '</span>').appendTo($("#droppableGoogleDivNoteArea__" + droppableId));

      $.post("/api/event/add-note", {
          note_id: draggableId,
          event_id: droppableId
        },
        function (data) {
          $(ui.helper[0]).toggle("scale");
        });

    }
  });

  $(document).on("click", ".closeNoteDraggable", removeNote);

  function removeNote() {
    $(this).closest("span").remove();
  };

  $(".eventDraggableDiv").draggable({
    helper: "clone"
  });

});