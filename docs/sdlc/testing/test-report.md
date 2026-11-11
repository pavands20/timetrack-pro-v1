# Test Report

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start e2e -->
**Status:** passed
**Target:** sandbox
**Date:** 2026-11-09

Passed: 12 · Failed: 0 · Skipped: 58 · Flaky: 0 · Total: 70

| Spec | Status |
|---|---|
| [AC-019] admin creates a client and a project with a rate, adds a task and archives it | skipped |
| [AC-020] an invalid rate (-5 and abc) shows the clear validation message | skipped |
| [AC-022] no invoice or payment control is visible | skipped |
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
| [AC-015] an admin edits a user's role and time zone and sees the success banner | skipped |
| [AC-016] deactivating through the confirm step marks the row Deactivated and removes the user from the Manager dropdown | skipped |
| [AC-015] editing a user without a session is refused with 401 | passed |
| [AC-016] deactivating a user without a session is refused with 401 | passed |
| [AC-016] deactivating without X-Requested-With is refused | passed |
| [AC-015] name, role, manager and time zone are stored and returned by the list | skipped |
| [AC-015] an invalid time zone or manager is rejected 422 with field-level messages | skipped |
| [AC-015] editing or deactivating an unknown user returns 404 | skipped |
| [AC-016] a deactivated user is listed as inactive and cannot be made a manager | skipped |
| [AC-016] a deactivated user cannot sign in (generic refusal) | skipped |
| [AC-016] an admin cannot deactivate their own account | skipped |
| [AC-015] the admin edits a user's name and time zone and the API confirms it | skipped |
| [AC-016] the admin deactivates a user after confirming, and the API shows them inactive | skipped |
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
| [AC-028] a break started and ended is recorded and subtracted from the entry | skipped |
| [AC-029] clocking out while on a break closes the break and the entry | skipped |
| [AC-030] starting a second break while on one is refused with 409 | skipped |
| [AC-030] break endpoints require a session | skipped |
| [AC-025] [AC-026] [AC-027] clock in, refused second clock-in, break, clock out nets the break | skipped |
| [NFR-012] the clock panel has no horizontal scroll at 375px | skipped |
| [AC-042] API returns Monday-first 7 days and 401 without a session | skipped |
| [AC-043] empty week shows 0.0 h with links to the clock and the timesheet | skipped |
| [AC-044] recording an entry changes the Home figures and deleting it drops them | skipped |
| [AC-048] Home, Timesheet and Help show English labels only | skipped |
| [NFR-010] Home and Timesheet weeks run Monday to Sunday | skipped |
| [AC-047] [NFR-012] /home has no horizontal scroll and tall primary controls | skipped |
| [AC-047] [NFR-012] /timesheet has no horizontal scroll and tall primary controls | skipped |
| the app loads | passed |
| [AC-049] the user guide covers clocking, breaks, timesheet, editing and dashboard | skipped |
| [AC-050] an Employee sees no Admin guide tab or text | skipped |
| [AC-051] [NFR-016] [NFR-006] project documentation covers stack, setup, email API key and EU/UK region | skipped |
| [NFR-007] [NFR-008] [NFR-015] project documentation states GDPR, 6-year retention and 500 users | skipped |
| [AC-050] the Admin guide covers users, managers, clients, projects, tasks and bill rates | skipped |
| [AC-049] an admin can still read the user guide | skipped |
| [AC-032] an end time before the start shows the message and the entry stays running | skipped |
| [AC-031] the alert is shown, the user sets an end time, saves, and the alert goes away | skipped |
| [AC-039] edit an entry's day, hours and billable and see it change | skipped |
| [AC-039] a bad hours value shows a field-level message and keeps the entry | skipped |
| [AC-040] Cancel keeps the entry, Confirm removes it | skipped |
| [AC-041] an API call against another user's entry id is refused | skipped |
| [AC-045] the API stores and returns UTC instants and the profile carries the IANA zone | skipped |
| [AC-045] the clock screen shows the clock-in time in the profile zone, not UTC | skipped |
| [AC-046] the weekly timesheet reports its zone and puts a clocked entry on its local day with its elapsed minutes | skipped |
| [AC-045] times endpoints refuse a request with no session | skipped |
| [AC-046] a clock-in spanning a real daylight-saving change cannot be driven end to end: the live server clock cannot be set (covered in backend/tests/test_timezone_us017_qa.py) | skipped |
<!-- sdlc:auto:end e2e -->

<!-- sdlc:auto:start unit -->
**Coverage:** backend 94.4% · frontend 89.5%

**Test cases:** 0 / 343 written

**Lines written:** 0

**Files deferred:** 0
<!-- sdlc:auto:end unit -->

<!-- sdlc:auto:start dev-checks -->
### Sprint 5

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | failed | — | 2026-11-09 |
| write_tests | succeeded | US-020 | 2026-11-09 |

### Sprint 4

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-09 |
| write_tests | succeeded | US-015 | 2026-11-09 |
| write_tests | succeeded | US-016 | 2026-11-09 |
| write_tests | succeeded | US-019 | 2026-11-09 |

### Sprint 3

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-09 |
| write_tests | succeeded | US-013 | 2026-11-09 |
| write_tests | succeeded | US-011 | 2026-11-09 |
| write_tests | succeeded | US-017 | 2026-11-09 |
| write_tests | succeeded | US-012 | 2026-11-09 |

### Sprint 2

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-09 |
| write_tests | succeeded | US-006 | 2026-11-09 |
| write_tests | succeeded | US-007 | 2026-11-09 |
| write_tests | succeeded | US-010 | 2026-11-09 |

### Sprint 2

| Step | Status | Ticket | Finished |
|---|---|---|---|
| run_checks | succeeded | — | 2026-11-08 |
| write_tests | succeeded | US-006 | 2026-11-08 |
| write_tests | succeeded | US-007 | 2026-11-08 |
| write_tests | succeeded | US-010 | 2026-11-08 |

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
