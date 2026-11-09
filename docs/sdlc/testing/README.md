# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-CHECKS-001 · draft · source: testing:run_checks

A project-wide automated check run (not tied to a ticket) succeeded, with 6 of 6 checks passing.

- Activity: run_checks
- Ticket: none (project-level run)
- Status: succeeded
- Result: 6/6 checks passed
- Not provided in input: what the 6 checks are (e.g. lint, type-check, build, unit tests), run date, environment, who triggered or reviewed it.

### TEST-WT-39f5caa1 · draft · source: testing:write_tests:39f5caa1-04b8-40cb-b6cc-cbd0e99af269

Automated tests were written for ticket 39f5caa1, producing 3 test files.

- Activity: write_tests
- Ticket: 39f5caa1-04b8-40cb-b6cc-cbd0e99af269
- Status: succeeded
- Output: 3 test file(s)
- Not provided in input: which feature or requirement (US-xxx) this ticket covers, file names, test counts, pass/fail results of these specific tests, date.

**Related:** 39f5caa1-04b8-40cb-b6cc-cbd0e99af269

### TEST-WT-961f93a5 · draft · source: testing:write_tests:961f93a5-577a-49a2-9c12-17c793cb74d6

Automated tests were written for ticket 961f93a5, producing 5 test files. This is the largest set among the three tickets.

- Activity: write_tests
- Ticket: 961f93a5-577a-49a2-9c12-17c793cb74d6
- Status: succeeded
- Output: 5 test file(s)
- Not provided in input: which feature or requirement (US-xxx) this ticket covers, file names, test counts, pass/fail results of these specific tests, date.

**Related:** 961f93a5-577a-49a2-9c12-17c793cb74d6

### TEST-WT-ff7194f3 · draft · source: testing:write_tests:ff7194f3-46de-4aaf-8a65-05c124a9873f

Automated tests were written for ticket ff7194f3, producing 2 test files.

- Activity: write_tests
- Ticket: ff7194f3-46de-4aaf-8a65-05c124a9873f
- Status: succeeded
- Output: 2 test file(s)
- Not provided in input: which feature or requirement (US-xxx) this ticket covers, file names, test counts, pass/fail results of these specific tests, date.

**Related:** ff7194f3-46de-4aaf-8a65-05c124a9873f

### TEST-E2E-LATEST · draft · source: testing:e2e:latest

The latest end-to-end run targeted the sandbox environment. Its reported overall status conflicts with its pass count. Both values are recorded as given and need human review before this run is treated as a pass.

- Target environment: sandbox
- Reported overall status: passed
- Reported result: 12/70 passed
- CONFLICT: the status says 'passed', but only 12 of 70 E2E tests are reported as passing. By arithmetic, 58 tests are not reported as passing. The input does not say whether they failed, were skipped, or are pending.
- Possible explanations cannot be confirmed from the input. For example, the status may reflect run completion rather than the test outcome, or a pass threshold may apply. No resolution is assumed.
- Not provided in input: which tests passed or did not, which requirements (US-001 to US-019) the E2E suite covers, failure logs, run date, who reviewed it.
- Recommended follow-up (documentation gap, not a decision): confirm the actual E2E outcome and record a test-to-requirement mapping.

**Related:** TEST-CHECKS-001, TEST-WT-39f5caa1, TEST-WT-961f93a5, TEST-WT-ff7194f3

### TEST-SUMMARY · draft · source: testing:phase-input

Overview of testing activity recorded so far: checks passed, 10 test files written across three tickets, and an E2E result that needs reconciliation. Requirement-level coverage is unknown.

- Project checks: 6/6 passed (succeeded).
- Test authoring: 3 tickets, all succeeded. Total test files: 3 + 5 + 2 = 10.
- E2E (sandbox): status 'passed', but only 12/70 passed. This conflict is unresolved (see TEST-E2E-LATEST).
- Requirement traceability: the input links no tests or tickets to US-001 to US-019. Coverage of time tracking, timesheet approval and locking, time off, labour-rule flagging, reports and payroll export, notifications, and timesheet audit logging cannot be stated.
- No test sign-off, approver or dates are recorded. All entries remain draft.

**Related:** TEST-CHECKS-001, TEST-WT-39f5caa1, TEST-WT-961f93a5, TEST-WT-ff7194f3, TEST-E2E-LATEST
<!-- sdlc:auto:end narrative -->
