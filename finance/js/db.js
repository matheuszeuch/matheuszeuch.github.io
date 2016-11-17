window.db = {};

var databaseOptions = {
  fileName: "PersonalFinance_DraftV0.0003",
  version: "1.0",
  displayName: "Personal Finance",
  maxSize: 5 * 1024 * 1024
};

db = openDatabase(
  databaseOptions.fileName,
  databaseOptions.version,
  databaseOptions.displayName,
  databaseOptions.maxSize
);

db.dropTables = function() {
  db.transaction(
    function (transaction) {
      transaction.executeSql('DROP TABLE Account;');
      transaction.executeSql('DROP TABLE AccountType;');
      transaction.executeSql('DROP TABLE Category;');
      transaction.executeSql('DROP TABLE CategoryType;');
      transaction.executeSql('DROP TABLE Recurrence;');
      transaction.executeSql('DROP TABLE Event;');
    }
  );
}

db.createTables = function() {
  db.transaction(
    function( transaction ){
      transaction.executeSql("CREATE TABLE IF NOT EXISTS Account ( AccountID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, AccountTypeID INTEGER)");
      transaction.executeSql("CREATE TABLE IF NOT EXISTS AccountType ( AccountTypeID INTEGER PRIMARY KEY, Name TEXT)");
      transaction.executeSql("CREATE TABLE IF NOT EXISTS Category ( CategoryID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, ParentCategoryID INTEGER, CategoryTypeID INTEGER)");
      transaction.executeSql("CREATE TABLE IF NOT EXISTS CategoryType ( CategoryTypeID INTEGER PRIMARY KEY, Name TEXT, Multiplier INTEGER DEFAULT -1)");
      transaction.executeSql("CREATE TABLE IF NOT EXISTS Recurrence ( RecurrenceID INTEGER PRIMARY KEY AUTOINCREMENT, CategoryID INTEGER, Amount REAL, Description TEXT, RecurrenceTypeID INTEGER, RecurrenceValue INTEGER)");
      transaction.executeSql("CREATE TABLE IF NOT EXISTS Event ( EventID INTEGER PRIMARY KEY AUTOINCREMENT, Date INTEGER, Amount REAL, CategoryID INTEGER, Description TEXT, AccountID INTEGER)");
    }
  );
}

db.defaultValues = function() {
  db.transaction(
    function (transaction) {
      transaction.executeSql("INSERT OR REPLACE INTO CategoryType (CategoryTypeID, Name, Multiplier) VALUES (1, 'Receitas', 1)");
      transaction.executeSql("INSERT OR REPLACE INTO CategoryType (CategoryTypeID, Name, Multiplier) VALUES (2, 'Despesas', -1)");
    }
  );
}

db.reset = function() {
  db.dropTables();
  db.createTables();
  db.defaultValues();
}

db.options = {
  token: '9b911cfba51d2fc5d741315435e7a6878bd2113d',
  githuburl: 'https://api.github.com/repos/matheuszeuch/matheuszeuch.github.io/contents/finance/backups/websqldump.sql',
}

db.restore = function() {
  $.ajax({
    url: db.options.githuburl,
  }).done(function(r){
    db.dropTables();
    db.transaction(
      function (transaction) {
        var sql = Base64.decode(r.content).split('\n');
        for (i=0; i<=(sql.length-1); i++) {
          transaction.executeSql(sql[i]);
        }
      }
    );
  });
}

db.backup = function() {
  //debug("Starting the backup...");
  websqldump.export({
    database: databaseOptions.fileName,
    linebreaks: true,
    success: function(sql) {
      var sqlmin = LZString.compress(sql);
      var content = Base64.encode(sql);
      var token = db.options.token;
      var githuburl = db.options.githuburl; 
      $.ajax({
        url: githuburl,
      }).done(function(r){
        //debug("Backup file already exists. Updating it now...");
        $.ajax({
          url: githuburl,
          type: 'PUT',
          headers: {"Authorization": "token "+ token},
          data: '{"content": "'+ content +'", "sha": "'+ r.sha +'", "committer": {"name": "Matheus Zeuch", "email": "matheuszeuch@gmail.com"}, "message":""}'
        }).done(function(r){
          //debug("Backup completed successfully!");
        });
      }).fail(function (jqXHR, textStatus) {
        if (jqXHR.status === 404) {
          //debug("Backup file doesn't exists. Creating one now...");
          $.ajax({
            url: githuburl,
            type: 'PUT',
            headers: {"Authorization": "token "+ token},
            data: '{"content": "'+ content +'", "committer": {"name": "Matheus Zeuch", "email": "matheuszeuch@gmail.com"}, "message":""}'
          }).done(function(r){
            //debug("Backup completed successfully!");
          });
        }
      });
    }
  });
}


//db.reset();

