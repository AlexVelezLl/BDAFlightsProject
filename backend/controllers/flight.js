const inspector = require('schema-inspector');
const {
  flightSanitizationSchema,
  flightValidationSchema,
} = require('../validations/flight');

module.exports.getAll = (req, res) => {
  res.json([{}]);
};

module.exports.getOne = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing id' });
  }
  res.json({});
};

module.exports.create = (req, res) => {
  const { body } = req;
  inspector.sanitize(flightSanitizationSchema, body);
  const result = inspector.validate(flightValidationSchema, body);
  if (!result.valid) {
    res.status(400).json({ error: result.format() });
  }
  const { flightSource, flightDest, flightDate, flightSeat, ticketCost } = body;
  res.status(201).json({});
};

module.exports.update = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing id' });
  }
  const { body } = req;
  inspector.sanitize(flightSanitizationSchema, body);
  const result = inspector.validate(flightValidationSchema, body);
  if (!result.valid) {
    res.status(400).json({ error: result.format() });
  }
  const { flightSource, flightDest, flightDate, flightSeat, ticketCost } = body;
  res.json({});
};

module.exports.delete = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing id' });
  }
  res.status(204).send();
};
