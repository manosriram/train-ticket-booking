### Train Ticket Booking

1. APIs
  a. GET /user/history -> Gives history of all bookings made by the user.
  b. POST /user/book -> Book ticket(s).
  c. POST /auth/signup -> Register a user.
  d. POST /auth/login -> Create a session for user.
  e. GET /auth/logout -> Logout user.
  f. POST /train/status -> Gives status of train by train_no or all.
  g. POST /train/revenue -> Gives the revenue of the train by train_no.
  h. POST /train/arrivals -> List all arrival of trains at a particular station.
  i. POST /train/stops -> List all stops for the given train.
  j. GET /train/list -> List all trains between source and destination stations on a given day.

2. Storage Mechanism
  a. PostgreSQL: A RDMS which can scale very well.
  b. Redis: Persistent storage to get and set frequent values.

3. Transactions: A transaction is started when a seat is set to be booked, this makes sure we don't face problems like double-booking.
