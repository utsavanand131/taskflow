import { gql } from "graphql-tag";

export const notificationTypeDefs = gql`
  type Notification {
    id: ID!
    message: String!
    read: Boolean!
    createdAt: String!
  }

  extend type Query {
    notifications: [Notification!]!
  }

  extend type Mutation {
    markNotificationRead(id: ID!): Notification!
  }
`;
