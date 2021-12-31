const inspector = require('schema-inspector');
const {
  bookingSanitizationSchema,
  bookingValidationSchema,
} = require('../validations/booking');
const Booking = require('../models/booking');

module.exports.getAll = async (req, res) => {
  try {
    const bookings = await Booking.getBookings();
    res.json(bookings);
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
    const booking = await Booking.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.create = (req, res) => {
  const { body } = req;
  inspector.sanitize(bookingSanitizationSchema, body);
  const result = inspector.validate(bookingValidationSchema, body);
  if (!result.valid) {
    return res.status(400).json({ error: result.format() });
  }
  const { flightID, bookDate, passengerIDs } = body;
  try {
    const idBooking = await Booking.createBooking({
      flightID,
      bookDate,
      passengerIDs,
    });
    res.status(201).json({ id: idBooking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
    return res.status(400).json({ error: result.format() });
  }
  const { flightID, bookDate, passengerIDs } = body;
  try {
    await Booking.updateBooking({ id, flightID, bookDate, passengerIDs });
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
    await Booking.deleteBooking(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
