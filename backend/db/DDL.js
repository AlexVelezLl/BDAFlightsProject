require('dotenv').config();

const { Spanner } = require('@google-cloud/spanner');
const { projectId, instanceId, databaseId } = require('./bd.config');

const spanner = new Spanner({ projectId });

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

const schema = [
  `CREATE TABLE Flight (
        flightID    STRING(36)  NOT NULL,
        flightSource   STRING(20)  NOT NULL,
        flightDest    STRING(20)  NOT NULL,
        flightDate    TIMESTAMP  NOT NULL,
        flightSeat  INT64  NOT NULL,
        ticketCost FLOAT64  NOT NULL
      ) PRIMARY KEY (flightID)`,

  `CREATE TABLE Booking (
        flightID    STRING(36) NOT NULL,
        bookingID    STRING(36) NOT NULL,
        bookingDate    TIMESTAMP NOT NULL
      ) PRIMARY KEY (flightID, bookingID),
      INTERLEAVE IN PARENT Flight ON DELETE CASCADE`,

  `CREATE TABLE Passenger (
        passengerID    STRING(36) NOT NULL,
        passengerName    STRING(20) NOT NULL,
        passengerEmail    STRING(20) NOT NULL,
        passengerDOB    TIMESTAMP NOT NULL
      ) PRIMARY KEY (passengerID)`,

  `CREATE TABLE BookingDetails (
        flightID    STRING(36) NOT NULL,
        bookingID    STRING(36)  NOT NULL,
        passengerID    STRING(36) NOT NULL,
        CONSTRAINT FK_passengerID FOREIGN KEY (passengerID) REFERENCES Passenger (passengerID)
        ) PRIMARY KEY (flightID, bookingID, passengerID),
        INTERLEAVE IN PARENT Booking ON DELETE CASCADE`,
];

schema.forEach(async (sql) => {
  try {
    database.tabl;
    const [operation] = await database.updateSchema(sql);
    await operation.promise();
  } catch (err) {
    console.error(err);
  }
});

database.close();
