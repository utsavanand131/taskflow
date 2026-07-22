import { gql } from "graphql-tag";

export const commentTypeDefs = gql`
  type Comment {
    id: ID!
  }
`;
