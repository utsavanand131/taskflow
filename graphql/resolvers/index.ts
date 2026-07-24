import { userResolvers } from "./user";
import { projectResolvers } from "./project";

export const resolvers = {
  Query: {
    health: () => "TaskFlow GraphQL API is running ",
    ...userResolvers.Query,
    ...projectResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
  },
};
