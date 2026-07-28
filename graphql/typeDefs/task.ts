import { gql } from "graphql-tag";

export const taskTypeDefs = gql`
  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  enum TaskPriority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: TaskStatus!
    priority: TaskPriority!
    dueDate: String
    project: Project!
    assignee: User
    createdAt: String!
    updatedAt: String!
  }

  type TaskPage {
    items: [Task!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  input CreateTaskInput {
    projectId: ID!
    title: String!
    description: String
    status: TaskStatus
    priority: TaskPriority
    dueDate: String
  }

  input UpdateTaskInput {
    title: String
    description: String
    status: TaskStatus
    priority: TaskPriority
    dueDate: String
  }

  extend type Query {
    tasks(projectId: ID!): [Task!]!

    task(id: ID!): Task

    searchTasks(
      projectId: ID!
      search: String
      page: Int = 1
      limit: Int = 10
    ): TaskPage!
  }

  extend type Mutation {
    createTask(input: CreateTaskInput!): Task!

    updateTask(id: ID!, input: UpdateTaskInput!): Task!

    assignTask(taskId: ID!, assigneeId: ID): Task!

    deleteTask(id: ID!): Boolean!
  }
`;
