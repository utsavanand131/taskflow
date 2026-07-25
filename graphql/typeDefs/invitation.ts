import { gql } from "graphql-tag";

export const invitationTypeDefs = gql`
  enum InvitationStatus {
    PENDING
    ACCEPTED
    REJECTED
  }

  type TeamInvitation {
    id: ID!
    email: String!
    status: InvitationStatus!

    createdAt: String!
    updatedAt: String!

    invitedBy: User!
    team: Team!
  }

  input InviteMemberInput {
    teamId: ID!
    email: String!
  }

  extend type Query {
    myInvitations: [TeamInvitation!]!
  }

  extend type Mutation {
    inviteMember(input: InviteMemberInput!): TeamInvitation!

    acceptInvitation(id: ID!): Boolean!

    rejectInvitation(id: ID!): Boolean!
  }
`;
