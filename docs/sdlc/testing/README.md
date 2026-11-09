# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-CHECKS-001 · draft · source: testing:run_checks

An automated checks run, not tied to any ticket, succeeded with all 6 checks passing. The input does not say which checks were run.

- Task: run_checks
- Ticket: none
- Status: succeeded
- Result: 6/6 checks passed
- Not stated in input: names or scope of the individual checks, date, and who triggered the run.

### TEST-3ffb9b35 · draft · source: testing:write_tests:3ffb9b35-c8cd-42a1-a908-453eb66af245

Five new backend tests were added for US-006 (admin users and time entries), and all pass under backend-tests. They cover acceptance criteria the existing US-006 tests did not: time entries and breaks stay unchanged. No new frontend (Vitest) or browser (Playwright) tests were added.

- Task: write_tests
- Status: succeeded
- File added: backend/tests/test_admin_users_time_entries_us006_qa.py
- Test count: 5. All pass under the backend-tests suite.
- Purpose: cover gaps the existing US-006 tests could not cover.
- AC-016 and NFR-014: tests show that time entries and breaks are kept unchanged.
- AC-015: tests show that edits leave time entries and breaks untouched.
- Not added: Vitest tests and Playwright tests. The agent's stated reason is that the existing US-006 Vitest and Playwright files already cover both criteria.
- Not stated in input: date, and the full text of AC-015, AC-016 and NFR-014.

**Related:** US-006, AC-015, AC-016, NFR-014

### TEST-8297276d · draft · source: testing:write_tests:8297276d-0731-421c-b73b-f7bc6b612864

A test-writing task succeeded and produced 2 test files. The input does not say which requirement, files, or test framework these cover.

- Task: write_tests
- Ticket: 8297276d-0731-421c-b73b-f7bc6b612864
- Status: succeeded
- Output: 2 test file(s)
- Not stated in input: file names, requirement or user story covered, test count, whether the tests pass, and date.
- Traceability gap: no requirement link can be established from the input.

### TEST-9c5fee6d · draft · source: testing:write_tests:9c5fee6d-0731-421c-b73b-f7bc6b612864

A test-writing task succeeded and produced 3 test files. The input does not say which requirement, files, or test framework these cover.

- Task: write_tests
- Ticket: 9c5fee6d-098c-410d-8ab2-3e9e96f8c22d
- Status: succeeded
- Output: 3 test file(s)
- Not stated in input: file names, requirement or user story covered, test count, whether the tests pass, and date.
- Traceability gap: no requirement link can be established from the input.

### TEST-E2E-LATEST · draft · source: testing:e2e:latest

The latest E2E run against the sandbox target is reported as 'passed', but its own count shows only 12 of 42 tests passing. These two figures conflict, and both are recorded here. The run should be reviewed before anyone treats E2E as green.

- Target environment: sandbox
- Reported overall status: passed
- Reported count: 12/42 passed
- CONFLICT: the 'passed' status does not match the count. By the count, 30 of 42 tests did not pass. The input does not say whether those 30 failed, were skipped, or were excluded.
- Not stated in input: which tests failed or were skipped, which requirements the E2E tests map to, date, and who ran it.
- Action for a human reviewer: reconcile the overall status with the pass count, and identify the 30 tests that did not pass.
<!-- sdlc:auto:end narrative -->
