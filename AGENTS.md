# Project rules

- Use protected user_roles and get_user_role for permissions; profiles.role remains a guarded compatibility field for existing screens.
- Require active, approved profiles in route guards, restrictive learning-data policies, and AI handlers so direct requests cannot bypass approval.
- Create registration notifications atomically at signup and approval; never accept arbitrary student details from public callers.
- Reuse the shared Button for new controls and preserve React deduplication in Vite.