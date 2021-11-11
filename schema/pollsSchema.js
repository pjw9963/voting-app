const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    firstName: String
    lastName: String    
  }

  type Poll {
    id: Int!
    author: User
    title: String
    description: String
    options: [Option]
  }

  type Option {
    id: Int!
    text: String
    voters: [User]
  }

  # the schema allows the following query:
  type Query {
    polls: [Poll]
    currentUser: User
  }

  # this schema allows the following mutation:
  type Mutation {
    vote(pollId: Int!, optionId: Int!, userId: Int!): Poll
    logout: Boolean
  }
`;

export default typeDefs