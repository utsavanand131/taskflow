import { gql } from "graphql-tag";

import { userTypeDefs } from "./user";
import { projectTypeDefs } from "./project";
import { taskTypeDefs } from "./task";
import { teamTypeDefs } from "./team";
import { commentTypeDefs } from "./comment";
import { invitationTypeDefs } from "./invitation";
import { dashboardTypeDefs } from "./dashboard";
import { activityTypeDefs } from "./activity";
import { notificationTypeDefs } from "./notification";
import { taskReminderTypeDefs } from "./taskReminder";
import { oauthTypeDefs } from "./oauth";

const baseTypeDefs = gql`
  type Query {
    health: String!
  }

  type Mutation {
    _empty: String
  }
`;

export const typeDefs = [
  baseTypeDefs,
  userTypeDefs,
  projectTypeDefs,
  taskTypeDefs,
  teamTypeDefs,
  commentTypeDefs,
  invitationTypeDefs,
  activityTypeDefs,
  dashboardTypeDefs,
  notificationTypeDefs,
  taskReminderTypeDefs,
  oauthTypeDefs,
];
