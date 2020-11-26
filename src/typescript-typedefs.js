const { printSchema } = require('graphql');

module.exports = {
  plugin: (schema, _, __) => {
    return [
      'const typeDefs = `',
      printSchema(schema),
      '`;',
      '',
      'export default typeDefs',
    ].join('\n');
  },
};
