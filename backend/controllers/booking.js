const inspector = require('schema-inspector');
const {
  bookingSanitizationSchema,
  bookingValidationSchema,
} = require('../validations/booking');

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
  inspector.sanitize(bookingSanitizationSchema, body);
  const result = inspector.validate(bookingValidationSchema, body);
  if (!result.valid) {
    res.status(400).json({ error: result.format() });
  }
  const { flightId, bookDate } = body;
  res.status(201).json({});
};

module.exports.update = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing id' });
  }
  const { body } = req;
  inspector.sanitize(bookingSanitizationSchema, body);
  const result = inspector.validate(bookingValidationSchema, body);
  if (!result.valid) {
    res.status(400).json({ error: result.format() });
  }
  const { flightId, bookDate } = body;
  res.json({});
};

module.exports.delete = (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing id' });
  }
  res.status(204).send();
};
