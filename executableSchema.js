import { makeExecutableSchema } from '@graphql-tools/schema';

import typeDefs from './schema/pollsSchema.js';
import resolvers from './resolvers/pollsResolver.js';

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});