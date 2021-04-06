### Train Ticket Booking

1. Storage Mechanism<br/><br/>
  a. PostgreSQL: A RDMS which can scale very well.<br/><br/>
  b. Redis: Persistent storage to get and set frequent values.<br/><br/>

2. Populate DB: There are 2 dump files in this repo, PostgreSQL dump and redis-dump.<br/><br/>
  a. PostgreSQL dump: File name "psql_dump". You can use this file by ```psql manosriram < psql_dump```<br/><br/>
  b. Redis dump: File name "dump.rdb". Just save this file to your default redis-dump location. (which can be seen with the command ```config get dir```
     in redis-cli).<br/><br/>

### Database Design

![db-design](https://ik.imagekit.io/09vbfltqtgx/railway-db-design_TCDiCpWN0b.png)
