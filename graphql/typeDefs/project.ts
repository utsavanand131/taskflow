import { gql } from "graphql-tag";

export const projectTypeDefs = gql`
  type Project {
    id: ID!
    name: String!
    description: String
    color: String
    owner: User!
    team: Team
    createdAt: String!
    updatedAt: String!
  }

  input CreateProjectInput {
    name: String!
    description: String
    color: String
    teamId: ID
  }

  input UpdateProjectInput {
    name: String
    description: String
    color: String
  }

  extend type Query {
    projects: [Project!]!
    project(id: ID!): Project
  }

  extend type Mutation {
    createProject(input: CreateProjectInput!): Project!

    updateProject(id: ID!, input: UpdateProjectInput!): Project!

    deleteProject(id: ID!): Boolean!
  }
`;
