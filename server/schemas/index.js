// Export typeDefs and resolvers.
const typeDefs = require('./typeDefs');
const r = require('./resolvers');
console.log(Object.keys(r));
module.exports = { typeDefs, r }