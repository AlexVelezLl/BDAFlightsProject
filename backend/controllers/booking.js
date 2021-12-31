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
    console.log('Error getting bookings: ', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.getOne = async (req, res) => {
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
    console.log('Error getting booking: ', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.create = async (req, res) => {
  const { body } = req;
  inspector.sanitize(bookingSanitizationSchema, body);
  const result = inspector.validate(bookingValidationSchema, body);
  if (!result.valid) {
    return res.status(400).json({ error: result.format() });
  }
  const { flightID, bookingDate, passengerIDs } = body;
  try {
    const idBooking = await Booking.createBooking({
      flightID,
      bookingDate,
      passengerIDs,
    });
    res.status(201).json({ id: idBooking });
  } catch (err) {
    console.log('Error creating booking: ', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.update = async (req, res) => {
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
  const { bookingDate, passengerIDs } = body;
  try {
    await Booking.updateBooking({ id, bookingDate, passengerIDs });
    res.status(204).send();
  } catch (err) {
    console.log('Error updating booking: ', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Missing id' });
  }
  try {
    await Booking.deleteBooking(id);
    res.status(204).send();
  } catch (err) {
    console.log('Error deleting booking: ', err);
    res.status(500).json({ error: err.message });
  }
};
