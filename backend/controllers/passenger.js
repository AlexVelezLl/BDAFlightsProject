const inspector = require('schema-inspector');
const {
  passengerSanitizationSchema,
  passengerValidationSchema,
} = require('../validations/passenger');
const Passenger = require('../models/passenger');

module.exports.getAll = (req, res) => {
  const { name } = req.query;
  try {
    const passengers = await Passenger.getPassengers(name);
    res.json(passengers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.getOne = (req, res) => {
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
    res.status(500).json({ error: err.message });
  }
};

module.exports.create = (req, res) => {
  const { body } = req;
  inspector.sanitize(passengerSanitizationSchema, body);
  const result = inspector.validate(passengerValidationSchema, body);
  if (!result.valid) {
    return res.status(400).json({ error: result.format() });
  }
  const { passName, passEmail, passDob } = body;
  try {
    const idPassenger = await Passenger.createPassenger({
      passName,
      passEmail,
      passDob,
    });
    res.status(201).json({ id: idPassenger });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.update = (req, res) => {
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
  const { passName, passEmail, passDob } = body;
  try {
    await Passenger.updatePassenger({ id, passName, passEmail, passDob });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.delete = (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  try {
    await Passenger.deletePassenger(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
