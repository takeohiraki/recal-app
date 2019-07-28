$(document).ready(function () {

  $('#project-search').on('keyup ', function (s) {

    $.each($('.droppableProjectDiv'), function (index, item) {

      var textVal = $(item).find('.messageText').text().toLowerCase();

      if (textVal.indexOf($('#project-search').val().toLowerCase()) < 0) {
        $(item).hide();
      } else {
        $(item).show();
      }
    });
  });

  var projectIds = $('.droppableProjectDiv').map(function () {
    return this.id.split('__')[1];
  }).get();

  var postData = projectIds;

  function getProjectEvents() {
    $.ajax({
      type: "POST",
      url: '/project/events',
      data: {
        projectIds: postData
      },
      success: function (data) {
        $.each(data.project_events, function (index, item) {

          var droppableId = item.project_id;
          var draggableId = item.event_id;

          var selectedEvents = data.events.filter(function (item) {
            return item.id == draggableId
          });

          if (selectedEvents.length > 0) {
            var eventDesc = selectedEvents[0].description;
            var eventDescTrimmed = eventDesc.substring(0, Math.min(15, eventDesc.length)) + '...';

            var toolTipSpan = '<span  id="customToolTip__' + draggableId + '__' + droppableId + '" class="customToolTip">' + eventDesc + '</span>'

            $('<span id="projectBadge__' + draggableId + '__' + droppableId + '" class="projectBadge badge badge-primary"><span class="projectBadgeMessage">' + eventDescTrimmed +
              '</span><button type="button" class="closeProjectDraggable close" aria-label="Close">' +
              '<span aria-hidden="true">×</span>' +
              '</button>' + toolTipSpan +
              '</span>').appendTo($("#droppableProjectDivEventArea__" + droppableId));
          }
        });
      }
    });
  }

  getProjectEvents();


  function getProjectHTMLElement(project) {
    return '<div id="projectDraggableDiv__' + project.id + '" ' +
      'class="projectDraggableDiv list-group list-group-item list-group-item-action flex-column align-items-start">' +
      '<button id="projectDeleteButton__' + project.id + '" type="button" class="close projectDeleteButton"' +
      'data-dismiss="modal" aria-label="Close">' +
      '<span aria-hidden="true">×</span>' +
      '</button>' +
      '<b><p id="projectDraggableMessage__' + project.id + '"><i class="fa fa-hashtag" aria-hidden="true"></i>&nbsp;' + '<span class="messageText">' + project.description + '</span>' + '</p></b>' +
      '<p class="usertitle"><i class="fa fa-user-circle-o" aria-hidden="true"></i><span>&nbsp;&nbsp;' + project.name + '</span></p>' +
      '<p class="datetime">Date Created: ' + project.createdAt + '"</p>' +
      '</div>'
  }


  $(".projectDeleteButton").off('click');
  $(".projectDeleteButton").on('click', function (event) {
    deleteProject($(this)[0].id);
  });

  var addProjectForm = $("form[name='addProjectForm']").validate({
    rules: {
      projectName: "required",
      projectDescription_text: "required"
    },
    messages: {
      projectName: "<b>Please input your name.</b>",
      projectDescription_text: "<b>Please input a description.</b>"
    },
    submitHandler: function (form) {
      form.submit();
    }
  });

  $("#addProjectButton").click(function (s) {
    //need to reset tje form messages
    $('#createNewProjectModal').modal('show');
    $('#createNewProjectModal').on('shown.bs.modal', function () {

      $('#closeProjectModalButton').off('click');
      $("#projectName").val("");
      $("#projectDescription_text").val("");
      addProjectForm.resetForm();
      $("#addProjectModalStatus").text("");

      $('#closeProjectModalButton').click(function (s) {
        $('#createNewProjectModal').modal('hide');
      });

      $('#addProjectModalButton').off('click');
      $('#addProjectModalButton').click(function (s) {

        $("#addProjectModalStatus").text('');
        var valid = $("form[name='addProjectForm']").valid();

        if (valid) {

          $('#addProjectModalButton').prop('disabled', true);

          var projectName = $("#projectName").val();
          var projectDescription = $("#projectDescription_text").val();

          var newProject = {
            text: projectDescription,
            command: '',
            user_name: projectName,
            user_id: -1
          };

          $.post("/api/project/add-event", newProject,
            function (data) {
              $('#addProjectModalButton').prop('disabled', false);
              $("#addProjectModalStatus").text('Project added successfully!');

              var projectElement = getProjectHTMLElement(data)
              $('#projectsdiv').prepend(projectElement);

              $(".projectDeleteButton").off('click');
              $(".projectDeleteButton").on('click', function (event) {
                deleteProject($(this)[0].id);
              });

              $(".projectDraggableDiv").draggable({
                helper: "clone"
              });

            });
          $("#projectName").val("");
          $("#projectDescription_text").val("");
          addProjectForm.resetForm();
        }
      });
    });
  });

  
  $(".projectDeleteButton").off('click');
  $(".projectDeleteButton").on('click', function (event) {

    var buttonId = $(this)[0].id.split('__')[1];

    $.ajax({
        itemId: $(this)[0].id,
        url: '/api/project/delete-project',
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


  $(".droppableProjectDiv").droppable({
    accept: ".eventDraggableDiv",
    drop: function (event, ui) {
      var draggableId = ui.draggable[0].id.split('__')[1];
      var droppableId = event.target.id.split('__')[1];

      var eventDesc = $("#eventDraggableMessage__" + draggableId)[0].innerText;
      var eventDescTrimmed = $("#eventDraggableMessage__" + draggableId)[0].innerText.substring(0, Math.min(15, eventDesc.length)) + '...';

      if ($('#projectBadge__' + draggableId + '__' + droppableId).length > 0) {
        return false;
      }

      var toolTipSpan = '<span  id="customToolTip__' + draggableId + '__' + droppableId + '" class="customToolTip">' + eventDesc + '</span>'

      $('<span  id="projectBadge__' + draggableId + '__' + droppableId + '" class="projectBadge badge badge-primary"><span class="projectBadgeMessage">' + eventDescTrimmed +
        '</span><button type="button" class="closeProjectDraggable close" aria-label="Close">' +
        '<span aria-hidden="true">×</span>' +
        '</button>' + toolTipSpan +
        '</span>').appendTo($("#droppableProjectDivEventArea__" + droppableId))

      $.post("/api/project/add-event", {
          event_id: draggableId,
          project_id: droppableId
        },
        function (data) {
          $(ui.helper[0]).toggle("scale");
        });
    }
  });

  $(document).on("click", ".closeProjectDraggable", removeNote);

  function removeNote() {
    $(this).closest("span").remove();
  }

});