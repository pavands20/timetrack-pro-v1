# Testing

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### TEST-001 · draft · source: testing:write_tests:bd833e54-d9bc-4f63-9da3-a144b410034b

Tests were written for acceptance criteria AC-010, AC-011 and AC-012: a pytest integration file and a Playwright spec. The pytest suite ran with 15 passes and 1 strict xfail. The Playwright spec was only linted, not executed.

- Ticket: bd833e54-d9bc-4f63-9da3-a144b410034b
- Status: succeeded
- Acceptance criteria covered: AC-010, AC-011, AC-012
- pytest integration file:
  - Covers the full flow: create user, emailed link, set password, sign-in.
  - 16 tests ran: 15 passed, 1 strict xfail.
  - The input does not say which behavior the xfail covers or why it is expected to fail.
- Playwright spec:
  - Covers the API contract and the form's missing-field validation messages.
  - Linted only, not run, so there are no execution results.
  - Most of the spec is skipped when no admin credentials are provided.
- Traceability: the input does not map AC-010 to AC-012 to specific US-xxx requirement keys, so none are linked here.

**Related:** bd833e54-d9bc-4f63-9da3-a144b410034b, AC-010, AC-011, AC-012

### TEST-002 · draft · source: testing:write_tests:a00e099b-f91f-41e9-8a42-885b30414d27

A second test-writing ticket succeeded and produced 5 test files. The input gives no detail on what these tests cover or whether they were run.

- Ticket: a00e099b-f91f-41e9-8a42-885b30414d27
- Status: succeeded
- Output: 5 test files
- Not stated in the input:
  - which features, acceptance criteria or requirements are covered
  - test framework
  - execution results

**Related:** a00e099b-f91f-41e9-8a42-885b30414d27

### TEST-003 · draft · source: testing:run_checks

The automated checks step failed, with 5 of 6 checks passing. The input does not identify the failing check.

- Ticket: none
- Status: failed
- Result: 5 of 6 checks passed, 1 failed
- Not stated in the input:
  - the name of the failing check
  - the cause of the failure
  - what the checks consist of (e.g. lint, type, unit)
- Open item: identify and resolve the failing check.

### TEST-004 · draft · source: testing:e2e_latest_run

The latest E2E run against the sandbox target is reported as 'passed', yet only 9 of 24 tests passed. These two facts conflict, so both are recorded as given.

- Target: sandbox
- Reported run status: passed
- Reported result: 9 of 24 passed
- Conflict: the overall status says 'passed', but 15 of 24 tests did not pass.
  - The input does not say whether those 15 tests failed, were skipped or did not run.
  - Neither value has been chosen over the other; this needs human confirmation.
- Possible relation to TEST-001 (unconfirmed): that ticket notes most of the Playwright spec is skipped without admin credentials. The input does not say whether that spec was part of this run.

### TEST-005 · draft · source: testing:write_tests:bd833e54-d9bc-4f63-9da3-a144b410034b; testing:run_checks; testing:e2e_latest_run

Open testing gaps found across the testing inputs. Testing cannot be considered complete until these are resolved.

- run_checks failed with 1 of 6 checks failing; the failing check is not identified.
- The E2E run status ('passed') conflicts with its result (9 of 24 passed).
- The Playwright spec for AC-010 to AC-012 has not been run. It needs admin credentials to avoid skipping most tests.
- One pytest test is a strict xfail; its subject is unspecified.
- The 5 test files from ticket a00e099b-f91f-41e9-8a42-885b30414d27 have no stated coverage or results.
- No input links test results to requirement keys US-001 to US-019. Requirement-level test coverage cannot be confirmed from this input.

**Related:** TEST-001, TEST-002, TEST-003, TEST-004
<!-- sdlc:auto:end narrative -->
