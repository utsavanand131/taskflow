import { userResolvers } from "./user";
import { projectResolvers } from "./project";
import { taskResolvers } from "./task";
import { teamResolvers } from "./team";
import { invitationResolvers } from "./invitation";
import { teamMemberResolvers } from "./team-member";
import { dashboardResolvers } from "./dashboard";

export const resolvers = {
  Query: {
    health: () => "TaskFlow GraphQL API is running ",
    ...userResolvers.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query,
    ...teamResolvers.Query,
    ...invitationResolvers.Query,
    ...teamMemberResolvers.Query,
    ...dashboardResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...invitationResolvers.Mutation,
    ...teamMemberResolvers.Mutation,
  },
};
