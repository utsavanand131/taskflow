import { gql } from "graphql-tag";

export const dashboardTypeDefs = gql`
  type ProjectStats {
    total: Int!
    active: Int!
    completed: Int!
    archived: Int!
  }

  type TaskStats {
    total: Int!
    todo: Int!
    inProgress: Int!
    completed: Int!
    overdue: Int!
    dueToday: Int!
    completionRate: Float!
  }

  type DashboardStats {
    projects: ProjectStats!
    tasks: TaskStats!
    recentActivity: [Activity!]!
  }

  extend type Query {
    dashboardStats: DashboardStats!
  }
`;
