module.exports.bookingSanitizationSchema = {
  type: 'object',
  properties: {
    flightId: {
      type: 'integer',
    },
    bookDate: {
      type: 'date',
    },
    passengers: {
      type: 'array',
      items: {
        type: 'integer',
      },
    }
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
    passengers: {
      type: 'array',
      items: {
        type: 'integer',
        gt: 0,
      },
    },
  },
};
