const uuid = require('uuid');
const { Spanner } = require('@google-cloud/spanner');
const { projectId, instanceId, databaseId } = require('../db/bd.config');

const spanner = new Spanner({ projectId });

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

module.exports.getPassengers = async (name) => {
  const query = {
    sql: `
      SELECT * 
      FROM 
        Passenger
      ${
        name
          ? `
          WHERE
            LOWER(passengerName) LIKE '%' || @name || '%'
          LIMIT 5`
          : ''
      }`,
    params: {
      name: name?.toLowerCase() || '',
    },
  };
  const [rows] = await database.run(query);
  return rows.map((row) => row.toJSON());
};

module.exports.getPassengerById = async (id) => {
  const query = {
    sql: `
      SELECT * 
      FROM 
        Passenger
      WHERE
        passengerID = @id`,
    params: {
      id,
    },
  };
  const [rows] = await database.run(query);
  return rows[0]?.toJSON();
};

module.exports.createPassenger = ({ name, email, dob }) => {
  const id = uuid.v4();
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      const query = {
        sql: `
          INSERT
            Passenger(passengerID, passengerName, passengerEmail, passengerDOB)
          VALUES
            (@id, @name, @email, @dob)`,
        params: { id, name, email, dob },
      };
      try {
        await transaction.runUpdate(query);
        await transaction.commit();
        resolve(id);
      } catch (err) {
        await transaction.rollback();
        reject(err);
      }
    });
  });
};

module.exports.updatePassenger = ({ id, name, email, dob }) => {
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      const query = {
        sql: `
          UPDATE 
            Passenger
          SET
            passengerName = @name,
            passengerEmail = @email,
            passengerDOB = @dob
          WHERE
            passengerID = @id`,
        params: { name, email, dob, id },
      };
      try {
        await transaction.runUpdate(query);
        await transaction.commit();
        resolve(id);
      } catch (err) {
        await transaction.rollback();
        reject(err);
      }
    });
  });
};

module.exports.deletePassenger = (id) => {
  return new Promise((resolve, reject) => {
    database.runTransaction(async (err, transaction) => {
      if (err) reject(err);
      const query = {
        sql: `
          DELETE FROM 
            Passenger
          WHERE
            passengerID = @id`,
        params: { id },
      };
      try {
        await transaction.runUpdate(query);
        await transaction.commit();
        resolve();
      } catch (err) {
        await transaction.rollback();
        reject(err);
      }
    });
  });
};
