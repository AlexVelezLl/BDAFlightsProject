module.exports.passengerSanitizationSchema = {
  type: 'object',
  properties: {
    passengerName: {
      type: 'string',
      rules: ['trim', 'title'],
    },
    passengerEmail: {
      type: 'string',
      rules: ['trim', 'lower'],
    },
    passengerDob: {
      type: 'date',
    },
  },
};

module.exports.passengerValidationSchema = {
  type: 'object',
  properties: {
    passengerName: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    passengerEmail: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
      pattern: 'email',
    },
    passengerDob: {
      type: 'date',
    },
  },
};
