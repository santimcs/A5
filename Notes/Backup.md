Backup Process

For ruby, should clear unused files before save
rails tmp:cache:clear
rails log:clear

cd\Users\PC1\OneDrive\A5\data

1. mysql

ruby db_backup.rb portfolio_development Feb-28
ruby db_backup.rb stock Feb-28
ruby db_backup.rb music_development Feb-28

2. postgres password = admin

pg_dump -U postgres -d portpg_development -t stocks > stocks_backup.sql
pg_dump -U postgres -W -c portpg_development > portpg.sql

3. sqlite

copy c:\ruby\expense\db\development.sqlite3 c:\Users\PC1\OneDrive\A5\data\expense
copy c:\ruby\port_lite\db\development.sqlite3 c:\Users\PC1\OneDrive\A5\data\port_lite
copy c:\ruby\portlt\db\development.sqlite3 c:\Users\PC1\OneDrive\A5\data\portlt
copy c:\ruby\portmy\db\development.sqlite3 c:\Users\PC1\OneDrive\A5\data\portmy

# Restore process

MySQL
cd\A6\data
mysql -u root -p stock < stock_Feb-28.sql
mysql -u root -p portfolio_development < portfolio_development_Feb-28.sql
mysql -u root -p music_development < music_development_Feb-28.sql
mysql -u root -p nfl_development < nfl_development_Feb-28.sql
mysql -u root -p ucl_development < ucl_development_Feb-28.sql
mysql -u root -p bookstore_development < bookstore_development_Feb-28.sql

Postgres

psql -U postgres -d portpg_development -f stocks_backup.sql

psql -U postgres portpg_development < portpg.sql

psql -U postgres Badminton_development < Badminton.sql
psql -U postgres BBB_development < BBB.sql
psql -U postgres pl-2016_development < pl-2016.sql
psql -U postgres Snooker_development < Snooker.sql
psql -U postgres songs-to-remember_development < songs-to-remember.sql
psql -U postgres Tennis_development < Tennis.sql
psql -U postgres wc18_development < wc18.sql
psql -U postgres wc-uefa_development < wc-uefa.sql

SQLite
copy c:\Users\PC1\OneDrive\A5\data\port_lite\development.sqlite3 c:\ruby\port_lite\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\portlt\development.sqlite3 c:\ruby\portlt\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\portmy\development.sqlite3 c:\ruby\portmy\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\expense\development.sqlite3 c:\ruby\expense\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\program\development.sqlite3 c:\ruby\program\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\website\development.sqlite3 c:\ruby\website\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\documentation\development.sqlite3 c:\ruby\documentation\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\tv\development.sqlite3 c:\ruby\tv\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\sitepoint\development.sqlite3 c:\ruby\sitepoint\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\yt\development.sqlite3 c:\ruby\yt\db\development.sqlite3
copy c:\Users\PC1\OneDrive\A5\data\yt1\development.sqlite3 c:\ruby\yt1\db\development.sqlite3
