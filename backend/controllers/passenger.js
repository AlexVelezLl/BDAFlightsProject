const inspector = require('schema-inspector');
const {
  passengerSanitizationSchema,
  passengerValidationSchema,
} = require('../validations/passenger');
const {
  paginationSanitizationSchema,
  paginationValidationSchema,
} = require('../validations/queryPagination');
const Passenger = require('../models/passenger');

module.exports.getAll = async (req, res) => {
  const { query } = req;
  inspector.sanitize(paginationSanitizationSchema, query);
  const result = inspector.validate(paginationValidationSchema, query);
  if (!result.valid) {
    return res.status(400).json({ error: result.format() });
  }
  const { name, page, limit } = query;
  try {
    const passengers = await Passenger.getPassengers({ name, page, limit });
    res.json(passengers);
  } catch (err) {
    console.log('Error getting users', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.getOne = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  try {
    const passenger = await Passenger.getPassengerById(id);
    if (!passenger) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    res.json(passenger);
  } catch (err) {
    console.log('Error getting user', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.create = async (req, res) => {
  const { body } = req;
  inspector.sanitize(passengerSanitizationSchema, body);
  const result = inspector.validate(passengerValidationSchema, body);
  if (!result.valid) {
    return res.status(400).json({ error: result.format() });
  }
  const { passengerName, passengerEmail, passengerDob } = body;
  try {
    const idPassenger = await Passenger.createPassenger({
      name: passengerName,
      email: passengerEmail,
      dob: passengerDob,
    });
    res.status(201).json({ id: idPassenger });
  } catch (err) {
    console.log('Error creating user', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  const { body } = req;
  inspector.sanitize(passengerSanitizationSchema, body);
  const result = inspector.validate(passengerValidationSchema, body);
  if (!result.valid) {
    return res.status(400).json({ error: result.format() });
  }
  const { passengerName, passengerEmail, passengerDob } = body;
  try {
    await Passenger.updatePassenger({
      id,
      name: passengerName,
      email: passengerEmail,
      dob: passengerDob,
    });
    res.status(204).send();
  } catch (err) {
    console.log('Error updating user', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  try {
    await Passenger.deletePassenger(id);
    res.status(204).send();
  } catch (err) {
    console.log('Error deleting user', err);
    res.status(500).json({ error: err.message });
  }
};
