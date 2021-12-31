module.exports.bookingSanitizationSchema = {
  type: 'object',
  properties: {
    flightId: {
      type: 'string',
    },
    bookDate: {
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
    flightId: {
      type: 'string',
      minLength: 36,
      maxLength: 36,
    },
    bookDate: {
      type: 'date',
    },
    passengerIDs: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 36,
        maxLength: 36,
      },
    },
  },
};
