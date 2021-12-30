module.exports.flightSanitizationSchema = {
  type: 'object',
  properties: {
    flightSource: {
      type: 'string',
      rules: ['trim', 'title'],
    },
    flightDest: {
      type: 'string',
      rules: ['trim', 'title'],
    },
    flightDate: {
      type: 'date',
    },
    flightSeat: {
      type: 'integer',
    },
    ticketCost: {
      type: 'number',
    },
  },
};

module.exports.flightValidationSchema = {
  type: 'object',
  properties: {
    flightSource: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    flightDest: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    flightDate: {
      type: 'date',
    },
    flightSeat: {
      type: 'integer',
      gt: 0,
      lte: 9999,
    },
    ticketCost: {
      type: 'number',
      gt: 0,
    },
  },
};
