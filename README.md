### Train Ticket Booking

1. APIs
  a. GET /user/history -> Gives history of all bookings made by the user.<br/><br/>
  b. POST /user/book -> Book ticket(s).<br/><br/>
  c. POST /auth/signup -> Register a user.<br/><br/>
  d. POST /auth/login -> Create a session for user.<br/><br/>
  e. GET /auth/logout -> Logout user.<br/><br/>
  f. POST /train/status -> Gives status of train by train_no or all.<br/><br/>
  g. POST /train/revenue -> Gives the revenue of the train by train_no.<br/><br/>
  h. POST /train/arrivals -> List all arrival of trains at a particular station.<br/><br/>
  i. POST /train/stops -> List all stops for the given train.<br/><br/>
  j. GET /train/list -> List all trains between source and destination stations on a given day.<br/><br/>

2. Storage Mechanism<br/><br/>
  a. PostgreSQL: A RDMS which can scale very well.<br/><br/>
  b. Redis: Persistent storage to get and set frequent values.<br/><br/>

3. Populate DB: There are 2 dump files in this repo, PostgreSQL dump and redis-dump.<br/><br/>
  a. PostgreSQL dump: File name "psql_dump". You can use this file by ```psql manosriram < psql_dump```<br/><br/>
  b. Redis dump: File name "dump.rdb". Just save this file to your default redis-dump location. (which can be seen with the command ```config get dir```
     in redis-cli).<br/><br/>
