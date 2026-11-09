# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-CHECKS-1 · draft · source: testing:run_checks

Automated check run succeeded with all 6 checks passing. The run is not tied to a specific ticket.

- Step: run_checks
- Ticket: none
- Status: succeeded
- Result: 6/6 checks passed
- The input does not name the individual checks.

### TEST-3ffb9b35 · draft · source: testing:write_tests:3ffb9b35-c8cd-42a1-a908-453eb66af245

Added 5 backend QA tests for US-006 covering admin user changes and the preservation of time entries. All 5 pass under backend-tests. They fill gaps for AC-015, AC-016 and NFR-014 that the existing US-006 tests did not cover.

- Step: write_tests
- Ticket: 3ffb9b35-c8cd-42a1-a908-453eb66af245
- Status: succeeded
- New file: backend/tests/test_admin_users_time_entries_us006_qa.py
- Test count: 5, all passing under backend-tests
- Coverage added:
  - AC-016 and NFR-014: time entries and breaks are kept unchanged.
  - AC-015: edits leave time entries and breaks untouched.
- Not added: Vitest and Playwright tests. The agent states the existing US-006 files already cover both criteria.

**Related:** US-006

### TEST-8297276d · draft · source: testing:write_tests:8297276d-0731-421c-b73b-f7bc6b612864

Test-writing task succeeded and produced 2 test files. The input does not say which requirement or feature these files cover.

- Step: write_tests
- Ticket: 8297276d-0731-421c-b73b-f7bc6b612864
- Status: succeeded
- Output: 2 test file(s)
- Not stated in the input:
  - File names
  - Test counts
  - Pass/fail results
  - Linked requirement

### TEST-9c5fee6d · draft · source: testing:write_tests:9c5fee6d-098c-410d-8ab2-3e9e96f8c22d

Test-writing task succeeded and produced 3 test files. The input does not say which requirement or feature these files cover.

- Step: write_tests
- Ticket: 9c5fee6d-098c-410d-8ab2-3e9e96f8c22d
- Status: succeeded
- Output: 3 test file(s)
- Not stated in the input:
  - File names
  - Test counts
  - Pass/fail results
  - Linked requirement

### TEST-E2E-LATEST · draft · source: testing:e2e

The latest end-to-end run against the sandbox target is reported as 'passed', yet only 12 of 42 tests passed. Both values are recorded because they conflict. The 30 tests that did not pass are not identified.

- Target: sandbox
- Reported overall status: passed
- Reported result: 12/42 passed (about 29%)
- CONFLICT:
  - The overall status says 'passed'.
  - The count shows 30 of 42 tests did not pass.
  - The input does not explain this discrepancy. Possible reasons, such as skipped versus failed tests or a pass threshold, are not stated.
- Not stated in the input:
  - Which tests failed or were skipped
  - Which requirements they cover
  - Run date
- Needs human review before treating E2E as green.
<!-- sdlc:auto:end narrative -->
