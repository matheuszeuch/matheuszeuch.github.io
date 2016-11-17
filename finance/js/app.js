// App logic.
window.myApp = {};
window.debug = {};

document.addEventListener('init', function(event) {
  //document.ontouchmove = function(e) {e.preventDefault()};
  //bouncefix.add('scrollfix');
  $(function() {
    $(document).on("touchmove", function(evt) { evt.preventDefault() });
    $(document).on("touchmove", ".scrollable", function(evt) { evt.stopPropagation() });
  });

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
