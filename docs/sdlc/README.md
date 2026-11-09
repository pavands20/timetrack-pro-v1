# TimeTrack Pro V1 — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
Build a time and labour management web app for a company of up to 500 employees, similar to Replicon. ▎ ▎ Users and roles: Employee, Manager, Payroll Admin, System Admin. Sign-in with email and password. Admins create users and assign each employee a manager. ▎ ▎ Time tracking: employees clock in and out (with breaks) from the browser, or fill a weekly timesheet by day. Each time entry is charged to a project and task. Entries can be marked billable or non-billable. ▎ ▎ Projects: admins create clients, projects and tasks, with an hourly bill rate per project. ▎ ▎ Timesheet approval: employees submit their week. The manager approves or rejects it with a comment, and a rejected sheet goes back for editing. Approved sheets are locked. ▎ ▎ Time off: employees request leave (annual, sick, unpaid) for full or half days. The manager approves it. Each employee sees their leave balance, which grows by a fixed number of days per month. ▎ ▎ Labour rules: an admin sets the daily and weekly overtime limits, for example 8 h per day and 40 h per week, plus the minimum break after 6 hours. The app flags overtime and missed breaks on the timesheet and in a compliance report. ▎ ▎ Reports: hours by employee, project and week; billable versus non-billable hours; overtime; leave taken. Export to CSV, including a payroll export of approved hours per employee per period. ▎ ▎ Notifications: in-app alerts for a timesheet due, approved or rejected, and a leave request decided. ▎ ▎ Audit: record who changed or approved any timesheet, and when.

**Documentation version:** v33
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v2 approved |
| [Architecture](architecture/README.md) | 28 entries |
| [Development](development/README.md) | 12 entries |
| [Testing](testing/README.md) | 5 entries |
| [Deployment](deployment/README.md) | 3 entries |
| [Maintenance](maintenance/README.md) | 0 entries |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 5 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 30 routes |
| [Test report](testing/test-report.md) | running |
| [Tests](testing/test-cases.md) | 537 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 11 releases |
| [Traceability matrix](traceability-matrix.md) | 22 requirements |
| [Changelog](CHANGELOG.md) | 33 versions |
<!-- sdlc:auto:end contents -->
