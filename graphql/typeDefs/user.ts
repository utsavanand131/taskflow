import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    image: String
    emailVerified: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!

    login(email: String!, password: String!): AuthPayload!
  }
`;
