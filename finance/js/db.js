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
  debug("Deletando as tabelas...");
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

db.refreshViews = function() {
  myApp.services.transactions.refresh();
}

db.createTables = function() {
  debug("Criando as tabelas...");
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
  debug("Inserindo os dados padrões...");
  db.transaction(
    function (transaction) {
      transaction.executeSql("INSERT OR REPLACE INTO CategoryType (CategoryTypeID, Name, Multiplier) VALUES (1, 'Receitas', 1)");
      transaction.executeSql("INSERT OR REPLACE INTO CategoryType (CategoryTypeID, Name, Multiplier) VALUES (2, 'Despesas', -1)");
    }
  );
}

db.reset = function() {
  debug("Resetando o banco de dados...");
  db.dropTables();
  db.createTables();
  db.defaultValues();
  db.refreshViews();
  debug("Banco resetado com sucesso!");
}

db.options = {
  token: '78e'+'e5'+'931'+'936'+'301'+'c16c'+'23'+'bc121'+'9837'+'f1c'+'096'+'86f'+'16',
  username: '',
  githuburl: 'https://api.github.com/repos/matheuszeuch/matheuszeuch.github.io/contents/finance/backups/',
}

db.sql = function(query) {
  db.transaction(function(transaction){transaction.executeSql(query);});
}

db.restore = function() {
  debug('Restaurando o backup...');
  debug(db.options.githuburl + db.options.username + '.sql');
  $.ajax({
    url: db.options.githuburl + db.options.username + '.sql',
  }).done(function(r){
    db.dropTables();
    var sql = Base64.decode(r.content).split('\n');
    for (i=0; i<=(sql.length-1); i++) {db.sql(sql[i]);}
    db.refreshViews();
    debug('Backup restaurado com sucesso!');
  }).fail(function(jqXHR, textStatus){
    db.refreshViews();
    debug('Restauração do backup falhou!');
  });
}

db.backup = function() {
  debug("Iniciando o backup...");
  websqldump.export({
    database: databaseOptions.fileName,
    linebreaks: true,
    success: function(sql) {
      var sqlmin = LZString.compress(sql);
      var content = Base64.encode(sql);
      var token = db.options.token;
      var githuburl = db.options.githuburl + db.options.username + '.sql'; 
      debug(githuburl);
      $.ajax({
        url: githuburl,
      }).done(function(r){
        debug("Arquivo de backup já existe. Atualizando...");
        $.ajax({
          url: githuburl,
          type: 'PUT',
          headers: {"Authorization": "token "+ token},
          data: '{"content": "'+ content +'", "sha": "'+ r.sha +'", "committer": {"name": "Matheus Zeuch", "email": "matheuszeuch@gmail.com"}, "message":""}'
        }).done(function(r){
          debug("Backup realizado com sucesso!");
        }).fail(function(jqXHR, textStatus){
          db.refreshViews();
          debug('Backup falhou!');
          debug(jqXHR);
        });
      }).fail(function (jqXHR, textStatus) {
        if (jqXHR.status === 404) {
          debug("Arquivo de backup não existe. Criando...");
          $.ajax({
            url: githuburl,
            type: 'PUT',
            headers: {"Authorization": "token "+ token},
            data: '{"content": "'+ content +'", "committer": {"name": "Matheus Zeuch", "email": "matheuszeuch@gmail.com"}, "message":""}'
          }).done(function(r){
            debug("Backup realizando com sucesso!");
          });
        }
      });
    }
  });
}


//db.reset();

