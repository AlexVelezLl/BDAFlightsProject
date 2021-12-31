const {Spanner} = require('@google-cloud/spanner');
const { projectId, instanceId, databaseId } = require('./bd.config');

const spanner = new Spanner({projectId});

const instance = spanner.instance(instanceId);
const database = instance.database(databaseId);

const query = {
  sql: 'SELECT 1',
};

database.run(query).then(rows=>{
  console.log(`Query: ${rows.length} found.`);
  rows.forEach(row => console.log(row));
})
