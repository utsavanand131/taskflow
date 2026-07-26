import { gql } from "graphql-tag";

export const dashboardTypeDefs = gql`
  type DashboardStats {
    totalProjects: Int!
    totalTasks: Int!
    totalTeams: Int!

    todoTasks: Int!
    inProgressTasks: Int!
    doneTasks: Int!

    recentActivities: [Activity!]!
  }

  extend type Query {
    dashboardStats: DashboardStats!
  }
`;
