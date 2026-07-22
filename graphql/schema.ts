import { createSchema } from "graphql-yoga";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import type { GraphQLContext } from "./context";

export const schema = createSchema<GraphQLContext>({
  typeDefs,
  resolvers,
});
