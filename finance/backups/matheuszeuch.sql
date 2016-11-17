CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE Account ( AccountID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, AccountTypeID INTEGER);
CREATE TABLE AccountType ( AccountTypeID INTEGER PRIMARY KEY, Name TEXT);
CREATE TABLE Category ( CategoryID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, ParentCategoryID INTEGER, CategoryTypeID INTEGER);
CREATE TABLE CategoryType ( CategoryTypeID INTEGER PRIMARY KEY, Name TEXT, Multiplier INTEGER DEFAULT -1);
INSERT INTO CategoryType(CategoryTypeID,Name,Multiplier) VALUES ("1","Receitas","1");
INSERT INTO CategoryType(CategoryTypeID,Name,Multiplier) VALUES ("2","Despesas","-1");
CREATE TABLE Recurrence ( RecurrenceID INTEGER PRIMARY KEY AUTOINCREMENT, CategoryID INTEGER, Amount REAL, Description TEXT, RecurrenceTypeID INTEGER, RecurrenceValue INTEGER);
CREATE TABLE Event ( EventID INTEGER PRIMARY KEY AUTOINCREMENT, Date INTEGER, Amount REAL, CategoryID INTEGER, Description TEXT, AccountID INTEGER);