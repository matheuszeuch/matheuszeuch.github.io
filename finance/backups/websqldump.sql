CREATE TABLE sqlite_sequence(name,seq);
INSERT INTO sqlite_sequence(name,seq) VALUES ("Event","3");
CREATE TABLE Account ( AccountID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, AccountTypeID INTEGER);
CREATE TABLE AccountType ( AccountTypeID INTEGER PRIMARY KEY, Name TEXT);
CREATE TABLE Category ( CategoryID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, ParentCategoryID INTEGER, CategoryTypeID INTEGER);
CREATE TABLE CategoryType ( CategoryTypeID INTEGER PRIMARY KEY, Name TEXT, Multiplier INTEGER DEFAULT -1);
INSERT INTO CategoryType(CategoryTypeID,Name,Multiplier) VALUES ("1","Receitas","1");
INSERT INTO CategoryType(CategoryTypeID,Name,Multiplier) VALUES ("2","Despesas","-1");
CREATE TABLE Recurrence ( RecurrenceID INTEGER PRIMARY KEY AUTOINCREMENT, CategoryID INTEGER, Amount REAL, Description TEXT, RecurrenceTypeID INTEGER, RecurrenceValue INTEGER);
CREATE TABLE Event ( EventID INTEGER PRIMARY KEY AUTOINCREMENT, Date INTEGER, Amount REAL, CategoryID INTEGER, Description TEXT, AccountID INTEGER);
INSERT INTO Event(EventID,Date,Amount,CategoryID,Description,AccountID) VALUES ("1","null","5,00","null","Café","null");
INSERT INTO Event(EventID,Date,Amount,CategoryID,Description,AccountID) VALUES ("2","null","20,00","null","Almoço","null");
INSERT INTO Event(EventID,Date,Amount,CategoryID,Description,AccountID) VALUES ("3","null","15,00","null","Janta","null");