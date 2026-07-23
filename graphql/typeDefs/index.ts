import { gql } from "graphql-tag";

import { userTypeDefs } from "./user";
import { projectTypeDefs } from "./project";
import { taskTypeDefs } from "./task";
import { teamTypeDefs } from "./team";
import { commentTypeDefs } from "./comment";

const baseTypeDefs = gql`
  type Query {
    health: String!
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  projectTypeDefs,
  taskTypeDefs,
  teamTypeDefs,
  commentTypeDefs,
];
