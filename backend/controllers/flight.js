const inspector = require('schema-inspector');
const {
  flightSanitizationSchema,
  flightValidationSchema,
} = require('../validations/flight');

const Flight = require('../models/flight');

module.exports.getAll = async (req, res) => {
  try {
    const flights = await Flight.getFlights();
    res.json(flights);
  } catch (err) {
    console.log('Error getting flights: ', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.getOne = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  try {
    const flight = await Flight.getFlightById(id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }
    res.json(flight);
  } catch (err) {
    console.log('Error getting flight: ', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.create = async (req, res) => {
  const { body } = req;
  inspector.sanitize(flightSanitizationSchema, body);
  const result = inspector.validate(flightValidationSchema, body);
  if (!result.valid) {
    return res.status(400).json({ error: result.format() });
  }
  const { flightSource, flightDest, flightDate, flightSeat, ticketCost } = body;
  try {
    const idFlight = await Flight.createFlight({
      flightSource,
      flightDest,
      flightDate,
      flightSeat,
      ticketCost,
    });
    res.status(201).json({ id: idFlight });
  } catch (err) {
    console.log('Error creating flight: ', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.update = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  const { body } = req;
  inspector.sanitize(flightSanitizationSchema, body);
  const result = inspector.validate(flightValidationSchema, body);
  if (!result.valid) {
    return res.status(400).json({ error: result.format() });
  }
  const { flightSource, flightDest, flightDate, flightSeat, ticketCost } = body;
  try {
    await Flight.updateFlight({
      flightID: id,
      flightSource,
      flightDest,
      flightDate,
      flightSeat,
      ticketCost,
    });
    res.status(204).send();
  } catch (err) {
    console.log('Error updating flight: ', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  try {
    await Flight.deleteFlight(id);
    res.status(204).send();
  } catch (err) {
    console.log('Error deleting flight: ', err);
    res.status(500).json({ error: err.message });
  }
};
