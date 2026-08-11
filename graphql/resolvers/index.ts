import { userResolvers } from "./user";
import { projectResolvers } from "./project";
import { taskResolvers } from "./task";
import { teamResolvers } from "./team";
import { invitationResolvers } from "./invitation";
import { teamMemberResolvers } from "./team-member";
import { dashboardResolvers } from "./dashboard";
import { notificationResolvers } from "./notification";
import { taskReminderResolvers } from "./taskReminder";
import { oauthResolvers } from "./oauth";
import { activityResolvers } from "./activity";
import { labelResolvers } from "./label";

export const resolvers = {
  User: {
    ...userResolvers.User,
  },

  Query: {
    health: () => "TaskFlow GraphQL API is running ",

    ...userResolvers.Query,
    ...projectResolvers.Query,
    ...taskResolvers.Query,
    ...teamResolvers.Query,
    ...invitationResolvers.Query,
    ...teamMemberResolvers.Query,
    ...dashboardResolvers.Query,
    ...notificationResolvers.Query,
    ...taskReminderResolvers.Query,
    ...activityResolvers.Query,
    ...labelResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...projectResolvers.Mutation,
    ...taskResolvers.Mutation,
    ...teamResolvers.Mutation,
    ...invitationResolvers.Mutation,
    ...teamMemberResolvers.Mutation,
    ...notificationResolvers.Mutation,
    ...oauthResolvers.Mutation,
  },
};
