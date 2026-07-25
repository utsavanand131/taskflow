import { gql } from "graphql-tag";

export const teamTypeDefs = gql`
  enum TeamRole {
    OWNER
    ADMIN
    MEMBER
  }

  type Team {
    id: ID!
    name: String!
    description: String
    createdAt: String!
    updatedAt: String!

    members: [TeamMember!]!
  }

  type TeamMember {
    id: ID!

    role: TeamRole!

    user: User!
    team: Team!
  }

  input CreateTeamInput {
    name: String!
    description: String
  }

  input UpdateTeamInput {
    name: String
    description: String
  }

  extend type Query {
    teams: [Team!]!
    team(id: ID!): Team
  }

  extend type Mutation {
    createTeam(input: CreateTeamInput!): Team!
    updateTeam(id: ID!, input: UpdateTeamInput!): Team!
    deleteTeam(id: ID!): Boolean!
  }
`;
