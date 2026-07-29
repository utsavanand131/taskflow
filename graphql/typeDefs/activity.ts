import { gql } from "graphql-tag";

export const activityTypeDefs = gql`
  enum ActivityType {
    PROJECT_CREATED
    PROJECT_UPDATED
    PROJECT_DELETED

    TASK_CREATED
    TASK_UPDATED
    TASK_DELETED
    TASK_ASSIGNED

    COMMENT_ADDED

    LABEL_ASSIGNED
    LABEL_REMOVED

    CHECKLIST_ITEM_ADDED
    CHECKLIST_ITEM_UPDATED
    CHECKLIST_ITEM_COMPLETED
    CHECKLIST_ITEM_DELETED

    ATTACHMENT_UPLOADED
    ATTACHMENT_DELETED

    TEAM_CREATED
    MEMBER_INVITED
    MEMBER_JOINED
    MEMBER_REMOVED
  }

  type Activity {
    id: ID!
    type: ActivityType!
    message: String!

    user: User
    project: Project
    task: Task
    team: Team

    createdAt: String!
  }
`;
