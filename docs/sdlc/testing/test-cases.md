# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
201 tests · Passed 167 · Failed 0 · Skipped 21 · Not run 13

Acceptance criteria covered: 27/51 · passing: 14/51
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Sign in with email and password

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-001 | test_ac001_login_returns_token_not_cookie | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| AC-002 | test_ac002_all_failures_identical | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| AC-002 | test_ac002_login_validation_422_and_csrf_403 | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| AC-003 | test_ac003_logout_revokes_session | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_logout_without_csrf_header_is_403 | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_me_returns_user_and_401_without_session | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_nfr001_expired_or_deactivated_session_is_401 | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_nfr003_require_role_403_without_data | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_seed_creates_admin_only_when_no_user_exists | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| AC-001 | test_ac001_login_body_cookie_and_no_hash_leak | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-002 | test_ac002_failures_byte_identical | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-002 | test_ac002_login_malformed_email_422 | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-003 | test_ac003_logout_old_cookie_401_on_me_and_protected_route | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-003 | test_ac003_post_without_csrf_header_403 | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-007 | test_ac007_one_email_hash_only_and_expiry | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-008 | test_ac008_confirm_flow_and_session_revocation | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-008 | test_ac008_expired_unknown_and_short_password | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-009 | test_ac009_malformed_email_422 | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-009 | test_ac009_unknown_email_same_body_no_email | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| — | test_nfr001_password_hash_is_argon2_no_plaintext | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| — | test_nfr004_second_request_invalidates_first_token | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
| AC-001 | [AC-001] sign-in lands on the role's home page | E2E | Skipped | `frontend/e2e/auth.spec.ts` |
| AC-002 | [AC-002] a wrong password shows the generic error | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| AC-002 | [AC-002] an unknown email shows the same generic error | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| AC-003 | [AC-003] a protected URL without a session redirects to /sign-in | E2E | Passed | `frontend/e2e/auth.spec.ts` |
| AC-003 | [AC-003] sign-out returns to /sign-in and protected URLs redirect back | E2E | Skipped | `frontend/e2e/auth.spec.ts` |
| AC-009 | [AC-009] reset request shows the same confirmation for known and unknown emails | E2E | Passed | `frontend/e2e/auth.spec.ts` |

### US-004: Create a user account

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-010 | test_ac010_email_is_stored_lowercase_and_sign_in_ignores_case | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-010 | test_ac010_full_flow_create_set_password_sign_in | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-010 | test_ac010_invite_link_is_single_use | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-010 | test_ac010_too_short_password_is_refused_and_link_stays_usable | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-010 | test_ac010_unknown_token_cannot_set_a_password | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-011 | test_ac011_duplicate_creates_no_account_no_invite_and_keeps_original | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-011 | test_ac011_duplicate_of_deactivated_account_is_still_rejected | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-012 | test_ac012_all_fields_missing_reports_every_required_field | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-012 | test_ac012_invalid_field_is_named_with_a_message_and_nothing_is_created[override0-email] | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-012 | test_ac012_invalid_field_is_named_with_a_message_and_nothing_is_created[override1-email] | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-012 | test_ac012_invalid_field_is_named_with_a_message_and_nothing_is_created[override2-full_name] | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-012 | test_ac012_invalid_field_is_named_with_a_message_and_nothing_is_created[override3-time_zone] | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-012 | test_ac012_invalid_field_is_named_with_a_message_and_nothing_is_created[override4-time_zone] | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-012 | test_ac012_invalid_field_is_named_with_a_message_and_nothing_is_created[override5-role] | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-012 | test_ac012_whitespace_only_name_is_treated_as_missing | Unit | Skipped | `backend/tests/test_admin_users_create_us004.py` |
| — | test_create_requires_a_session_and_the_csrf_header | Unit | Passed | `backend/tests/test_admin_users_create_us004.py` |
| AC-004 | test_ac004_no_session_401 | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-004 | test_ac004_non_admin_roles_get_403_no_data[Employee] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-004 | test_ac004_non_admin_roles_get_403_no_data[Manager] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-004 | test_ac004_non_admin_roles_get_403_no_data[Payroll Admin] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-005 | test_ac005_employee_only_own_records | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-006 | test_ac006_list_and_patch_persist | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-006 | test_ac006_patch_and_deactivate_404 | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-010 | test_ac010_create_invite_and_confirm | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-011 | test_ac011_duplicate_email_any_case_409 | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-011 | test_ac011_patch_duplicate_409 | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-012 | test_ac012_each_missing_field_422[email] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-012 | test_ac012_each_missing_field_422[full_name] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-012 | test_ac012_each_missing_field_422[role] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-012 | test_ac012_each_missing_field_422[time_zone] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-013 | test_ac013_assign_active_manager | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-014 | test_ac014_invalid_manager_refused[Employee] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-014 | test_ac014_invalid_manager_refused[Payroll Admin] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-014 | test_ac014_invalid_manager_refused[inactive] | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-014 | test_ac014_role_change_of_manager_with_reports_refused | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-014 | test_ac014_self_manager_refused | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| — | test_deactivate_revokes_sessions | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| — | test_self_deactivate_409 | Unit | Passed | `backend/tests/test_admin_users_qa.py` |
| AC-010 | [AC-010] a set-password link with an unknown token is rejected | E2E | Passed | `frontend/e2e/admin-users-create.spec.ts` |
| AC-010 | [AC-010] a sign-in for an account that has no password yet is refused | E2E | Passed | `frontend/e2e/admin-users-create.spec.ts` |
| AC-010 | [AC-010] a state-changing call without X-Requested-With is refused | E2E | Passed | `frontend/e2e/admin-users-create.spec.ts` |
| AC-010 | [AC-010] a valid create returns 201 and the user appears in the list | E2E | Skipped | `frontend/e2e/admin-users-create.spec.ts` |
| AC-010 | [AC-010] creating a user without a session is refused and creates nothing | E2E | Passed | `frontend/e2e/admin-users-create.spec.ts` |
| AC-011 | [AC-011] the same email, in any case, is rejected 409 with a clear message | E2E | Skipped | `frontend/e2e/admin-users-create.spec.ts` |
| AC-012 | [AC-012] the new-user form names each missing field and creates no account | E2E | Skipped | `frontend/e2e/admin-users-create.spec.ts` |
| AC-004 | [AC-004] an Employee opening /admin-users sees no admin data | E2E | Skipped | `frontend/e2e/admin-users.spec.ts` |
| AC-006 | [AC-006] edits a user's time zone through the screen | E2E | Skipped | `frontend/e2e/admin-users.spec.ts` |
| AC-010 | [AC-010] creates a user through the form | E2E | Skipped | `frontend/e2e/admin-users.spec.ts` |
| AC-011 | [AC-011] duplicate email, any case, shows under Email | E2E | Skipped | `frontend/e2e/admin-users.spec.ts` |
| AC-012 | [AC-012] missing required fields show messages under the field | E2E | Skipped | `frontend/e2e/admin-users.spec.ts` |
| AC-013 | [AC-013] assigning an active manager shows the manager's name | E2E | Skipped | `frontend/e2e/admin-users.spec.ts` |

## Sprint 2

### US-006: Edit and deactivate users

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-015 | test_ac015_all_four_fields_changed_together_are_stored | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_demotion_removes_admin_access_on_the_next_request | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_invalid_manager_in_a_combined_edit_stores_nothing | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_invalid_values_422_and_nothing_stored[body0-time_zone] | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_invalid_values_422_and_nothing_stored[body1-role] | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_invalid_values_422_and_nothing_stored[body2-full_name] | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_invalid_values_422_and_nothing_stored[body3-full_name] | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_manager_can_be_cleared | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_name_and_time_zone_show_on_the_users_next_request | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_partial_patch_leaves_other_fields_alone | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_promotion_applies_on_the_next_request_without_new_sign_in | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | test_ac015_unknown_user_404 | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_deactivate_unknown_user_404 | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_deactivated_admin_loses_admin_access_with_their_old_token | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_deactivated_user_can_still_be_edited_by_the_admin | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_deactivated_user_cannot_be_assigned_as_manager_by_patch | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_deactivated_user_cannot_be_assigned_as_manager_on_create | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_deactivated_user_cannot_sign_in_and_message_is_generic | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_deactivating_one_user_does_not_touch_another_users_sessions | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_editing_a_user_does_not_reactivate_them | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_every_existing_session_is_revoked_immediately | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-016 | test_ac016_record_is_kept_and_still_listed_as_deactivated | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| — | test_nfr005_edit_and_deactivate_need_the_csrf_header | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| — | test_nfr007_non_admins_cannot_edit_or_deactivate[Employee] | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| — | test_nfr007_non_admins_cannot_edit_or_deactivate[Manager] | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| — | test_nfr007_non_admins_cannot_edit_or_deactivate[Payroll Admin] | Unit | Passed | `backend/tests/test_admin_users_edit_us006.py` |
| AC-015 | [AC-015] an invalid time zone or manager is rejected 422 with field-level messages | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-015 | [AC-015] editing a user without a session is refused with 401 | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-015 | [AC-015] editing or deactivating an unknown user returns 404 | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-015 | [AC-015] name, role, manager and time zone are stored and returned by the list | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-015 | [AC-015] the admin edits a user's name and time zone and the API confirms it | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-016 | [AC-016] a deactivated user cannot sign in (generic refusal) | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-016 | [AC-016] a deactivated user is listed as inactive and cannot be made a manager | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-016 | [AC-016] an admin cannot deactivate their own account | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-016 | [AC-016] deactivating a user without a session is refused with 401 | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-016 | [AC-016] deactivating without X-Requested-With is refused | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |
| AC-016 | [AC-016] the admin deactivates a user after confirming, and the API shows them inactive | E2E | Not run yet | `frontend/e2e/admin-users-edit.spec.ts` |

### US-007: Manage clients

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-017 | test_ac017_blank_name_422[body0] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-017 | test_ac017_blank_name_422[body1] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-017 | test_ac017_blank_name_422[body2] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-017 | test_ac017_case_insensitive_duplicate_409_creates_nothing | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-017 | test_ac017_unique_client_appears_in_list | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-018 | test_ac018_archive_keeps_projects_and_tasks_in_admin_list | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-018 | test_ac018_project_under_archived_client_409 | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-018 | test_ac018_public_list_omits_archived_clients_projects | Unit | Skipped | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-019 | test_ac019_project_saved_under_client_with_rate[0-0.00] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-019 | test_ac019_project_saved_under_client_with_rate[135.5-135.50] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-019 | test_ac019_project_saved_under_client_with_rate[135.50-135.50] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_422_on_bill_rate_nothing_saved[-0.01] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_422_on_bill_rate_nothing_saved[-1] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_422_on_bill_rate_nothing_saved[12.345_0] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_422_on_bill_rate_nothing_saved[12.345_1] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_422_on_bill_rate_nothing_saved[None] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_422_on_bill_rate_nothing_saved[True] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_422_on_bill_rate_nothing_saved[] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_422_on_bill_rate_nothing_saved[abc] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_422_on_bill_rate_nothing_saved[rate7] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_on_edit_422_keeps_old_rate[-5] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_on_edit_422_keeps_old_rate[1.234] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_bad_rate_on_edit_422_keeps_old_rate[abc] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-020 | test_ac020_missing_rate_key_422 | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-021 | test_ac021_rate_change_leaves_others_unchanged | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-022 | test_ac022_no_invoice_or_payment_in_openapi_or_responses | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_duplicate_task_name_409 | Unit | Skipped | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_task_listed_for_project_in_admin_and_public | Unit | Skipped | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-024 | test_ac024_archived_task_hidden_publicly_kept_in_admin | Unit | Skipped | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[get-/api/admin/clients] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[patch-/api/admin/clients/1] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[patch-/api/admin/projects/1] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[post-/api/admin/clients] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[post-/api/admin/projects] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[get-/api/admin/clients-Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[get-/api/admin/clients-Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[get-/api/admin/clients-Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[patch-/api/admin/clients/1-Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[patch-/api/admin/clients/1-Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[patch-/api/admin/clients/1-Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[patch-/api/admin/projects/1-Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[patch-/api/admin/projects/1-Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[patch-/api/admin/projects/1-Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/clients-Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/clients-Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/clients-Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/projects-Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/projects-Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/projects-Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_any_role_reads_projects_without_bill_rate[Employee] | Unit | Skipped | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_any_role_reads_projects_without_bill_rate[Manager] | Unit | Skipped | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_any_role_reads_projects_without_bill_rate[Payroll Admin] | Unit | Skipped | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_any_role_reads_projects_without_bill_rate[System Admin] | Unit | Skipped | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_projects_401_without_session | Unit | Skipped | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr013_422_bodies_have_field_level_english_messages | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |

### US-010: Clock in and out against a project and task

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-018 | test_ac018_archived_client_refuses_clock_in_and_keeps_history | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-024 | test_ac024_archived_task_refuses_clock_in_and_keeps_history | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-025 | test_ac025_clock_in_creates_running_entry_and_status_returns_it | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-025 | test_ac025_status_idle_is_entry_null | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-025 | test_ac025_unknown_project_and_mismatched_task_422_no_row | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-026 | test_ac026_clock_out_nets_break_time | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-026 | test_ac026_open_break_is_closed_at_clock_out | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-026 | test_ac026_work_date_is_start_date_in_user_time_zone | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_clock_out_with_nothing_running_409 | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_concurrent_clock_ins_leave_one_open_entry | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_message_uses_users_local_time | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_second_clock_in_409_leaves_one_open_entry | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_second_clock_out_409 | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_every_clock_route_401_without_session[get-/api/clock/status] | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_every_clock_route_401_without_session[post-/api/clock/in] | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_every_clock_route_401_without_session[post-/api/clock/out] | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_user_never_sees_or_closes_another_users_entry | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr009_duration_across_autumn_change | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr009_duration_across_spring_forward_is_elapsed_utc_time | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr009_summer_late_utc_entry_has_next_local_work_date | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr014_deactivating_user_keeps_time_entries | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-015 | test_ac015_demotion_and_all_fields_show_on_next_request_same_session | Unit | Passed | `backend/tests/test_admin_users_edit_gaps_us006.py` |
| AC-016 | test_ac016_deactivated_login_refusal_is_byte_identical_to_bad_password | Unit | Passed | `backend/tests/test_admin_users_edit_gaps_us006.py` |
| AC-016 | test_ac016_deactivated_manager_message_present_on_patch_and_create | Unit | Passed | `backend/tests/test_admin_users_edit_gaps_us006.py` |
| AC-016 | test_ac016_nfr014_deactivated_row_keeps_its_own_manager_and_reports | Unit | Passed | `backend/tests/test_admin_users_edit_gaps_us006.py` |
| — | test_nfr007_patch_and_deactivate_no_session_401_and_non_admin_403_without_data | Unit | Passed | `backend/tests/test_admin_users_edit_gaps_us006.py` |
| — | test_health_reports_ok | Unit | Passed | `backend/tests/test_health.py` |
| — | test_the_openapi_document_builds | Unit | Passed | `backend/tests/test_health.py` |
| AC-015 | [AC-015] an admin edits a user's role and time zone and sees the success banner | E2E | Not run yet | `frontend/e2e/admin-users-edit-ui.spec.ts` |
| AC-016 | [AC-016] deactivating through the confirm step marks the row Deactivated and removes the user from the Manager dropdown | E2E | Not run yet | `frontend/e2e/admin-users-edit-ui.spec.ts` |
| — | the app loads | E2E | Passed | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
