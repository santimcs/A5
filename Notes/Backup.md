Backup Process

For ruby, should clear unused files before save
rails tmp:cache:clear
rails log:clear

cd\Users\PC1\OneDrive\A5\data

1. mysql

ruby db_backup.rb portfolio_development May-18
ruby db_backup.rb stock May-18
ruby db_backup.rb music_development May-18

2. postgres password = admin

pg_dump -U postgres -d portpg_development -t stocks > stocks_backup.sql
pg_dump -U postgres -W -c portpg_development > portpg.sql

3. sqlite

copy c:\ruby\expense\db\development.sqlite3 c:\Users\PC1\OneDrive\Backup\expense\development.sqlite3
copy c:\ruby\port_lite\db\development.sqlite3 c:\Users\PC1\OneDrive\Backup\port_lite\development.sqlite3
copy c:\ruby\portlt\db\development.sqlite3 c:\Users\PC1\OneDrive\Backup\portlt\development.sqlite3
copy c:\ruby\portmy\db\development.sqlite3 c:\Users\PC1\OneDrive\Backup\portmy\development.sqlite3

# Restore process

MySQL

cd\Users\User\OneDrive\Documents\Backup\mysql

mysql -u root -p stock < stock_May-18.sql
mysql -u root -p portfolio_development < portfolio_development_May-18.sql
mysql -u root -p music_development < music_development_May-18.sql

Postgres

cd\Users\User\OneDrive\A5\Data

psql -U postgres -d portpg_development -f stocks_backup.sql

psql -U postgres portpg_development < portpg.sql


SQLite
copy c:\Users\User\OneDrive\Backup\port_lite\development.sqlite3 c:\ruby\port_lite\db\development.sqlite3
copy c:\Users\User\OneDrive\Backup\portlt\development.sqlite3 c:\ruby\portlt\db\development.sqlite3
copy c:\Users\User\OneDrive\Backup\portmy\development.sqlite3 c:\ruby\portmy\db\development.sqlite3
copy c:\Users\User\OneDrive\Backup\expense\development.sqlite3 c:\ruby\expense\db\development.sqlite3
