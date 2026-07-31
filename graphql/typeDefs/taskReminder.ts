import { gql } from "graphql-tag";

export const taskReminderTypeDefs = gql`
  extend type Query {
    upcomingTasks: [Task!]!
    overdueTasks: [Task!]!
  }
`;
