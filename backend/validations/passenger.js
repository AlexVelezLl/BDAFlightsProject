module.exports.passengerSanitizationSchema = {
  type: 'object',
  properties: {
    passName: {
      type: 'string',
      rules: ['trim', 'title'],
    },
    passEmail: {
      type: 'string',
      rules: ['trim', 'lower'],
    },
    passDob: {
      type: 'date',
    },
  },
};

module.exports.passengerValidationSchema = {
  type: 'object',
  properties: {
    passName: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
    },
    passEmail: {
      type: 'string',
      minLength: 3,
      maxLength: 20,
      pattern: 'email',
    },
    passDob: {
      type: 'date',
    },
  },
};
