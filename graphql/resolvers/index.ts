import { userResolvers } from "./user";

export const resolvers = {
  Query: {
    health: () => "TaskFlow GraphQL API is running 🚀",
  },

  Mutation: {
    ...userResolvers.Mutation,
  },
};
