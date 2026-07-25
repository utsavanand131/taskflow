import { userResolvers } from "./user";
import { projectResolvers } from "./project";
import { taskResolvers } from "./task";
import { teamResolvers } from "./team";

export const resolvers = {
  Query: {
    health: () => "TaskFlow GraphQL API is running ",
    ...userResolvers.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query,
    ...teamResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...teamResolvers.Mutation,
  },
};
