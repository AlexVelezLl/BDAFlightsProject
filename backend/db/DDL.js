const { Spanner } = require('@google-cloud/spanner');
const { instanceId, databaseId } = require('./bd.config');

const spanner = new Spanner({ projectId });

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

const schema = [
  `CREATE TABLE Flight (
        flightID    STRING(36)  NOT NULL,
        flightSource   STRING(20)  NOT NULL,
        flightDest    STRING(20)  NOT NULL,
        flightSeat  INT64  NOT NULL,
        ticketCost FLOAT64  NOT NULL
      ) PRIMARY KEY (flightID)`,

  `CREATE TABLE Booking (
        flightID    STRING(36) NOT NULL,
        bookingID    STRING(36) NOT NULL,
        bookDate    DATE
      ) PRIMARY KEY (flightID, bookingID),
      INTERLEAVE IN PARENT Flight ON DELETE CASCADE`,

  `CREATE TABLE BookingDetails (
        flightID    STRING(36) NOT NULL,
        bookingID    STRING(36)  NOT NULL,
        passengerID    STRING(36) NOT NULL
        ) PRIMARY KEY (flightID, bookingID, passengerID),
        INTERLEAVE IN PARENT Booking ON DELETE CASCADE`,

  `CREATE TABLE Passenger (
        passengerID    STRING(36) NOT NULL,
        passengerName    STRING(20) NOT NULL,
        passengerEmail    STRING(20) NOT NULL,
        passengerDOB    DATE NOT NULL
        ) PRIMARY KEY (passengerID)`,
];

schema.forEach(async (sql) => {
  try {
    database.tabl;
    await database.updateSchema(sql);
  } catch (err) {
    console.error(err);
  }
});

database.close();
