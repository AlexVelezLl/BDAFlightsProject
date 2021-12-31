const uuid = require('uuid');
const { Spanner } = require('@google-cloud/spanner');
const { projectId, instanceId, databaseId } = require('../db/bd.config');

const spanner = new Spanner({ projectId });

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

module.exports.getFlights = async () => {
  const query = {
    sql: `
      SELECT * 
      FROM 
        Flight
      `,
  };
  const [rows] = await database.run(query);
  return rows.map((row) => row.toJSON());
};

module.exports.getFlightById = async (id) => {
  const query = {
    sql: `
      SELECT * 
      FROM 
        Flight
      WHERE
        flightID = @id`,
    params: {
      id,
    },
  };
  const [rows] = await database.run(query);
  return rows[0]?.toJSON();
};

module.exports.createFlight = ({
  flightSource,
  flightDest,
  flightDate,
  flightSeat,
  ticketCost,
}) => {
  const id = uuid.v4();
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      try {
        await transaction.runUpdate({
          sql: `
            INSERT
              Flight(flightID, flightSource, flightDest, flightDate, flightSeat, ticketCost)
            VALUES
              (@id, @flightSource, @flightDest, @flightDate, @flightSeat, @ticketCost)`,
          params: {
            id,
            flightSource,
            flightDest,
            flightDate,
            flightSeat,
            ticketCost,
          },
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

module.exports.updateFlight = ({
  flightID,
  flightSource,
  flightDest,
  flightDate,
  flightSeat,
  ticketCost,
}) => {
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      try {
        await transaction.runUpdate({
          sql: `
            UPDATE 
              Flight
            SET
              flightSource = @flightSource,
              flightDest = @flightDest,
              flightDate = @flightDate,
              flightSeat = @flightSeat,
              ticketCost = @ticketCost
            WHERE
              flightID = @flightID`,
          params: {
            flightSource,
            flightDest,
            flightDate,
            flightSeat,
            ticketCost,
            flightID,
          },
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

module.exports.deleteFlight = (id) => {
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      try {
        await transaction.runUpdate({
          sql: `
            DELETE
              Flight
            WHERE
              flightID = @id`,
          params: {
            id,
          },
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
