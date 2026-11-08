# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-CHECKS-01 · draft · source: testing:run_checks

Automated checks ran across the project, not tied to any ticket. Status succeeded, with 6 of 6 checks passing.

- Task: run_checks
- Ticket: none
- Status: succeeded
- Result: 6/6 checks passed
- Not stated in input: which checks were run, date, who ran them.

### TEST-afc68c26 · draft · source: testing:write_tests:afc68c26-0a38-4f86-a51c-4c06770fcfa9

Three test files were written for acceptance criteria AC-015 and AC-016. The pytest backend suite (26 tests) and the Vitest AdminUsers screen suite (3 tests) pass. The Playwright end-to-end spec was written, but its specs were only listed, not run.

- Task: write_tests; status: succeeded
- Scope: AC-015 and AC-016 (the input does not map these to US-* keys, so no requirement link is inferred)
- Files added:
  1. pytest module: 26 tests, all passing
  2. Vitest file for the AdminUsers screen: 3 tests, passing
  3. Playwright spec: specs listed only, NOT executed
- Backend lint: pass
- Frontend lint: pass
- Frontend e2e-specs check: pass. Per the input, this check only lists the specs and does not run them.
- Open item: there is no execution evidence for this ticket's Playwright spec. The input does not say whether it was part of the sandbox E2E run (TEST-E2E-LATEST).

**Related:** afc68c26-0a38-4f86-a51c-4c06770fcfa9, AC-015, AC-016

### TEST-4618e363 · draft · source: testing:write_tests:4618e363-2124-4018-8a57-1c0e33c31967

Tests were written for this ticket, producing 2 test files. The task status is succeeded. No further details were provided.

- Task: write_tests; status: succeeded
- Output: 2 test file(s)
- Not stated in input: test names, framework, number of tests, pass/fail results, or which requirements or acceptance criteria they cover.

**Related:** 4618e363-2124-4018-8a57-1c0e33c31967

### TEST-c5c3a2f5 · draft · source: testing:write_tests:c5c3a2f5-1f26-46c7-b3b4-692d427f9646

Tests were written for this ticket, producing 2 test files. The task status is succeeded. No further details were provided.

- Task: write_tests; status: succeeded
- Output: 2 test file(s)
- Not stated in input: test names, framework, number of tests, pass/fail results, or which requirements or acceptance criteria they cover.

**Related:** c5c3a2f5-1f26-46c7-b3b4-692d427f9646

### TEST-E2E-LATEST · draft · source: testing:e2e:latest

The latest E2E run against the sandbox target reports a status of 'passed', but only 9 of 24 tests passed. These two values conflict, so both are recorded here. A human should review this before treating E2E as green.

- Target: sandbox
- Reported status: passed
- Reported result: 9/24 passed
- CONFLICT: the 'passed' status disagrees with the 9/24 count. 15 of 24 tests are not reported as passing, and the input does not say whether they failed, were skipped, or errored.
- Not stated in input: which specs were included, which failed, the run date, or whether the AC-015/AC-016 Playwright spec (TEST-afc68c26) was part of this run.
- No requirement coverage can be traced from this input.

**Related:** TEST-afc68c26
<!-- sdlc:auto:end narrative -->
