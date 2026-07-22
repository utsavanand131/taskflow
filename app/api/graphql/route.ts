import { createYoga } from "graphql-yoga";
import { schema } from "@/graphql/schema";
import { createContext } from "@/graphql/context";

const { handleRequest } = createYoga({
  schema,
  context: createContext,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export const GET = (request: Request) => handleRequest(request, {});
export const POST = (request: Request) => handleRequest(request, {});
export const OPTIONS = (request: Request) => handleRequest(request, {});
