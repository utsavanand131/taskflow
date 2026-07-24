import { userResolvers } from "./user";
import { projectResolvers } from "./project";
import { taskResolvers } from "./task";

export const resolvers = {
  Query: {
    health: () => "TaskFlow GraphQL API is running ",
    ...userResolvers.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
  },
};
