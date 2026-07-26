import { gql } from "graphql-tag";

export const activityTypeDefs = gql`
  enum ActivityType {
    PROJECT_CREATED
    PROJECT_UPDATED
    PROJECT_DELETED

    TASK_CREATED
    TASK_UPDATED
    TASK_DELETED

    TEAM_CREATED
    MEMBER_INVITED
    MEMBER_JOINED
    MEMBER_REMOVED
  }

  type Activity {
    id: ID!
    type: ActivityType!
    message: String!
    createdAt: String!
  }
`;
