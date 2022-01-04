module.exports.paginationSanitizationSchema = {
  type: 'object',
  properties: {
    page: {
      type: 'number',
      optional: false,
      def: 0,
    },
    limit: {
      type: 'number',
      optional: false,
      def: 10,
    },
  },
};

module.exports.paginationValidationSchema = {
  type: 'object',
  properties: {
    page: {
      type: 'number',
      gte: 0,
    },
    limit: {
      type: 'number',
      gt: 0,
    },
  },
};
