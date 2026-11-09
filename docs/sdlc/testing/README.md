# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-CHECKS-1 · draft · source: testing:run_checks

The automated check run failed: 5 of 6 checks passed. The run was not tied to a specific ticket. The input does not say which check failed.

- Activity: run_checks
- Ticket: none (project-level run)
- Status: failed
- Result: 5/6 checks passed, 1 check failed
- Not stated in input: name or type of the failing check, failure output, date, who ran it
- Open item: identify and fix the failing check before release sign-off

### TEST-WRITE-1 · draft · source: testing:write_tests:91661125-8902-4c39-99c4-e242aba1d181

Test authoring succeeded for ticket 91661125-8902-4c39-99c4-e242aba1d181 and produced 2 test files. The input does not say which feature or requirement these tests cover.

- Activity: write_tests
- Ticket: 91661125-8902-4c39-99c4-e242aba1d181
- Status: succeeded
- Output: 2 test file(s)
- Not stated in input: file names, test cases, the features or requirement keys (US-xxx) covered, date
- Traceability gap: no mapping from this ticket to a requirement key was provided

**Related:** 91661125-8902-4c39-99c4-e242aba1d181

### TEST-E2E-1 · draft · source: testing:e2e:latest

The latest end-to-end run against the sandbox is reported as 'passed', yet only 12 of 70 tests passed. These two facts conflict. Both are recorded here and need human review.

- Target environment: sandbox
- Reported run status: passed
- Reported results: 12/70 passed (about 17%); 58 tests did not pass
- CONFLICT: the 'passed' status does not match the 12/70 pass count. The input gives no explanation, so neither value has been picked as correct.
- Not stated in input: which tests failed or were skipped, failure causes, the requirements covered, date
- Open item: reconcile the run status with the test counts and triage the 58 tests that did not pass
<!-- sdlc:auto:end narrative -->
