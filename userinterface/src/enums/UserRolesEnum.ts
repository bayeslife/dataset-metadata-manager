export type RoleType = 0 | 1 | 2 | 4

export const UserRolesEnum: {
  NO_ACCESS: RoleType
  PROJECT_USER: RoleType
  PROJECT_ADMIN: RoleType
  GLOBAL_ADMIN: RoleType
} = {
  NO_ACCESS: 0,
  PROJECT_USER: 1,
  PROJECT_ADMIN: 2,
  GLOBAL_ADMIN: 4,
}
