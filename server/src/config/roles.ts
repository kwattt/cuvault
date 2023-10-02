import { Role } from "../services/user.service";

const allRoles = {
  [Role.USER]: [],
  [Role.ADMIN]: ['getUsers', 'manageUsers', 'getTokens', 'manageModel']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));