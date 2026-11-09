# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-CHECKS-01 · draft · source: testing:run_checks

An automated check run, not tied to any ticket, succeeded with all 6 checks passing. The input does not say what the checks cover.

- Action: run_checks
- Ticket: none (project-level run)
- Status: succeeded
- Result: 6/6 checks passed
- Not stated in input: which checks were included (e.g. lint, type-check, unit tests), the run date, and who triggered the run.

### TEST-E2E-01 · draft · source: testing:e2e

The latest end-to-end run against the sandbox target is reported as 'passed', but only 12 of 53 specs passed. The overall status and the pass count conflict, so both are recorded as given.

- Target: sandbox
- Reported overall status: passed
- Reported count: 12/53 passed
- Conflict: a 'passed' status alongside 12/53 passing specs. The input does not say whether the other 41 specs failed, were skipped, or were not executed. Both values are recorded as given rather than reconciled.
- Related context from ticket notes:
  - Ticket d38399fb: its e2e specs were 'only listed by the check, not run, because they need E2E credentials'.
  - Ticket 8213eca7: its Playwright file breaks.spec.ts was 'not run'.
  - These notes may partly explain the non-passing count, but the input does not confirm this.
- Not stated in input: run date, per-spec results, and which requirements the 12 passing specs cover.
- Follow-up for a human reviewer: confirm the true E2E outcome before treating this run as a release gate.

**Related:** d38399fb-fefc-45e4-91e5-71313a312b4d, 8213eca7-95a2-4dba-87c6-9fa89a56e8ba

### TEST-c20459d5 · draft · source: testing:write_tests:c20459d5-fda9-4c33-b42a-e5287708677a

Test-writing for ticket c20459d5 succeeded and produced 2 test files. The input gives no execution results, file names, or covered requirements.

- Action: write_tests
- Ticket: c20459d5-fda9-4c33-b42a-e5287708677a
- Status: succeeded
- Output: 2 test file(s)
- Not stated in input: file names, test framework, pass/fail results, and the acceptance criteria or user stories covered.

**Related:** c20459d5-fda9-4c33-b42a-e5287708677a

### TEST-8213eca7 · draft · source: testing:write_tests:8213eca7-95a2-4dba-87c6-9fa89a56e8ba

Backend and Playwright tests were added for break handling, covering AC-028, AC-029 and AC-030. The backend file names US-011. The pytest suite gave 8 passed and 2 skipped. The Playwright specs were written but not executed.

- Action: write_tests
- Ticket: 8213eca7-95a2-4dba-87c6-9fa89a56e8ba
- Status: succeeded
- Files added:
  - backend/tests/test_breaks_us011_qa.py: 10 pytest tests
  - frontend/e2e/breaks.spec.ts: 4 Playwright API specs
- Acceptance criteria covered: AC-028, AC-029, AC-030
- Requirement link: US-011, inferred only from the file name 'test_breaks_us011_qa.py'
- Results:
  - pytest: 8 passed, 2 skipped (reason for the skips not stated)
  - ruff: clean
  - Playwright: not run
  - tsc: reported nothing for the spec file (type-check only, not an execution result)
- Open gaps: the 2 skipped pytest tests and the unexecuted Playwright specs leave part of AC-028 to AC-030 unverified at runtime.

**Related:** 8213eca7-95a2-4dba-87c6-9fa89a56e8ba, US-011, AC-028, AC-029, AC-030

### TEST-d38399fb · draft · source: testing:write_tests:d38399fb-fefc-45e4-91e5-71313a312b4d

Tests for AC-045 and AC-046 were added at three levels: backend pytest, frontend Vitest and Playwright e2e. The backend (9) and Vitest (5) tests pass. The e2e specs were only listed, not run, because E2E credentials were missing.

- Action: write_tests
- Ticket: d38399fb-fefc-45e4-91e5-71313a312b4d
- Status: succeeded
- Acceptance criteria covered: AC-045, AC-046
- Test levels:
  - pytest on the clock and timesheet endpoints: 9 tests, passing
  - Vitest on the Home screen: 5 tests, passing
  - Playwright spec: listed by the check only, not executed (requires E2E credentials)
- Requirement link: the input does not say which user story AC-045 and AC-046 belong to, so no US id is linked.
- Open gap: no e2e verification exists for AC-045 and AC-046 until E2E credentials are provided.

**Related:** d38399fb-fefc-45e4-91e5-71313a312b4d, AC-045, AC-046

### TEST-385dceab · draft · source: testing:write_tests:385dceab-3ed3-4ca5-935d-22e13e5a632a

Test-writing for ticket 385dceab succeeded and produced 3 test files. The input gives no execution results, file names, or covered requirements.

- Action: write_tests
- Ticket: 385dceab-3ed3-4ca5-935d-22e13e5a632a
- Status: succeeded
- Output: 3 test file(s)
- Not stated in input: file names, test framework, pass/fail results, and the acceptance criteria or user stories covered.

**Related:** 385dceab-3ed3-4ca5-935d-22e13e5a632a
<!-- sdlc:auto:end narrative -->
