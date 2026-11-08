# Test Report

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start e2e -->
**Status:** passed
**Target:** sandbox
**Date:** 2026-11-08

Passed: 9 · Failed: 0 · Skipped: 15 · Flaky: 0 · Total: 24

| Spec | Status |
|---|---|
| [AC-010] creating a user without a session is refused and creates nothing | passed |
| [AC-010] a state-changing call without X-Requested-With is refused | passed |
| [AC-010] a sign-in for an account that has no password yet is refused | passed |
| [AC-010] a set-password link with an unknown token is rejected | passed |
| [AC-010] a valid create returns 201 and the user appears in the list | skipped |
| [AC-011] the same email, in any case, is rejected 409 with a clear message | skipped |
| [AC-012] missing full_name returns 422 naming the field and creates nothing | skipped |
| [AC-012] missing email returns 422 naming the field and creates nothing | skipped |
| [AC-012] missing role returns 422 naming the field and creates nothing | skipped |
| [AC-012] missing time_zone returns 422 naming the field and creates nothing | skipped |
| [AC-012] the new-user form names each missing field and creates no account | skipped |
| [AC-004] an Employee opening /admin-users sees no admin data | skipped |
| [AC-010] creates a user through the form | skipped |
| [AC-011] duplicate email, any case, shows under Email | skipped |
| [AC-012] missing required fields show messages under the field | skipped |
| [AC-006] edits a user's time zone through the screen | skipped |
| [AC-013] assigning an active manager shows the manager's name | skipped |
| [AC-001] sign-in lands on the role's home page | skipped |
| [AC-002] a wrong password shows the generic error | passed |
| [AC-002] an unknown email shows the same generic error | passed |
| [AC-003] sign-out returns to /sign-in and protected URLs redirect back | skipped |
| [AC-003] a protected URL without a session redirects to /sign-in | passed |
| [AC-009] reset request shows the same confirmation for known and unknown emails | passed |
| the app loads | passed |
<!-- sdlc:auto:end e2e -->

<!-- sdlc:auto:start unit -->
**Coverage:** backend 86.5% · frontend 54.6%

**Test cases:** 0 / 71 written

**Lines written:** 0

**Files deferred:** 0
<!-- sdlc:auto:end unit -->

<!-- sdlc:auto:start dev-checks -->
### Sprint 1

| Step | Status | Ticket | Finished |
|---|---|---|---|
| write_tests | succeeded | US-004 | 2026-11-08 |
| run_checks | failed | — | 2026-11-08 |
| write_tests | succeeded | US-001 | 2026-11-08 |

### Sprint 1

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-08 |
| write_tests | succeeded | US-001 | 2026-11-08 |
| write_tests | succeeded | US-004 | 2026-11-08 |
<!-- sdlc:auto:end dev-checks -->
