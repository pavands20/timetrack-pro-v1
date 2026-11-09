# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-CHECKS-01 · draft · source: testing:run_checks

Automated project checks ran with no specific ticket attached and all 6 passed. The input does not say what the 6 checks cover.

- Task: run_checks
- Ticket: none
- Status: succeeded
- Result: 6/6 checks passed
- Not stated in input: which checks were run (for example lint, type-check or unit tests), when they ran, or which requirements they cover.

### TEST-c20459d5 · draft · source: testing:write_tests:c20459d5-fda9-4c33-b42a-e5287708677a

Tests were written for ticket c20459d5 and the task reported success with 2 test files. No test names, counts, results or acceptance-criteria coverage were given.

- Task: write_tests
- Ticket: c20459d5-fda9-4c33-b42a-e5287708677a
- Status: succeeded
- Output: 2 test file(s)
- Not stated in input:
  - file names
  - number of tests
  - pass/fail results
  - covered acceptance criteria or user story
- The ticket cannot be traced to a US key from the input provided.

**Related:** c20459d5-fda9-4c33-b42a-e5287708677a

### TEST-8213eca7 · draft · source: testing:write_tests:8213eca7-95a2-4dba-87c6-9fa89a56e8ba

Break-related tests were added for AC-028, AC-029 and AC-030: a pytest backend file and a Playwright API spec. The pytest file gave 8 passed and 2 skipped, and ruff was clean. The Playwright spec was not run and was only type-checked.

- Task: write_tests
- Ticket: 8213eca7-95a2-4dba-87c6-9fa89a56e8ba
- Status: succeeded
- Acceptance criteria covered: AC-028, AC-029, AC-030
- Files added:
  - backend/tests/test_breaks_us011_qa.py: 10 pytest tests
  - frontend/e2e/breaks.spec.ts: 4 Playwright API specs
- Results:
  - pytest: 8 passed, 2 skipped (the input gives no reason for the skips)
  - ruff: clean
  - Playwright: not run; tsc reported nothing for this file
- Traceability: the link to US-011 comes from the test file name (test_breaks_us011_qa.py). The input does not state it directly, so a human should confirm it.
- Gaps:
  - The 2 skipped pytest tests are unexplained.
  - The breaks e2e specs have no execution result.

**Related:** 8213eca7-95a2-4dba-87c6-9fa89a56e8ba, US-011, AC-028, AC-029, AC-030

### TEST-d38399fb · draft · source: testing:write_tests:d38399fb-fefc-45e4-91e5-71313a312b4d

Tests for AC-045 and AC-046 were added at three levels: backend pytest on the clock and timesheet endpoints, Vitest on the Home screen, and a Playwright spec. All 9 backend tests and all 5 Vitest tests pass. The e2e specs were only listed by the check, not run, because they need E2E credentials.

- Task: write_tests
- Ticket: d38399fb-fefc-45e4-91e5-71313a312b4d
- Status: succeeded
- Acceptance criteria covered: AC-045, AC-046
- Test levels and results:
  - pytest on the clock and timesheet endpoints: 9 tests, passing
  - Vitest on the Home screen: 5 tests, passing
  - Playwright spec: listed by the check but not run, because it requires E2E credentials
- Traceability: the input does not name the parent user story for AC-045 or AC-046, so no US key is linked.
- Gap: no end-to-end execution result exists for this ticket.

**Related:** d38399fb-fefc-45e4-91e5-71313a312b4d, AC-045, AC-046

### TEST-385dceab · draft · source: testing:write_tests:385dceab-3ed3-4ca5-935d-22e13e5a632a

Tests were written for ticket 385dceab and the task reported success with 3 test files. No test names, counts, results or acceptance-criteria coverage were given.

- Task: write_tests
- Ticket: 385dceab-3ed3-4ca5-935d-22e13e5a632a
- Status: succeeded
- Output: 3 test file(s)
- Not stated in input:
  - file names
  - number of tests
  - pass/fail results
  - covered acceptance criteria or user story
- The ticket cannot be traced to a US key from the input provided.

**Related:** 385dceab-3ed3-4ca5-935d-22e13e5a632a

### TEST-E2E-LATEST · draft · source: testing:e2e_run:latest

The latest end-to-end run targeted the sandbox environment. Its overall status is reported as 'passed', but only 12 of 53 tests passed. The two values conflict and both are recorded as given.

- Target: sandbox
- Reported overall status: passed
- Reported count: 12/53 passed
- Conflict:
  - The 'passed' status does not match a 12 of 53 result, which implies 41 tests did not pass.
  - The input does not say whether those 41 failed, were skipped, or were not executed.
  - The input does not say whether a pass threshold applies.
- Not stated in input:
  - which specs were included
  - whether breaks.spec.ts (ticket 8213eca7) or the AC-045/AC-046 Playwright spec (ticket d38399fb) were part of this run; both were reported as not run at write time
  - the run date
- Needs human review before this run is treated as a passing E2E gate.

**Related:** TEST-8213eca7, TEST-d38399fb
<!-- sdlc:auto:end narrative -->
