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

  type PriorityDistribution {
    LOW: Int!
    MEDIUM: Int!
    HIGH: Int!
    URGENT: Int!
  }

  type ProjectProgress {
    id: ID!
    name: String!
    completionRate: Float!
  }

  type DashboardAnalytics {
    priorityDistribution: PriorityDistribution!
    projectProgress: [ProjectProgress!]!
  }

  type DashboardStats {
    projects: ProjectStats!
    tasks: TaskStats!
    analytics: DashboardAnalytics!
    recentActivity: [Activity!]!
  }

  extend type Query {
    dashboardStats: DashboardStats!
  }
`;
