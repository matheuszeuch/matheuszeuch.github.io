/***********************************************************************
 * App Controllers. These controllers will be called on page initialization. *
 ***********************************************************************/

myApp.controllers = {

  settingsPage: function() {
    //myApp.services.settings.load();
    var username = getCookie('username');
    if (username && username != 'undefined') {
      db.options.username = getCookie('username');
    } else {
      ons.notification.prompt({
        message: 'Inform your username:',
        callback: function(prompt) {
          if (prompt && prompt != 'undefined') {
              setCookie('username', prompt, 365*10);
              db.options.username = prompt;
              db.executeRestore();
          }
        }
      });
    }
  },

  settingsConfigPage: function() {
    var username = getCookie('username');
    if (username && username != 'undefined') $('#username').val(username);
  },

  navigatorPage: function(page) {
  },

  newTransactionPage: function(page) {
  },

  transactionsPage: function(page) {
    myApp.services.transactions.refresh();
      var pullHook = document.getElementById('pull-hook');
      if (pullHook) {
        pullHook.addEventListener('changestate', function(event) {
          var message = '';
          switch (event.state) {
            case 'initial':
              message = '<span ng-switch-when="initial"><ons-icon size="35px" icon="ion-arrow-down-a"></ons-icon> Pull down to refresh</span>';
              break;
            case 'preaction':
              message = '<span ng-switch-when="preaction"><ons-icon size="35px" icon="ion-arrow-up-a"></ons-icon> Release to refresh</span>';
              break;
            case 'action':
              message = '<span ng-switch-when="action"><ons-icon size="35px" spin="true" icon="ion-load-d"></ons-icon> Refreshing...</span>';
              break;
          }
          pullHook.innerHTML = message;
        });
        pullHook.onAction = function(done) { setTimeout(done, 1000); };
      }
  },

  homePage: function(page) {
  },

};
