import { TeamRole } from "@/app/generated/prisma/client";

export function canManageTeam(role: TeamRole) {
  return role === TeamRole.OWNER || role === TeamRole.ADMIN;
}

export function canDeleteTeam(role: TeamRole) {
  return role === TeamRole.OWNER;
}

export function canManageMembers(role: TeamRole) {
  return role === TeamRole.OWNER || role === TeamRole.ADMIN;
}

export function canManageProject(role: TeamRole) {
  return role === TeamRole.OWNER || role === TeamRole.ADMIN;
}

export function canDeleteProject(role: TeamRole) {
  return role === TeamRole.OWNER;
}
