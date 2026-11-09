# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
344 tests · Passed 303 · Failed 0 · Skipped 12 · Not run 29

Acceptance criteria covered: 40/51 · passing: 17/51
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
| AC-015 | test_ac015_manager_change_applies_on_next_request_and_keeps_time_entries | Unit | Passed | `backend/tests/test_admin_users_time_entries_us006_qa.py` |
| AC-015 | test_ac015_nfr014_editing_name_role_and_time_zone_keeps_time_entries | Unit | Passed | `backend/tests/test_admin_users_time_entries_us006_qa.py` |
| AC-016 | test_ac016_deactivated_user_cannot_use_old_token_or_sign_in_but_entries_remain | Unit | Passed | `backend/tests/test_admin_users_time_entries_us006_qa.py` |
| AC-016 | test_ac016_deactivating_one_user_leaves_another_users_entries_alone | Unit | Passed | `backend/tests/test_admin_users_time_entries_us006_qa.py` |
| AC-016 | test_ac016_nfr014_deactivating_keeps_every_time_entry_and_break_unchanged | Unit | Passed | `backend/tests/test_admin_users_time_entries_us006_qa.py` |
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
| AC-018 | test_ac018_public_list_omits_archived_clients_projects | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
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
| AC-023 | test_ac023_archived_client_409_no_task | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_blank_task_name_422[body0] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_blank_task_name_422[body1] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_blank_task_name_422[body2] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_duplicate_task_name_409 | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_same_task_name_allowed_in_other_project | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_task_created_201_body | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_task_listed_for_project_in_admin_and_public | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-023 | test_ac023_unknown_project_404 | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-024 | test_ac024_archived_task_hidden_publicly_kept_in_admin | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-024 | test_ac024_projects_401_without_session_has_no_data | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-024 | test_ac024_public_list_omits_archived_and_bill_rate | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-024 | test_ac024_unknown_task_patch_404 | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[get-/api/admin/clients] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[patch-/api/admin/clients/1] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[patch-/api/admin/projects/1] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[patch-/api/admin/tasks/1] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[post-/api/admin/clients] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_401_without_session[post-/api/admin/projects/1/tasks] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
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
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[patch-/api/admin/tasks/1-Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[patch-/api/admin/tasks/1-Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[patch-/api/admin/tasks/1-Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/clients-Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/clients-Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/clients-Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/projects-Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/projects-Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/projects-Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/projects/1/tasks-Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/projects/1/tasks-Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_admin_routes_403_for_non_admin_no_data[post-/api/admin/projects/1/tasks-Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_any_role_reads_projects_without_bill_rate[Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_any_role_reads_projects_without_bill_rate[Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_any_role_reads_projects_without_bill_rate[Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_any_role_reads_projects_without_bill_rate[System Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_every_catalog_route_403_no_data_and_nothing_changes[Employee] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_every_catalog_route_403_no_data_and_nothing_changes[Manager] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_every_catalog_route_403_no_data_and_nothing_changes[Payroll Admin] | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr007_projects_401_without_session | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr013_422_bodies_have_field_level_english_messages | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| — | test_nfr014_rate_change_archive_task_and_client_keep_time_entries | Unit | Passed | `backend/tests/test_admin_catalog_us007_qa.py` |
| AC-019 | [AC-019] admin creates a client and a project with a rate, adds a task and archives it | E2E | Not run yet | `frontend/e2e/admin-projects.spec.ts` |
| AC-020 | [AC-020] an invalid rate (-5 and abc) shows the clear validation message | E2E | Not run yet | `frontend/e2e/admin-projects.spec.ts` |
| AC-022 | [AC-022] no invoice or payment control is visible | E2E | Not run yet | `frontend/e2e/admin-projects.spec.ts` |

### US-010: Clock in and out against a project and task

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-018 | test_ac018_archived_client_refuses_clock_in_and_keeps_history | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-024 | test_ac024_archived_task_refuses_clock_in_and_keeps_history | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-025 | test_ac025_clock_in_creates_running_entry_and_status_returns_it | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-025 | test_ac025_status_idle_is_entry_null | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-025 | test_ac025_unknown_project_and_mismatched_task_422_no_row | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-026 | test_ac026_break_start_and_end_create_and_close_break_row | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-026 | test_ac026_clock_out_nets_break_time | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-026 | test_ac026_open_break_is_closed_at_clock_out | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-026 | test_ac026_work_date_is_start_date_in_user_time_zone | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_break_end_without_open_break_409 | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_break_start_without_entry_409 | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_clock_out_with_nothing_running_409 | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_concurrent_break_starts_leave_one_open_break | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_concurrent_clock_ins_leave_one_open_entry | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_double_break_start_409_one_open | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_message_uses_users_local_time | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_second_clock_in_409_leaves_one_open_entry | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-027 | test_ac027_second_clock_out_409 | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_break_routes_401_without_session[/api/clock/breaks/end] | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_break_routes_401_without_session[/api/clock/breaks/start] | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_every_clock_route_401_without_session[get-/api/clock/status] | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_every_clock_route_401_without_session[post-/api/clock/in] | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_every_clock_route_401_without_session[post-/api/clock/out] | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_user_cannot_start_or_end_another_users_break | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr007_user_never_sees_or_closes_another_users_entry | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr009_autumn_change_local_date_and_duration_with_break | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr009_break_across_spring_forward_nets_elapsed_utc | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr009_duration_across_autumn_change | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr009_duration_across_spring_forward_is_elapsed_utc_time | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr009_summer_late_utc_entry_has_next_local_work_date | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| — | test_nfr014_deactivating_user_keeps_time_entries | Unit | Passed | `backend/tests/test_clock_us010_qa.py` |
| AC-025, AC-026, AC-027 | [AC-025] [AC-026] [AC-027] clock in, refused second clock-in, break, clock out nets the break | E2E | Not run yet | `frontend/e2e/clock.spec.ts` |
| — | [NFR-012] the clock panel has no horizontal scroll at 375px | E2E | Not run yet | `frontend/e2e/clock.spec.ts` |

## Sprint 3

### US-011: Record breaks while clocked in

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-028 | test_ac028_break_does_not_change_entry_start | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-028 | test_ac028_break_row_has_start_and_end_times | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-028 | test_ac028_response_reports_break_and_status_reflects_it | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-028 | test_ac028_several_breaks_are_all_subtracted | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-029 | test_ac029_after_clock_out_status_is_idle_and_break_calls_refused | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-029 | test_ac029_clock_out_on_break_ends_break_at_clock_out_time | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-029 | test_ac029_clock_out_on_second_break_keeps_first_break_untouched | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-030 | test_ac030_refusal_does_not_stop_break_being_ended_normally | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-030 | test_ac030_second_start_while_on_break_refused_and_original_kept | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-030 | test_ac030_start_break_without_running_entry_refused | Unit | Passed | `backend/tests/test_breaks_us011_qa.py` |
| AC-028 | [AC-028] a break started and ended is recorded and subtracted from the entry | E2E | Not run yet | `frontend/e2e/breaks.spec.ts` |
| AC-029 | [AC-029] clocking out while on a break closes the break and the entry | E2E | Not run yet | `frontend/e2e/breaks.spec.ts` |
| AC-030 | [AC-030] break endpoints require a session | E2E | Not run yet | `frontend/e2e/breaks.spec.ts` |
| AC-030 | [AC-030] starting a second break while on one is refused with 409 | E2E | Not run yet | `frontend/e2e/breaks.spec.ts` |

### US-012: Recover an entry left running

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-031 | test_ac031_already_closed_409_unchanged | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-031 | test_ac031_offset_end_at_is_converted_to_utc | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-031 | test_ac031_open_break_closed_at_end_at | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-031 | test_ac031_second_patch_409 | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-031 | test_ac031_stale_entry_closed_net_of_breaks | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_end_before_last_break_422_nothing_changed | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_end_not_after_start_422_entry_stays_open[delta0] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_end_not_after_start_422_entry_stays_open[delta1] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_end_not_after_start_422_entry_stays_open[delta2] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_future_end_422_entry_stays_open | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_malformed_value_422_field_level[12345] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_malformed_value_422_field_level[2026-01-13T17:00:00] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_malformed_value_422_field_level[2026-13-45T10:00:00Z] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_malformed_value_422_field_level[None] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_malformed_value_422_field_level[True] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_malformed_value_422_field_level[] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_malformed_value_422_field_level[not a date] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_malformed_value_422_field_level[value6] | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-032 | test_ac032_missing_body_field_422 | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| — | test_nfr007_401_without_session | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| — | test_nfr007_other_users_closed_entry_also_404_not_409 | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| — | test_nfr007_other_users_entry_404_no_data_and_unchanged | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| — | test_nfr007_unknown_entry_404 | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| — | test_nfr009_autumn_change_recovery_work_date_and_duration | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| — | test_nfr009_late_utc_start_gets_next_local_work_date_in_summer | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| — | test_nfr009_spring_forward_recovery_local_times_and_duration | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| — | test_nfr013_messages_are_field_level_english | Unit | Passed | `backend/tests/test_time_entries_end_us012_qa.py` |
| AC-031 | [AC-031] the alert is shown, the user sets an end time, saves, and the alert goes away | E2E | Not run yet | `frontend/e2e/recover-entry.spec.ts` |
| AC-032 | [AC-032] an end time before the start shows the message and the entry stays running | E2E | Not run yet | `frontend/e2e/recover-entry.spec.ts` |

### US-013: Enter hours by day in a weekly timesheet

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-033 | test_ac033_put_then_get_returns_hours_and_totals | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-033 | test_ac033_reput_replaces_not_adds | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_bad_minutes_422_field_level_nothing_saved[-1] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_bad_minutes_422_field_level_nothing_saved[1.5] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_bad_minutes_422_field_level_nothing_saved[1441] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_bad_minutes_422_field_level_nothing_saved[60] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_bad_minutes_422_field_level_nothing_saved[99999] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_bad_minutes_422_field_level_nothing_saved[None] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_bad_minutes_422_field_level_nothing_saved[True] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_bad_minutes_422_field_level_nothing_saved[abc] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_bad_minutes_422_field_level_nothing_saved[minutes7] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_boundaries_0_and_1440_accepted | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_day_total_across_two_rows_over_24h_422 | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_day_total_over_24h_with_manual_and_clocked_422 | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-034 | test_ac034_one_bad_cell_saves_none | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-035 | test_ac035_empty_week_has_seven_totals | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-035 | test_ac035_garbage_week_422 | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-035 | test_ac035_get_returns_seven_days_monday_to_sunday | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-035 | test_ac035_non_monday_422_on_get_and_put[2026-01-11] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-035 | test_ac035_non_monday_422_on_get_and_put[2026-01-13] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-035 | test_ac035_non_monday_422_on_get_and_put[2026-01-18] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-036 | test_ac036_clocked_entry_net_of_break_beside_manual | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-036 | test_ac036_other_users_entries_not_in_my_week | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-036 | test_ac036_running_entry_excluded | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-036 | test_ac036_summer_late_utc_entry_lands_on_next_local_day | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-037 | test_ac037_collision_409_nothing_changed | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-037 | test_ac037_non_boolean_billable_422 | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-037 | test_ac037_other_users_entry_404_no_data | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-037 | test_ac037_patch_billable_on_clocked_entry | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-037 | test_ac037_patch_billable_on_manual_entry | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-037 | test_ac037_unknown_entry_404 | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-038 | test_ac038_different_billable_listed_as_separate_rows | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-038 | test_ac038_missing_billable_422_nothing_saved | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| AC-038 | test_ac038_null_billable_422 | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr007_day_total_limit_ignores_other_users_hours | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr007_every_route_401_without_session[get-/api/timesheets/2026-01-12] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr007_every_route_401_without_session[patch-/api/time-entries/1] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr007_every_route_401_without_session[put-/api/timesheets/cells] | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr007_users_never_see_or_change_each_others_hours | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr009_autumn_change_week_attribution_and_duration | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr009_manual_hours_on_dst_days_keep_minutes | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr009_spring_forward_week_attribution_and_duration | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr009_week_boundary_uses_user_time_zone | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |
| — | test_nfr013_422_bodies_are_field_level_english | Unit | Passed | `backend/tests/test_timesheets_us013_qa.py` |

### US-017: Times stored in UTC and shown in my time zone

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-045 | test_ac045_clock_out_returns_utc_instants_and_local_work_date | Unit | Passed | `backend/tests/test_timezone_us017_qa.py` |
| AC-045 | test_ac045_conflict_message_shows_the_start_in_the_users_zone | Unit | Passed | `backend/tests/test_timezone_us017_qa.py` |
| AC-045 | test_ac045_stored_instant_is_the_same_whatever_the_profile_zone | Unit | Passed | `backend/tests/test_timezone_us017_qa.py` |
| AC-045 | test_ac045_summer_0900_london_is_stored_as_0800_utc_and_displays_0900 | Unit | Passed | `backend/tests/test_timezone_us017_qa.py` |
| AC-045 | test_ac045_winter_0900_london_is_stored_as_0900_utc | Unit | Passed | `backend/tests/test_timezone_us017_qa.py` |
| AC-046 | test_ac046_entry_across_autumn_change_shows_correct_duration_and_local_times | Unit | Passed | `backend/tests/test_timezone_us017_qa.py` |
| AC-046 | test_ac046_entry_across_spring_forward_shows_correct_duration_and_local_times | Unit | Passed | `backend/tests/test_timezone_us017_qa.py` |
| AC-046 | test_ac046_entry_starting_after_the_change_lands_on_the_sunday | Unit | Passed | `backend/tests/test_timezone_us017_qa.py` |
| AC-046 | test_ac046_timesheet_places_a_late_utc_entry_on_the_next_local_day | Unit | Passed | `backend/tests/test_timezone_us017_qa.py` |
| AC-045 | [AC-045] the API stores and returns UTC instants and the profile carries the IANA zone | E2E | Not run yet | `frontend/e2e/timezone.spec.ts` |
| AC-045 | [AC-045] the clock screen shows the clock-in time in the profile zone, not UTC | E2E | Not run yet | `frontend/e2e/timezone.spec.ts` |
| AC-045 | [AC-045] times endpoints refuse a request with no session | E2E | Not run yet | `frontend/e2e/timezone.spec.ts` |
| AC-046 | [AC-046] a clock-in spanning a real daylight-saving change cannot be driven end to end: the live server clock cannot be set (covered in backend/tests/test_timezone_us017_qa.py) | E2E | Not run yet | `frontend/e2e/timezone.spec.ts` |
| AC-046 | [AC-046] the weekly timesheet reports its zone and puts a clocked entry on its local day with its elapsed minutes | E2E | Not run yet | `frontend/e2e/timezone.spec.ts` |

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
