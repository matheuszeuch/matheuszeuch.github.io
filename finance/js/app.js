// App logic.
window.myApp = {};
window.debug = {};

document.addEventListener('init', function(event) {
  //document.ontouchmove = function(e) {e.preventDefault()};
  //bouncefix.add('scrollfix');
  $(document).on("touchmove", function(evt) { evt.preventDefault(); });
  $(document).on("touchmove", ".content", function(evt) {
    var startY, startTopScroll;
    var elem = this;
    elem.addEventListener('touchstart', function(event){
      startY = event.touches[0].pageY;
      startTopScroll = elem.scrollTop;
      if (startTopScroll <= 0) elem.scrollTop = 1;
      if (startTopScroll + elem.offsetHeight >= elem.scrollHeight) { elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1; evt.stopPropagation(); }
    }, false);
    //evt.stopPropagation();
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
