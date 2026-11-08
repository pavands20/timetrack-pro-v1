# Tests

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start summary -->
84 tests · Passed 62 · Failed 1 · Skipped 1 · Not run 20

Acceptance criteria covered: 14/51 · passing: 4/51
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start tests -->
## Sprint 1

### US-001: Sign in with email and password

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| AC-001 | test_ac001_bearer_header_is_rejected_on_me | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| AC-001 | test_ac001_login_sets_httponly_strict_cookie_and_no_token | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| AC-002 | test_ac002_all_failures_identical | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| AC-002 | test_ac002_login_validation_422_and_csrf_403 | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| AC-003 | test_ac003_logout_revokes_session | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_logout_without_csrf_header_is_403 | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_me_returns_user_and_401_without_session | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_nfr001_expired_or_deactivated_session_is_401 | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_nfr003_require_role_403_without_data | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| — | test_seed_creates_admin_only_when_no_user_exists | Unit | Passed | `backend/tests/test_auth_foundation.py` |
| AC-001 | test_ac001_bearer_rejected_401_on_me | Unit | Passed | `backend/tests/test_auth_us001_qa.py` |
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
| AC-001 | [AC-001] sign-in lands on the role's home page | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |
| AC-002 | [AC-002] a wrong password shows the generic error | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |
| AC-002 | [AC-002] an unknown email shows the same generic error | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |
| AC-003 | [AC-003] a protected URL without a session redirects to /sign-in | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |
| AC-003 | [AC-003] sign-out returns to /sign-in and protected URLs redirect back | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |
| AC-009 | [AC-009] reset request shows the same confirmation for known and unknown emails | E2E | Not run yet | `frontend/e2e/auth.spec.ts` |

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
| AC-004 | test_ac004_login_sets_session_cookie | Unit | Failed | `backend/tests/test_admin_users_qa.py` |
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
| AC-010 | [AC-010] a set-password link with an unknown token is rejected | E2E | Not run yet | `frontend/e2e/admin-users-create.spec.ts` |
| AC-010 | [AC-010] a sign-in for an account that has no password yet is refused | E2E | Not run yet | `frontend/e2e/admin-users-create.spec.ts` |
| AC-010 | [AC-010] a state-changing call without X-Requested-With is refused | E2E | Not run yet | `frontend/e2e/admin-users-create.spec.ts` |
| AC-010 | [AC-010] a valid create returns 201 and the user appears in the list | E2E | Not run yet | `frontend/e2e/admin-users-create.spec.ts` |
| AC-010 | [AC-010] creating a user without a session is refused and creates nothing | E2E | Not run yet | `frontend/e2e/admin-users-create.spec.ts` |
| AC-011 | [AC-011] the same email, in any case, is rejected 409 with a clear message | E2E | Not run yet | `frontend/e2e/admin-users-create.spec.ts` |
| AC-012 | [AC-012] the new-user form names each missing field and creates no account | E2E | Not run yet | `frontend/e2e/admin-users-create.spec.ts` |
| AC-004 | [AC-004] an Employee opening /admin-users sees no admin data | E2E | Not run yet | `frontend/e2e/admin-users.spec.ts` |
| AC-006 | [AC-006] edits a user's time zone through the screen | E2E | Not run yet | `frontend/e2e/admin-users.spec.ts` |
| AC-010 | [AC-010] creates a user through the form | E2E | Not run yet | `frontend/e2e/admin-users.spec.ts` |
| AC-011 | [AC-011] duplicate email, any case, shows under Email | E2E | Not run yet | `frontend/e2e/admin-users.spec.ts` |
| AC-012 | [AC-012] missing required fields show messages under the field | E2E | Not run yet | `frontend/e2e/admin-users.spec.ts` |
| AC-013 | [AC-013] assigning an active manager shows the manager's name | E2E | Not run yet | `frontend/e2e/admin-users.spec.ts` |

## Project setup

| Criteria | Test | Level | Result | File |
|---|---|---|---|---|
| — | test_health_reports_ok | Unit | Passed | `backend/tests/test_health.py` |
| — | test_the_openapi_document_builds | Unit | Passed | `backend/tests/test_health.py` |
| — | the app loads | E2E | Not run yet | `frontend/e2e/example.spec.ts` |
<!-- sdlc:auto:end tests -->
