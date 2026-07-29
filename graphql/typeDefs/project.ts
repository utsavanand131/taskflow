import { gql } from "graphql-tag";

export const projectTypeDefs = gql`
  enum ProjectStatus {
    ACTIVE
    COMPLETED
    ARCHIVED
  }

  type Project {
    id: ID!
    name: String!
    description: String
    color: String
    status: ProjectStatus!
    owner: User!
    team: Team
    createdAt: String!
    updatedAt: String!
  }

  type ProjectPage {
    items: [Project!]!
    total: Int!
    page: Int!
    totalPages: Int!
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
    status: ProjectStatus
  }

  extend type Query {
    projects: [Project!]!

    project(id: ID!): Project

    searchProjects(search: String, page: Int = 1, limit: Int = 10): ProjectPage!
  }

  extend type Mutation {
    createProject(input: CreateProjectInput!): Project!

    updateProject(id: ID!, input: UpdateProjectInput!): Project!

    deleteProject(id: ID!): Boolean!
  }
`;
