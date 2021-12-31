const uuid = require('uuid');
const { Spanner } = require('@google-cloud/spanner');
const { instanceId, databaseId } = require('../db/bd.config');

const spanner = new Spanner({ projectId });

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

module.exports.getBookings = async () => {
  const query = {
    sql: `
      SELECT * 
      FROM 
        Booking
      `,
  };
  const [rows] = await database.run(query);
  return rows.map((row) => row.toJSON());
};

module.exports.getBookingById = async (id) => {
  const query = {
    sql: `
      SELECT * 
      FROM 
        Booking
      WHERE
        bookingID = @id`,
    params: {
      id,
    },
  };
  const [rows] = await database.run(query);
  return rows[0]?.toJSON();
};

module.exports.createBooking = ({ flightID, bookDate, passengerIDs }) => {
  const id = uuid.v4();
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      try {
        await transaction.runUpdate({
          sql: `
            INSERT
              Booking(bookingID, flightID, bookDate)
            VALUES
              (@id, @flightID, @passengerID, @seatNumber)`,
          params: { id, flightID, bookDate },
        });
        const passengerIDsObject = getPassengerIDsObject(passengerIDs);
        await transaction.runUpdate({
          sql:
            `
            INSERT
              BookingPassenger(bookingID, passengerID)
            VALUES` +
            passengerIDs
              .map(
                (_, idx) => `
              (@id, @passengerID${idx})`
              )
              .join(','),
          params: { id, ...passengerIDsObject },
        });
        await transaction.commit();
        resolve(id);
      } catch (err) {
        await transaction.rollback();
        reject(err);
      }
    });
  });
};

module.exports.updateBooking = ({ id, flightID, bookDate, passengerIDs }) => {
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      try {
        await transaction.runUpdate({
          sql: `
            UPDATE 
              Booking
            SET
              flightID = @flightID,
              bookDate = @bookDate
            WHERE
              bookingID = @id`,
          params: { flightID, bookDate, id },
        });
        const passengerIDsObject = getPassengerIDsObject(passengerIDs);
        await transaction.runUpdate({
          sql:
            `
            INSERT
              BookingPassenger(bookingID, passengerID)
            VALUES` +
            passengerIDs
              .map(
                (_, idx) => `
              (@id, @passengerID${idx})`
              )
              .join(','),
          params: { id, ...passengerIDsObject },
        });
        await transaction.commit();
        resolve();
      } catch (err) {
        await transaction.rollback();
        reject(err);
      }
    });
  });
};

module.exports.deleteBooking = (id) => {
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      try {
        await transaction.runUpdate({
          sql: `
            DELETE FROM
              Booking
            WHERE
              bookingID = @id`,
          params: { id },
        });
        await transaction.commit();
        resolve();
      } catch (err) {
        await transaction.rollback();
        reject(err);
      }
    });
  });
};

const getPassengerIDsObject = (passengerIDs) => {
  return passengerIDs.reduce((acc, passengerID, idx) => {
    acc[`passengerID${idx}`] = passengerID;
    return acc;
  }, {});
};
