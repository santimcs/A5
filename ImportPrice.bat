@echo off
C:\xampp\mysql\bin\mysqlimport --user root -p --local --ignore-lines=1 --fields-terminated-by="," --lines-terminated-by="\r\n" stock data\PRICE.csv
pause