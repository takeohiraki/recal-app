$(document).ready(function () {

  $(".refresh").on("click", function (event) {
    $.ajax("/home", {
      type: "GET"
    }).then(
      function () {
        location.reload();
      }
    );
  });

});