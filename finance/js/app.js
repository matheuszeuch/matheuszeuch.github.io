// App logic.
window.myApp = {};
window.debug = {};

document.addEventListener('init', function(event) {
  //document.ontouchmove = function(e) {e.preventDefault()};
  //bouncefix.add('scrollfix');
  $(document).on("touchmove", function(evt) { evt.preventDefault(); });
  $(document).on("touchmove", ".content", function(evt) { if (this.scrollHeight > this.offsetHeight) { evt.stopPropagation(); }}, false);

  debug = function(text) {
    $("#console").append("<p>" + text + "</p>");
    console.log(text);
  }

  var page = event.target;

  // Each page calls its own initialization controller.
  if (myApp.controllers.hasOwnProperty(page.id)) {
    myApp.controllers[page.id](page);
  }

  // Fill the lists with initial data when the pages we need are ready.
  // This only happens once at the beginning of the app.
  if (page.id === 'homePage') {
  }
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}