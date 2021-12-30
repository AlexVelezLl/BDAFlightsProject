module.exports.bookingSanitizationSchema = {
  type: 'object',
  properties: {
    flightId: {
      type: 'integer',
    },
    bookDate: {
      type: 'date',
    },
  },
};

module.exports.bookingValidationSchema = {
  type: 'object',
  properties: {
    flightId: {
      type: 'integer',
      gt: 0,
    },
    bookDate: {
      type: 'date',
    },
  },
};
