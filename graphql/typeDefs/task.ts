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
    createdAt: String!
    updatedAt: String!
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
  }

  extend type Mutation {
    createTask(input: CreateTaskInput!): Task!

    updateTask(id: ID!, input: UpdateTaskInput!): Task!

    deleteTask(id: ID!): Boolean!
  }
`;
