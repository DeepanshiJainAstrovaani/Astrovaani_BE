1. Prepare MySQL Database on Railway

Visit https://railway.app and create a new MySQL project.

Export your local database from phpMyAdmin or DBeaver.

Clean SQL file:

Remove LOCK TABLES, UNLOCK TABLES, SHOW WARNINGS, and SET statements.

Ensure ENGINE=InnoDB is used (not TYPE=InnoDB).

Avoid TEXT or LONGTEXT columns as UNIQUE KEY without a defined length.

Import SQL using DBeaver or CLI:

mysql -h yourhost -P port -u root -p railway < yourfile.sql

2. Connect Backend to Railway MySQL

In .env:

MYSQL_HOST=turntable.proxy.rlwy.net
MYSQL_PORT=52416
MYSQL_DATABASE=railway
MYSQL_USER=root
MYSQL_PASSWORD=your_password

3. Deploy Node.js Backend on Render

Go to https://render.com and create a new web service.

Connect GitHub repo or upload code.

Set Start Command: node server.js

Set environment variables:

MYSQL_HOST

MYSQL_PORT

MYSQL_USER

MYSQL_PASSWORD

MYSQL_DATABASE

The deployed backend URL will be like:

https://astrovaani-be.onrender.com

Test your endpoints via Postman or browser.