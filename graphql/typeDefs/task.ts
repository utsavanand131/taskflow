import { gql } from "graphql-tag";

export const taskTypeDefs = gql`
  type Task {
    id: ID!
  }
`;
