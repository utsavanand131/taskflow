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

  type Comment {
    id: ID!
    content: String!
    author: User!
    task: Task!
    createdAt: String!
    updatedAt: String!
  }

  type Label {
    id: ID!
    name: String!
    color: String
  }

  type Attachment {
    id: ID!
    fileName: String!
    fileUrl: String!
    fileSize: Int
    mimeType: String
    uploadedBy: User!
    createdAt: String!
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
    comments: [Comment!]!
    labels: [Label!]!
    attachments: [Attachment!]!
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

    addComment(taskId: ID!, content: String!): Comment!

    updateComment(commentId: ID!, content: String!): Comment!

    deleteComment(commentId: ID!): Boolean!

    createLabel(name: String!, color: String): Label!

    assignLabel(taskId: ID!, labelId: ID!): Task!

    removeLabel(taskId: ID!, labelId: ID!): Task!

    uploadAttachment(
      taskId: ID!
      fileName: String!
      fileUrl: String!
      fileSize: Int
      mimeType: String
    ): Attachment!

    deleteAttachment(attachmentId: ID!): Boolean!

    deleteTask(id: ID!): Boolean!
  }
`;
