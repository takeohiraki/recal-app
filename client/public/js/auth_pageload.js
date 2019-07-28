$(document).ready(function() {
  console.log("running?");
  var tokenName = window.location.hash
    .split("&")[0]
    .replace("#", "")
    .split("=")[0];
  var accessToken = window.location.hash
    .split("&")[0]
    .replace("#", "")
    .split("=")[1];

  console.log(tokenName);
  console.log(accessToken);

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  setCookie(tokenName, accessToken, 3);
  console.log("ran");
});
