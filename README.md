### Train Ticket Booking

1. Storage Mechanism<br/>
  a. PostgreSQL: A RDMS which can scale very well.<br/>
  b. Redis: Persistent storage to get and set frequent values.<br/>

2. Populate DB: There are 2 dump files in this repo, PostgreSQL dump and redis-dump.<br/>
  a. PostgreSQL dump: File name "psql_dump". You can use this file by ```psql manosriram < psql_dump```<br/>
  b. Redis dump: File name "dump.rdb". Just save this file to your default redis-dump location. (which can be seen with the command ```config get dir```
     in redis-cli).<br/>

### Database Design

![db-design](https://ik.imagekit.io/09vbfltqtgx/railway-db-design_TCDiCpWN0b.png)

### .env
PGUSER=manosriram<br/>
PGHOST=localhost<br/>
PGPASSWORD=password<br/>
PGDATABASE=manosriram<br/>
PGPORT=3211

### Steps to run

1. In the root folder, do ```npm install```.<br/>
2. Make sure the redis-server is running. ```redis-server --daemonize yes```<br/>
3. Start the server using ```npm run dev```.<br/>
