module.exports.bookingSanitizationSchema = {
  type: 'object',
  properties: {
    flightID: {
      type: 'string',
    },
    bookingDate: {
      type: 'date',
    },
    passengerIDs: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};

module.exports.bookingValidationSchema = {
  type: 'object',
  properties: {
    flightID: {
      type: 'string',
      minLength: 36,
      maxLength: 36,
      optional: true,
    },
    bookingDate: {
      type: 'date',
      optional: true,
    },
    passengerIDs: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 36,
        maxLength: 36,
      },
      minLength: 1,
    },
  },
};
