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

  enum TaskSortField {
    CREATED_AT
    UPDATED_AT
    DUE_DATE
    PRIORITY
    TITLE
  }

  enum SortOrder {
    ASC
    DESC
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

  type ChecklistItem {
    id: ID!
    content: String!
    completed: Boolean!
    createdBy: User!
    createdAt: String!
    updatedAt: String!
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
    checklist: [ChecklistItem!]!
    createdAt: String!
    updatedAt: String!
  }

  type TaskPage {
    items: [Task!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  input TaskFilterInput {
    status: TaskStatus
    priority: TaskPriority
    assigneeId: ID
    dueBefore: String
    dueAfter: String
  }

  input TaskSortInput {
    field: TaskSortField!
    order: SortOrder = DESC
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
    tasks(
      projectId: ID!
      filter: TaskFilterInput
      sort: TaskSortInput
    ): [Task!]!

    task(id: ID!): Task

    searchTasks(
      projectId: ID!
      search: String
      filter: TaskFilterInput
      sort: TaskSortInput
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

    addChecklistItem(taskId: ID!, content: String!): ChecklistItem!

    updateChecklistItem(checklistItemId: ID!, content: String!): ChecklistItem!

    toggleChecklistItem(checklistItemId: ID!): ChecklistItem!

    deleteChecklistItem(checklistItemId: ID!): Boolean!

    deleteTask(id: ID!): Boolean!
  }
`;
