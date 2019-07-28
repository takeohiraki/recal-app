$(document).ready(function () {

    console.log("ran get_calendar")
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    var accessToken = getCookie("access_token")


    /*     $.get("/api/google/calendar/events", function (data) {
            console.log(data);
        }); */


    $.ajax({
        url: '/google-refresh-token',
        type: "POST",
        data: {
            'accessToken': accessToken
        }
    }).done(function (data) {
        console.log("google-refresh-token: " + data)

        console.log("retrieving google token")
        $.ajax({
            url: "/api/google/calendar/events/",
            type: "POST",
            data: {
                'googleRefreshToken': data
            }
        }).done(function (data) {

        })
    })
})


    // Example starter JavaScript for disabling form submissions if there are invalid fields
/*     (function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);
    })(); */
