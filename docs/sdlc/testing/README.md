# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-CHECKS-1 · draft · source: testing:run_checks

Automated project checks ran and succeeded with 6 of 6 checks passing. These checks were not tied to a specific ticket.

- Step: run_checks
- Ticket: none (project-wide)
- Status: succeeded
- Result: 6/6 checks passed
- Not provided in input:
  - which checks were run (e.g. lint, type check, build)
  - run date
  - who triggered the run

### TEST-WT-39f5caa1 · draft · source: testing:write_tests:39f5caa1-04b8-40cb-b6cc-cbd0e99af269

Tests were written for ticket 39f5caa1, producing 3 test files. The input does not say which requirement this ticket covers or whether these tests pass.

- Step: write_tests
- Ticket: 39f5caa1-04b8-40cb-b6cc-cbd0e99af269
- Status: succeeded
- Output: 3 test file(s)
- Not provided in input:
  - ticket-to-requirement (US-xxx) mapping
  - test file names
  - test cases covered
  - pass/fail results of these tests

**Related:** 39f5caa1-04b8-40cb-b6cc-cbd0e99af269

### TEST-WT-961f93a5 · draft · source: testing:write_tests:961f93a5-577a-49a2-9c12-17c793cb74d6

Tests were written for ticket 961f93a5, producing 5 test files. The input does not say which requirement this ticket covers or whether these tests pass.

- Step: write_tests
- Ticket: 961f93a5-577a-49a2-9c12-17c793cb74d6
- Status: succeeded
- Output: 5 test file(s)
- Not provided in input:
  - ticket-to-requirement (US-xxx) mapping
  - test file names
  - test cases covered
  - pass/fail results of these tests

**Related:** 961f93a5-577a-49a2-9c12-17c793cb74d6

### TEST-WT-ff7194f3 · draft · source: testing:write_tests:ff7194f3-46de-4aaf-8a65-05c124a9873f

Tests were written for ticket ff7194f3, producing 2 test files. The input does not say which requirement this ticket covers or whether these tests pass.

- Step: write_tests
- Ticket: ff7194f3-46de-4aaf-8a65-05c124a9873f
- Status: succeeded
- Output: 2 test file(s)
- Not provided in input:
  - ticket-to-requirement (US-xxx) mapping
  - test file names
  - test cases covered
  - pass/fail results of these tests

**Related:** ff7194f3-46de-4aaf-8a65-05c124a9873f

### TEST-E2E-LATEST · draft · source: testing:e2e:latest

The latest end-to-end run against the sandbox target reports an overall status of 'passed', but only 12 of 70 tests passed. These two facts conflict and both are recorded here. The pass rate does not support treating the application as verified end to end.

- Target: sandbox
- Reported run status: passed
- Reported result: 12/70 passed
  - 58 tests did not pass (failed, skipped or errored; the breakdown is not given)
  - Pass rate is about 17%
- CONFLICT:
  - The run-level status says 'passed'.
  - The test count shows 58 of 70 tests not passing.
  - The input gives no explanation, such as a pass threshold, allowed failures, or skipped tests counted as non-failing.
  - Needs human review before this run is treated as a quality gate.
- Not provided in input:
  - which E2E scenarios passed or failed
  - failure reasons
  - mapping of scenarios to requirements US-001 to US-019
  - run date
  - build/commit tested
- Requirement coverage:
  - Cannot be determined from this input.
  - No requirement is marked as verified by this run.

**Related:** TEST-WT-39f5caa1, TEST-WT-961f93a5, TEST-WT-ff7194f3
<!-- sdlc:auto:end narrative -->
