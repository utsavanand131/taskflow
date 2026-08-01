import { gql } from "graphql-tag";

export const oauthTypeDefs = gql`
  extend type Mutation {
    googleLogin(credential: String!): AuthPayload!
  }
`;
