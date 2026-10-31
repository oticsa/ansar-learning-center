export type AccountAccess = { is_active: boolean; approval_status: string };
export function canEnterLessons(profile: AccountAccess | null): boolean {
  return profile?.is_active === true && profile.approval_status === "approved";
}