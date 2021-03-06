const uuid = require("uuid");
const { Spanner } = require("@google-cloud/spanner");
const { projectId, instanceId, databaseId } = require("../db/bd.config");

const spanner = new Spanner({ projectId });

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

module.exports.getBookings = async ({ limit, page }) => {
  const query = {
    sql: `
      SELECT
        b.bookingID,
        b.bookingDate,
        f.flightID,
        f.flightSource,
        f.flightDest,
        f.flightDate,
        bd.nPassengers
      FROM
        Booking b
      INNER JOIN
        Flight f ON b.flightID = f.flightID
      INNER JOIN
        (
          SELECT
            bookingID,
            COUNT(passengerID) AS nPassengers
          FROM
            BookingDetails
          GROUP BY
            bookingID
        ) bd ON b.bookingID = bd.bookingID
      ORDER BY
        b.bookingDate DESC
      LIMIT
        @limit
      OFFSET
        @offset`,
    params: {
      limit,
      offset: page * limit,
    },
  };
  const [rows] = await database.run(query);
  return rows.map((row) => row.toJSON());
};

module.exports.getBookingById = async (id) => {
  const query = {
    sql: `
      SELECT
        b.bookingID,
        b.bookingDate,
        p.passengerID,
        p.passengerName
      FROM
        Booking b
      INNER JOIN
        BookingDetails bd ON b.bookingID = bd.bookingID
      INNER JOIN
        Passenger p ON bd.passengerID = p.passengerID
      WHERE
        b.bookingID = @id`,
    params: {
      id,
    },
  };
 
  const [rows] = await database.run(query);
  
  const result = rows.map((row) => row.toJSON());
  const passengers = result.map((item) => {
    const { passengerID, passengerName } = item;
    return {
      passengerID,
      passengerName,
    };
  });
  

  return {bookingID: result[0].bookingID, bookingDate: result[0].bookingDate, passengers};
};

module.exports.createBooking = ({ flightID, bookingDate, passengerIDs }) => {
  const id = uuid.v4();
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      try {
        await transaction.runUpdate({
          sql: `
            INSERT
              Booking(bookingID, flightID, bookingDate)
            VALUES
              (@id, @flightID, @bookingDate)`,
          params: { id, flightID, bookingDate },
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
              (@flightID, @id, @passengerID${idx})`
              )
              .join(","),
          params: { id, flightID, ...passengerIDsObject },
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

module.exports.updateBooking = ({ id, passengerIDs }) => {
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      try {
        await transaction.runUpdate({
          sql: `
            DELETE FROM
              BookingDetails
            WHERE
              bookingID = @id`,
          params: { id },
        });
        const [rows] = await transaction.run({
          sql: `
            SELECT 
              flightID
            FROM
              Booking
            WHERE
              bookingID = @id`,
          params: { id },
        });
        const { flightID } = rows[0].toJSON();
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
              (@flightID, @id, @passengerID${idx})`
              )
              .join(","),
          params: { flightID, id, ...passengerIDsObject },
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
