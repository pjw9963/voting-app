import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './executableSchema.js';

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  }),
);


app.listen(4000);
console.log('we are running baby')