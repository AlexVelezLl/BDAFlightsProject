require('dotenv').config();
const fs = require('fs');
const { Spanner } = require('@google-cloud/spanner');

const { databaseId, instanceId, projectId } = require('./bd.config');

const spanner = new Spanner({ projectId });

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

async function insertPassegners() {
  const passengers = JSON.parse(fs.readFileSync('db/data/passengers.json'));

  for (let passenger of passengers) {
    const { id, name, email, dob } = passenger;
    await new Promise((resolve, reject) => {
      database.runTransaction(async (err, transaction) => {
        if (err) reject(err);
        try {
          await transaction.runUpdate({
            sql: `
              INSERT
                Passenger(passengerID, passengerName, passengerEmail, passengerDOB)
              VALUES
                (@id, @name, @email, @dob)`,
            params: { id, name, email, dob },
          });
          await transaction.commit();
          console.log('Inserted passenger: ', id);
          resolve();
        } catch (err) {
          console.log('Error inserting passenger: ', id, '. Error: ', err);
          transaction.rollback();
          resolve();
        }
      });
    });
  }
}

async function insertFlights() {
  const flights = JSON.parse(fs.readFileSync('db/data/flights.json'));
  for (let flight of flights) {
    const { id, source, dest, date, seat, cost } = flight;
    await new Promise((resolve, reject) => {
      database.runTransaction(async (err, transaction) => {
        if (err) reject(err);
        try {
          await transaction.runUpdate({
            sql: `
              INSERT
                Flight(flightID, flightSource, flightDest, flightDate, flightSeat, ticketCost)
              VALUES
                (@id, @source, @dest, @date, @seat, @cost)`,
            params: { id, source, dest, date, seat, cost },
          });
          await transaction.commit();
          console.log('Inserted flight: ', id);
          resolve();
        } catch (err) {
          transaction.rollback();
          console.log('Error inserting flight: ', id, '. Error: ', err);
          resolve();
        }
      });
    });
  }
}

async function insertBookings() {
  const bookings = JSON.parse(fs.readFileSync('db/data/bookings.json'));

  for (let booking of bookings) {
    const { id, date, flight, passengerIDs } = booking;
    await new Promise((resolve, reject) => {
      database.runTransaction(async (err, transaction) => {
        if (err) reject(err);
        try {
          await transaction.runUpdate({
            sql: `
              INSERT
                Booking(bookingID, flightID, bookingDate)
              VALUES
                (@id, @flight, @date)`,
            params: { id, flight, date },
          });
          const passengerIDsObject = getPassengerIDsObject(passengerIDs);
          await transaction.runUpdate({
            sql:
              `
              INSERT
                BookingDetails(flightID, bookingID, passengerID)
              VALUES` +
              passengerIDs
                .map(
                  (_, idx) => `
                (@flight, @id, @passengerID${idx})`
                )
                .join(','),
            params: { id, flight, ...passengerIDsObject },
          });
          await transaction.commit();
          console.log('Inserted booking: ', id);
          resolve();
        } catch (err) {
          console.log('Error inserting booking: ', id, '. Error: ', err);
          transaction.rollback();
          resolve();
        }
      });
    });
  }
}

const getPassengerIDsObject = (passengerIDs) => {
  return passengerIDs.reduce((acc, passengerID, idx) => {
    acc[`passengerID${idx}`] = passengerID;
    return acc;
  }, {});
};

insertBookings().then(() => {
  database.close()
});
