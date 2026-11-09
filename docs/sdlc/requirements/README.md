# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-OVERVIEW · draft · source: requirements:v2

TimeTrack Pro V1 is a time and labour management web app for up to 500 employees, similar to Replicon. Requirements version 2 is delivered under the Lightweight scope. It has 9 epics and 22 stories covering sign-in, user admin, project setup, clock in/out, weekly timesheets, a dashboard, display rules, documentation and a read-only manager team view.

- Delivery scope: lightweight
- Requirements version: 2
- Roles: Employee, Manager, Payroll Admin, System Admin (exactly one role per user, see US-002)
- Epics:
  - EPIC-001 Sign-in and account access (US-001 to US-003)
  - EPIC-002 User account administration (US-004 to US-006)
  - EPIC-003 Clients, projects, tasks and bill rate (US-007 to US-009)
  - EPIC-004 Clock in and out with breaks (US-010 to US-012)
  - EPIC-005 Weekly timesheet entry (US-013 to US-015)
  - EPIC-006 Employee dashboard (US-016)
  - EPIC-007 Time zone, week start, language and responsive layout (US-017, US-018)
  - EPIC-008 Basic user and project documentation (US-019)
  - EPIC-009 Manager team view, read-only (US-020 to US-022), from CHG-001
- Priorities:
  - Critical: US-001, US-004, US-010, US-013, US-022
  - High: US-002, US-005, US-007, US-008, US-009, US-011, US-014, US-015, US-017, US-020, US-021
  - Medium: US-003, US-006, US-012, US-016, US-018, US-019
- Acceptance criteria run from AC-001 to AC-065. AC-064 sits under US-002 and AC-065 under US-019.
- No story-level sign-off is given in the input.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008, EPIC-009, CHG-001

### REQ-STACK · approved · source: requirements:technology-stack

The product owner approved the stack: FastAPI 0.115 backend, AWS (EU/UK regions), PostgreSQL 16 and React 19. Designs must use exactly these, with no substitution. This conflicts with the Node.js assumption still written in EPIC-001.

Approved stack and stated rationale:
- Backend: FastAPI 0.115 (Python)
  - Node.js is not available on the platform.
  - Offers a REST API with strict request validation, suited to timesheet, leave and rate data.
  - Generates interactive API docs automatically.
  - 500 users is well within capacity.
- Cloud: AWS
  - EU/UK hosting is required; Ireland, Frankfurt, Paris and London regions are available.
  - Managed PostgreSQL, encrypted backups and email sending are available in-region.
- Database: PostgreSQL 16
  - The data is relational.
  - Reports are database queries.
  - Transactions support locking and auditing.
  - Stores UTC times.
  - Access to sick-leave rows can be restricted.
- Frontend: React 19 with TypeScript
  - Responsive browser app (no native app).
  - Supports approval queues, tables and reports.
  - Handles the Monday-morning submission peak client-side.

CONFLICTS (both versions recorded):
- Backend:
  - EPIC-001 open assumption: 'stack is React/TypeScript, Node.js REST API and PostgreSQL'.
  - Approved stack: FastAPI 0.115. The approved stack explicitly supersedes the analyst's Node.js assumption.
- Payroll API:
  - The FastAPI rationale refers to 'the read-only payroll API you want a future payroll connector to use'.
  - EPIC-001's scope note puts the payroll export/API outside the Lightweight MVP, and no story covers it.
- Leave and approvals:
  - The rationale refers to leave data, sick-leave rows, approval queues, reports and locking of approved sheets.
  - None of these are in this version's stories.

**Related:** EPIC-001, US-017, US-018, US-002, REQ-OVERVIEW

### REQ-SERVICES · approved · source: requirements:services

One runtime service is approved: an SMTP email server, sent via Amazon SES in an EU region, used for password-reset emails. It requires four environment variables. EPIC-001 still states the email key has not been supplied.

- Email:
  - Type: SMTP server (SaaS).
  - Required environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD.
  - Purpose: password-reset emails (US-003).
  - Provider: Amazon SES in an EU region, so email handling stays in the EU.
- API keys this app needs: SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER.
- AC-051 requires the project documentation to describe this configuration, including the email service API key.

CONFLICT (both versions recorded):
- EPIC-001 assumption: 'Password reset needs an email service API key, which has not yet been supplied.'
- Services section: SMTP has been approved by the product owner, with named environment variables.
- The input does not confirm whether real credential values have been supplied.

**Related:** US-003, EPIC-001, US-019

### REQ-SCOPE · draft · source: requirements:scope

The in-scope capabilities cover sign-in, admin-created accounts, project setup with bill rates, clock in/out, weekly timesheets, a dashboard and display rules. Native mobile, invoicing and payroll calculation are explicitly out of scope. Several features in the project description are also excluded from the Lightweight MVP and are not drafted.

In scope:
- Email and password sign-in
- User accounts created by admins
- Client, project and task setup
- Hourly bill rate per project
- Clock in and out with breaks
- Weekly timesheet entry by day
- Billable and non-billable marking per entry
- Employee dashboard of weekly hours
- Editing and deleting own time entries
- Basic user and project documentation
- Times stored in UTC and shown in the user's time zone
- Week starts on Monday
- English-only interface
- Bill rate used for reporting only, no invoicing
- Initial data entered manually, no SSO or HR-system sync
- Added via CHG-001: read-only Manager team view (EPIC-009)

Explicitly out of scope:
- Native mobile app (a responsive web app replaces it)
- Invoicing and payroll calculation (the app only exports approved hours)

In the project description but excluded from the Lightweight MVP (EPIC-001 scope note), not drafted:
- Timesheet submission, approval and locking
- Time off / leave and leave balances
- Labour-rule flags (overtime, minimum break) and the compliance report
- Reports
- Payroll export and payroll API
- Notifications
- Audit log

Other exclusions stated in the input:
- SSO, CSV import and HR-system sync (EPIC-002)
- Configurable week start day (EPIC-007)
- Breaks are recorded but not checked against rules (EPIC-004)
- Timesheets stay editable by their owner in this version (EPIC-005)
- EPIC-009 excludes: approving or locking timesheets, reports, exports, notifications, skip-level reports, and team access for Payroll Admin or System Admin

Note: the out-of-scope line says 'the app only exports approved hours', but the payroll export itself is also outside this delivery scope.

**Related:** EPIC-001, EPIC-004, EPIC-005, EPIC-009, US-008, US-018

### CHG-001 · approved · source: requirements:EPIC-009

Change request CHG-001 is classed as major and produced a new requirements version. It adds a read-only 'My team' view so Managers can see their direct reports' timesheets. Access comes only from the employee's Manager field and is checked on the server for every request.

- Classification: major, new version.
- Status recorded as approved because the change was incorporated into requirements v2. No approver or date is given.
- Adds EPIC-009 with stories US-020, US-021 and US-022.
- Also extends earlier stories:
  - AC-064 (US-002): server-side ownership / reporting-line check.
  - AC-050 (US-019): admin guide explains how manager access is granted and removed.
  - AC-065 (US-019): Manager help section on the My team view.
- Rules:
  - Times are shown in the employee's own time zone.
  - The week runs Monday to Sunday.
  - Read-only for Managers.
- Excluded:
  - Approving or locking timesheets
  - Reports, exports and notifications
  - Indirect (skip-level) reports
  - Team access for Payroll Admin or System Admin

**Related:** EPIC-009, US-020, US-021, US-022, AC-064, AC-050, AC-065

### US-001 · draft · source: requirements:US-001

Critical. Users with an account sign in with email and password. They land on the home page for their role and can sign out.

Epic: EPIC-001 Sign-in and account access.

Auth assumption (open):
- Hashed passwords
- Session cookies
- Password reset by email
- No SSO

Acceptance criteria:
- AC-001: With correct credentials on the sign-in page, a session starts and the user lands on the home page for their role.
- AC-002: An incorrect password or unknown email is refused with a generic error that does not reveal whether the email exists.
- AC-003: Signing out ends the session; protected pages then require signing in again.

**Related:** EPIC-001, AC-001, AC-002, AC-003

### US-002 · draft · source: requirements:US-002

High. Each user has exactly one role: Employee, Manager, Payroll Admin or System Admin. Access is restricted by role. Since CHG-001, the server also checks ownership or reporting line for any request for another user's time data.

Acceptance criteria:
- AC-004: An Employee opening an admin page or requesting admin data via the API is denied, and no admin data is returned.
- AC-005: An Employee can only see and change their own time entries.
- AC-006: A System Admin can view and change user accounts and roles in user administration.
- AC-064: For any request for another user's time entries, breaks or timesheets (UI or API), the server checks ownership or the recorded reporting line before returning anything.
  - A Manager can read, but never create, edit or delete, the time data of users whose Manager field is set to them.
  - Every other request for another user's time data, and every change request by a Manager, gets 403 with no data returned or changed.

**Related:** EPIC-001, AC-004, AC-005, AC-006, AC-064, US-022, US-015

### US-003 · draft · source: requirements:US-003

Medium. A user who forgot their password requests a reset by email. They receive a single-use, time-limited link. This depends on the SMTP service.

Acceptance criteria:
- AC-007: For an active account with the email service configured, a reset request emails a single-use, time-limited link to that address.
- AC-008: With a valid link, setting a new password that meets the password rules updates the password, invalidates the link and allows sign-in with the new password.
- AC-009: For an email with no account, the same confirmation message is shown and no email is sent.

Dependency: SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD). See REQ-SERVICES for the conflict about whether the key has been supplied.

Gap: the password rules are referenced but not defined in the input.

**Related:** EPIC-001, AC-007, AC-008, AC-009, REQ-SERVICES

### US-004 · draft · source: requirements:US-004

Critical. A System Admin creates a user with name, unique email, role and time zone. The new user can then set a password and sign in.

Epic: EPIC-002. Initial data is entered manually; there is no CSV import, SSO or HR sync.

Acceptance criteria:
- AC-010: Valid details with an unused email create the account; the user can set a password and sign in.
- AC-011: A duplicate email is rejected with a clear duplicate-email message.
- AC-012: A missing required field is identified on the form, and no account is created.

Gap: how the new user sets their first password is not specified.

**Related:** EPIC-002, AC-010, AC-011, AC-012

### US-005 · draft · source: requirements:US-005

High. A System Admin assigns a manager to each employee. Only users with the Manager role can be assigned. Since CHG-001, this field is also what grants team-view access.

Acceptance criteria:
- AC-013: Assigning a Manager-role user to an employee shows that manager on the employee's record.
- AC-014: Assigning a user who is not a Manager is refused.

The story's stated purpose is 'recorded for later approval features'. After CHG-001, the Manager field also drives My team access (US-020, US-022).

**Related:** EPIC-002, AC-013, AC-014, US-020, US-022

### US-006 · draft · source: requirements:US-006

Medium. A System Admin edits a user's name, role, manager or time zone, or deactivates the user. Deactivated users cannot sign in, but their time entries are kept.

Acceptance criteria:
- AC-015: Changes to name, role, manager or time zone are stored and apply from the user's next request.
- AC-016: A deactivated user cannot sign in, their existing time entries are kept, and they cannot be selected as a new manager.

Related: AC-062 (team access re-evaluated after deactivation or role change).

**Related:** EPIC-002, AC-015, AC-016, US-022

### US-007 · draft · source: requirements:US-007

High. A System Admin creates, edits and archives clients. Archiving a client blocks new time on its projects but keeps existing entries visible.

Acceptance criteria:
- AC-017: Creating a client with a unique name adds it to the client list.
- AC-018: Archiving a client with projects stops those projects receiving new time entries; existing entries remain visible.

**Related:** EPIC-003, AC-017, AC-018

### US-008 · draft · source: requirements:US-008

High. A System Admin creates and edits projects under a client, each with a non-negative hourly bill rate. The rate is held for reporting only; there is no invoicing or payment function.

Acceptance criteria:
- AC-019: A project with a name and a non-negative hourly rate is saved under its client.
- AC-020: A negative or non-numeric rate is rejected with a validation message.
- AC-021: Changing the rate stores the new rate and leaves existing time entries unchanged and undeleted.
- AC-022: No invoice or payment function is offered on any screen in this release.

Note: AC-038 refers to a 'default for its project' billable setting. This story does not define such a project field.

**Related:** EPIC-003, AC-019, AC-020, AC-021, AC-022, US-014

### US-009 · draft · source: requirements:US-009

High. A System Admin creates, edits and archives tasks under a project. Archived tasks are hidden from new entries but still shown on existing entries.

Acceptance criteria:
- AC-023: A task added with a name becomes selectable on that project.
- AC-024: Archived tasks are not offered for new entries, but existing entries using them still display them.

**Related:** EPIC-003, AC-023, AC-024

### US-010 · draft · source: requirements:US-010

Critical. An employee clocks in from the browser after choosing a project, task and billable status, then clocks out. The duration, net of breaks, appears on that day of their timesheet. Clocking in twice is refused.

Epic: EPIC-004. Times are stored in UTC and shown in the user's time zone. Labour-rule flagging is out of scope.

Acceptance criteria:
- AC-025: After selecting a project, task and billable/non-billable and clocking in, a running entry starts at the current time and is shown as in progress.
- AC-026: Clocking out closes the entry with an end time; its duration, net of breaks, appears on that day of the timesheet.
- AC-027: A second clock-in while already clocked in is refused with a message.

**Related:** EPIC-004, AC-025, AC-026, AC-027, US-013, US-014, US-017

### US-011 · draft · source: requirements:US-011

High. Employees start and end breaks during a running entry. Break time is subtracted from worked time. Breaks are recorded but not checked against labour rules.

Acceptance criteria:
- AC-028: A started and ended break is recorded with start and end times and subtracted from the worked duration.
- AC-029: Clocking out while on a break ends the break at clock-out time and closes the entry.
- AC-030: Starting a second break while already on a break is refused.

**Related:** EPIC-004, AC-028, AC-029, AC-030, US-010

### US-012 · draft · source: requirements:US-012

Medium. If an entry has been left running since an earlier day, the employee is alerted on the clock page and can set the correct end time. End times before the start time are rejected.

Acceptance criteria:
- AC-031: For an entry running since an earlier day, the employee is alerted on the clock page when they next open the app and can set the correct end time.
- AC-032: An end time earlier than the start time is rejected with a validation message.

**Related:** EPIC-004, AC-031, AC-032, US-010

### US-013 · draft · source: requirements:US-013

Critical. Employees enter hours per day in a Monday-to-Sunday weekly timesheet, by project and task. Clocked entries appear alongside manual ones. Submission and approval are not in this version.

Epic: EPIC-005. Timesheets remain editable by their owner in this version.

Acceptance criteria:
- AC-033: Adding a row with a project and task and entering hours on one or more days saves the hours and updates daily and weekly totals.
- AC-034: Hours that are negative, non-numeric or above 24 for a day are rejected with a validation message.
- AC-035: The week runs Monday to Sunday.
- AC-036: Clocked entries appear on the correct days alongside manually entered hours.

**Related:** EPIC-005, AC-033, AC-034, AC-035, AC-036, US-010

### US-014 · draft · source: requirements:US-014

High. Each time entry is marked billable or non-billable. If no choice is made, the entry takes the project default, or billable if there is none.

Acceptance criteria:
- AC-037: The billable/non-billable choice is saved with the entry on create or edit.
- AC-038: With no choice made, the entry takes its project's default, or billable if none is set; the value is visible before saving.

Gap: no story defines how a project-level billable default is configured.

**Related:** EPIC-005, AC-037, AC-038, US-008

### US-015 · draft · source: requirements:US-015

High. Employees edit or delete their own entries, and totals recalculate. Edits or deletions of other people's entries are denied via both UI and API.

Acceptance criteria:
- AC-039: Changing an own entry's day, hours, project, task or billable flag updates the entry and recalculates totals.
- AC-040: Confirming deletion removes the entry from the timesheet and totals.
- AC-041: An Employee's attempt to edit or delete another employee's entry via UI or API is denied.

**Related:** EPIC-005, AC-039, AC-040, AC-041, US-002

### US-016 · draft · source: requirements:US-016

Medium. The employee dashboard shows the current week's total hours, hours per day and the billable/non-billable split. When there are no entries, it shows zero with links to record time.

Acceptance criteria:
- AC-042: The dashboard shows weekly total, hours per day and the billable vs non-billable split.
- AC-043: With no entries this week, it shows zero hours with a link to the clock and the timesheet.
- AC-044: Figures reflect entries recorded or deleted when the employee returns to the dashboard.

**Related:** EPIC-006, AC-042, AC-043, AC-044

### US-017 · draft · source: requirements:US-017

High. Times are stored in UTC and displayed in the user's profile time zone. Durations stay correct across daylight-saving changes.

Acceptance criteria:
- AC-045: A user in Europe/London who clocks in at 09:00 local time gets a UTC timestamp stored, and the entry displays as 09:00 local.
- AC-046: Entries spanning a daylight-saving change show correct durations and local times.

Related: AC-056 (the team view uses the direct report's time zone).

**Related:** EPIC-007, AC-045, AC-046, US-021

### US-018 · draft · source: requirements:US-018

Medium. The interface is English-only and responsive. The clock, timesheet and dashboard must work on phone browsers without horizontal scrolling. There is no native app.

Acceptance criteria:
- AC-047: At phone-typical width, the clock, timesheet and dashboard are usable without horizontal scrolling, and controls are tappable.
- AC-048: All labels and messages are in English.

**Related:** EPIC-007, AC-047, AC-048

### US-019 · draft · source: requirements:US-019

Medium. The app needs an in-app user guide, an admin guide, a Manager section on the My team view, and developer/operator project documentation. CHG-001 extended the admin and Manager content.

Acceptance criteria:
- AC-049: From the help link, any signed-in user can read a guide covering:
  - Clocking in and out
  - Breaks
  - The weekly timesheet
  - Editing entries
  - The dashboard
- AC-050: The admin guide covers:
  - Creating users and assigning managers
  - Setting up clients, projects, tasks and bill rates
  - That assigning a manager grants that manager read-only access to the user's timesheets in My team
  - That reassigning the user moves that access to the new manager
  - That deactivating the user, or changing the manager's role away from Manager, removes it
- AC-065: The Manager help section on My team explains:
  - Only Managers can see it
  - It lists only their active direct reports
  - It is read-only (no adding, editing or deleting entries)
  - Times are shown in the report's own time zone
  - No other role has team access
- AC-051: The project documentation for developers and operators describes:
  - The stack
  - Setup
  - Configuration, including the email service API key
  - The EU/UK hosting region

**Related:** EPIC-008, AC-049, AC-050, AC-065, AC-051, REQ-SERVICES, EPIC-009

### US-020 · draft · source: requirements:US-020

High. A Manager's My team view lists only the active users whose Manager field is set to them, with name and time zone. If there are none, an empty state is shown.

Acceptance criteria:
- AC-052: Active users whose Manager field is set to that Manager are listed with name and time zone; no other users are listed.
- AC-053: Deactivated direct reports are not listed.
- AC-054: With no active direct reports, an empty state says the Manager has no direct reports.

**Related:** EPIC-009, CHG-001, AC-052, AC-053, AC-054, US-005

### US-021 · draft · source: requirements:US-021

High. A Manager views a direct report's Monday-to-Sunday timesheet read-only, with times in the report's labelled time zone. No edit controls are shown, and any change request returns 403.

Acceptance criteria:
- AC-055: The selected report's week runs Monday to Sunday and shows:
  - The timesheet grid
  - The entries list
  - Daily and weekly totals
  - The billable/non-billable split
- AC-056: When time zones differ, entry times and day boundaries use the report's time zone, and that time zone is labelled on the view.
- AC-057: No controls are offered to add, edit or delete entries or breaks, or to change clock state.
- AC-058: Any UI or API request by a Manager to create, edit or delete another user's entries or breaks, or to clock them in or out, gets 403 with no data changed.

**Related:** EPIC-009, CHG-001, AC-055, AC-056, AC-057, AC-058, US-017, US-013

### US-022 · draft · source: requirements:US-022

Critical. Team access is granted only by the recorded reporting line and is enforced on the server for every request. Access is re-evaluated on each request after reassignment, deactivation or role change.

Acceptance criteria:
- AC-059: A Manager requesting team endpoints for a user not assigned to them gets 403 with no data.
- AC-060: Employee, Payroll Admin and System Admin roles get 403 on any team endpoint.
- AC-061: After an employee is reassigned from Manager A to Manager B, A gets 403 for that employee and B can list and view them.
- AC-062: Access follows the current state:
  - A deactivated report is no longer listed or viewable.
  - A Manager whose role changes away from Manager, or whose account is deactivated, gets 403.
- AC-063: After release, Employees can still only see and change their own time entries.

**Related:** EPIC-009, CHG-001, AC-059, AC-060, AC-061, AC-062, AC-063, AC-064, US-002, US-005, US-006
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v2  
**Delivery scope:** lightweight  
**Approved:** 2026-11-09

**Capabilities in scope:** Email and password sign-in, User accounts created by admins, Client, project and task setup, Hourly bill rate per project, Clock in and out with breaks, Weekly timesheet entry by day, Billable and non-billable marking per entry, Employee dashboard of weekly hours, Editing and deleting own time entries, Basic user and project documentation, Times stored in UTC and shown in the user's time zone, Week starts on Monday, English-only interface, Bill rate used for reporting only, no invoicing, Initial data entered manually, no SSO or HR-system sync

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | The analyst assumed a Node.js API, but Node is not an available option on this platform, so FastAPI (Python) is the closest available choice. It gives you the same kind of REST API. It has strict request validation, which suits timesheets, leave and rate data. It also generates interactive API documentation automatically, which helps with the read-only payroll API you want a future payroll connector to use. 500 users is well within its capacity. |
| cloud | AWS | You need data hosted in the EU or UK. AWS offers Ireland, Frankfurt, Paris and London regions, so personal and health-related data can stay in region. Managed PostgreSQL, encrypted backups and email sending are all available in those regions, which suits a company with up to 500 users and no hard deadline. |
| database | PostgreSQL | Your data is relational: employees, managers, clients, projects, tasks, timesheets, leave balances and approvals. Reports such as hours by employee, project and week, and billable versus non-billable, are database queries. Transactions let an approved sheet be locked and audited reliably. It stores times in UTC, and you can restrict access to sick-leave rows. It matches the assumed stack. |
| frontend | React | Employees clock in and out, fill weekly timesheets and use it on phones through a responsive browser app, since you ruled out a native app. Managers and admins also need approval queues, tables and reports. React with TypeScript fits all of that and matches the stack already assumed. It also handles the Monday-morning submission peak well, because the work happens in each user's browser. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Sign-in and account access

Email-and-password sign-in with role-restricted access for Employee, Manager, Payroll Admin and System Admin. Assumption (open): stack is React/TypeScript, Node.js REST API and PostgreSQL; auth uses hashed passwords, session cookies and password reset by email. Password reset needs an email service API key, which has not yet been supplied. Assumption: personal data is hosted in an EU/UK region. SSO is not included. Scope note: approval, leave, labour-rule flags, reports, payroll export/API, notifications and audit log were discussed but are outside the Lightweight MVP delivery scope and are not drafted in this version.

### US-001: Sign in with email and password

**Priority:** critical

> As a user with an account, I want to sign in with my email and password, so that I can access the application securely.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | an active account exists with a known email and password | the user submits the correct credentials on the sign-in page | a session is started and the user lands on the home page for their role |
| AC-002 | an account exists | the user submits an incorrect password or an unknown email | sign-in is refused with a generic error that does not reveal whether the email exists |
| AC-003 | a user has signed in | the user chooses to sign out | the session ends and protected pages require signing in again |

### US-002: Role-restricted access

**Priority:** high

> As a System Admin, I want each user to have exactly one of the roles Employee, Manager, Payroll Admin or System Admin and for access to be restricted by role, so that personal data and admin functions are only available to those who need them.

| ID | Given | When | Then |
|---|---|---|---|
| AC-004 | a user with the Employee role is signed in | they try to open an admin page or request admin data via the API | access is denied and no admin data is returned |
| AC-005 | an Employee is signed in | they view time data | they can only see and change their own time entries |
| AC-006 | a System Admin is signed in | they open user administration | they can view and change user accounts and roles |
| AC-064 | a signed-in user requests another user's personal time data (time entries, breaks, timesheets) via the UI or API | the server handles the request | the server checks ownership or the recorded reporting line before returning anything: a Manager can read, but never create, edit or delete, the time data of users whose Manager field is set to them, and every other request for another user's time data, and every change request by a Manager, is refused with 403 with no data returned or changed |

### US-003: Reset a forgotten password

**Priority:** medium

> As a user who has forgotten my password, I want to request a password reset by email, so that I can regain access without contacting an admin.

| ID | Given | When | Then |
|---|---|---|---|
| AC-007 | an active account exists and the email service is configured | the user requests a reset for their email address | a single-use, time-limited reset link is emailed to that address |
| AC-008 | a valid reset link | the user sets a new password that meets the password rules | the password is updated, the link can no longer be used and the user can sign in with the new password |
| AC-009 | an email address that has no account | a reset is requested | the same confirmation message is shown and no email is sent |

## EPIC-002: User account administration

Admins create and manage users manually and assign each employee a manager. Assumption: initial data is entered manually in this scope; CSV import, SSO and HR-system sync are not included.

### US-004: Create a user account

**Priority:** critical

> As a System Admin, I want to create a user with name, unique email, role and time zone, so that people can sign in and record time.

| ID | Given | When | Then |
|---|---|---|---|
| AC-010 | the System Admin is on the new-user form | they submit valid details with an email not already in use | the account is created and the user can set a password and sign in |
| AC-011 | an account already exists with the email | the admin submits the form with the same email | creation is rejected with a clear duplicate-email message |
| AC-012 | the form has a missing required field | it is submitted | the form shows which field is missing and no account is created |

### US-005: Assign a manager to an employee

**Priority:** high

> As a System Admin, I want to assign a manager to each employee, so that the reporting line is recorded for later approval features.

| ID | Given | When | Then |
|---|---|---|---|
| AC-013 | an employee and a user with the Manager role exist | the admin assigns that manager to the employee | the employee's record shows the manager |
| AC-014 | a user who is not a Manager | the admin tries to assign them as a manager | the assignment is refused |

### US-006: Edit and deactivate users

**Priority:** medium

> As a System Admin, I want to edit user details and deactivate a user, so that the user list stays correct when people change role or leave.

| ID | Given | When | Then |
|---|---|---|---|
| AC-015 | an existing user | the admin changes their name, role, manager or time zone and saves | the changes are stored and apply from the user's next request |
| AC-016 | an active user | the admin deactivates them | they can no longer sign in, their existing time entries are kept, and they cannot be selected as a new manager |

## EPIC-003: Clients, projects, tasks and bill rate

Admins set up the structure to which time is charged. Assumption: the hourly bill rate is stored per project for reporting only; there is no invoicing, payments or payroll calculation in this product.

### US-007: Manage clients

**Priority:** high

> As a System Admin, I want to create, edit and archive clients, so that projects can be grouped under the right client.

| ID | Given | When | Then |
|---|---|---|---|
| AC-017 | the admin is on the clients page | they create a client with a unique name | the client appears in the client list |
| AC-018 | a client with projects | the admin archives the client | its projects can no longer receive new time entries, while existing entries remain visible |

### US-008: Manage projects with an hourly bill rate

**Priority:** high

> As a System Admin, I want to create and edit projects under a client and set an hourly bill rate per project, so that time can be charged to projects and the rate is held for reporting.

| ID | Given | When | Then |
|---|---|---|---|
| AC-019 | a client exists | the admin creates a project with a name and a non-negative hourly bill rate | the project is saved under that client with the rate |
| AC-020 | the admin enters a negative or non-numeric bill rate | they save | the save is rejected with a validation message |
| AC-021 | a project with recorded time | the admin changes its bill rate | the new rate is stored and existing time entries are not deleted or altered |
| AC-022 | any screen in this release | a project is displayed | no invoice or payment function is offered |

### US-009: Manage tasks within a project

**Priority:** high

> As a System Admin, I want to create, edit and archive tasks under a project, so that employees can charge time to a specific task.

| ID | Given | When | Then |
|---|---|---|---|
| AC-023 | a project exists | the admin adds a task with a name | the task is available for selection on that project |
| AC-024 | an archived task | an employee creates a new time entry | the archived task is not offered, but existing entries that use it still display it |

## EPIC-004: Clock in and out with breaks

Employees record time live in the browser. Assumption: times are stored in UTC and shown in the user's time zone. Labour-rule flagging (overtime, minimum break) is outside this scope, so breaks are recorded but not checked.

### US-010: Clock in and out against a project and task

**Priority:** critical

> As a Employee, I want to clock in and out in the browser, choosing a project, task and billable status, so that my working time is recorded without manual calculation.

| ID | Given | When | Then |
|---|---|---|---|
| AC-025 | an employee who is not clocked in | they select a project and task, set billable or non-billable, and clock in | a running entry starts with the current time and is shown as in progress |
| AC-026 | an employee with a running entry | they clock out | the entry is closed with an end time and its duration, net of breaks, appears in that day of their timesheet |
| AC-027 | an employee already clocked in | they try to clock in again | the second clock-in is refused with a message |

### US-011: Record breaks while clocked in

**Priority:** high

> As a Employee, I want to start and end breaks during a running entry, so that break time is excluded from my worked hours.

| ID | Given | When | Then |
|---|---|---|---|
| AC-028 | an employee with a running entry | they start a break and later end it | the break is recorded with start and end times and subtracted from the entry's worked duration |
| AC-029 | an employee is on a break | they clock out | the break ends at the clock-out time and the entry is closed |
| AC-030 | an employee on a break | they try to start another break | the request is refused |

### US-012: Recover an entry left running

**Priority:** medium

> As a Employee, I want to correct an entry I forgot to clock out of, so that my hours are accurate.

| ID | Given | When | Then |
|---|---|---|---|
| AC-031 | an entry has been running since an earlier day | the employee next opens the app | they are alerted on the clock page and can set the correct end time |
| AC-032 | the employee enters an end time earlier than the start time | they save | the save is rejected with a validation message |

## EPIC-005: Weekly timesheet entry

Employees fill a weekly timesheet by day as an alternative to the clock. Each entry is charged to a project and task and marked billable or non-billable. Submission, manager approval and locking are outside the Lightweight MVP scope, so timesheets stay editable by their owner in this version.

### US-013: Enter hours by day in a weekly timesheet

**Priority:** critical

> As a Employee, I want to enter hours per day for a week, per project and task, so that I can record time without using the clock.

| ID | Given | When | Then |
|---|---|---|---|
| AC-033 | the employee opens a week | they add a row with a project and task and enter hours for one or more days | the hours are saved against those days and daily and weekly totals are updated |
| AC-034 | an employee enters hours that are negative, non-numeric or above 24 for a day | they save | the entry is rejected with a validation message |
| AC-035 | the week view is open | it is displayed | the week runs Monday to Sunday |
| AC-036 | the employee has clocked entries in the week | they open the timesheet | those entries appear on the correct days alongside manually entered hours |

### US-014: Mark entries billable or non-billable

**Priority:** high

> As a Employee, I want to mark each time entry as billable or non-billable, so that the type of work is recorded for later reporting.

| ID | Given | When | Then |
|---|---|---|---|
| AC-037 | the employee is creating or editing an entry | they choose billable or non-billable | the choice is saved with the entry |
| AC-038 | a new entry | no choice is made | the entry takes the default for its project, or billable if none is set, and the value is visible before saving |

### US-015: Edit and delete my own time entries

**Priority:** high

> As a Employee, I want to edit or delete my own time entries, so that I can fix mistakes.

| ID | Given | When | Then |
|---|---|---|---|
| AC-039 | an entry belonging to the employee | they change its day, hours, project, task or billable flag and save | the entry is updated and totals recalculate |
| AC-040 | an entry belonging to the employee | they confirm deletion | the entry is removed from their timesheet and totals |
| AC-041 | an entry belonging to another employee | an Employee tries to edit or delete it via the UI or API | the request is denied |

## EPIC-006: Employee dashboard

A simple home view of the employee's own weekly hours.

### US-016: See my weekly hours on a dashboard

**Priority:** medium

> As a Employee, I want a dashboard showing my hours for the current week, so that I can see how much I have recorded at a glance.

| ID | Given | When | Then |
|---|---|---|---|
| AC-042 | an employee has entries in the current week | they open the dashboard | it shows total hours for the week, hours per day and the split between billable and non-billable |
| AC-043 | an employee has no entries this week | they open the dashboard | zero hours are shown with a link to the clock and timesheet |
| AC-044 | the employee records or deletes an entry | they return to the dashboard | the figures reflect the change |

## EPIC-007: Time zone, week start, language and responsive layout

Cross-cutting display rules. Assumptions: times stored in UTC and displayed in the user's time zone; the week starts on Monday (configuration of the start day is not included in this scope); the interface is English only; the web app is responsive in the browser. A native mobile app is out of scope.

### US-017: Times stored in UTC and shown in my time zone

**Priority:** high

> As a Employee, I want times to display in my own time zone, so that entries match my local day.

| ID | Given | When | Then |
|---|---|---|---|
| AC-045 | an employee whose profile time zone is Europe/London | they clock in at 09:00 local time | the stored timestamp is in UTC and the entry displays as 09:00 in their time zone |
| AC-046 | the clocked time spans a daylight-saving change | the entry is displayed | the duration and local times are correct |

### US-018: English-only, responsive interface

**Priority:** medium

> As a Employee, I want an English interface that works on a phone browser as well as a desktop, so that I can record time without a native app.

| ID | Given | When | Then |
|---|---|---|---|
| AC-047 | a screen width typical of a phone | the user opens the clock, timesheet or dashboard | the content is usable without horizontal scrolling and controls are tappable |
| AC-048 | any user | they use the app | all labels and messages are in English |

## EPIC-008: Basic user and project documentation

Short documentation so users and admins can use and set up the product.

### US-019: User and admin guides

**Priority:** medium

> As a new user or admin, I want basic documentation for daily use and for setup, so that I can use the app without separate training.

| ID | Given | When | Then |
|---|---|---|---|
| AC-049 | a signed-in user | they open the help link | they can read a guide covering clocking in and out, breaks, the weekly timesheet, editing entries and the dashboard |
| AC-050 | a System Admin | they open the admin guide | it covers creating users, assigning managers and setting up clients, projects, tasks and bill rates, and explains that assigning a manager to a user is what grants that manager read-only access to the user's timesheets in the My team view, that reassigning the user moves that access to the new manager, and that deactivating the user or changing the manager's role away from Manager removes it |
| AC-065 | a signed-in Manager | they open the help link | they can read a section of the user guide on the My team view explaining that only Managers can see it, that it lists only their active direct reports, that it is read-only so entries cannot be added, edited or deleted from it, that times are shown in the direct report's own time zone, and that no other role has team access |
| AC-051 | a developer or operator | they open the project documentation | it describes the stack, setup, configuration including the email service API key, and the EU/UK hosting region |

## EPIC-009: Manager team view (read-only)

From change request CHG-001 (major, new version). A Manager can see the timesheets of their direct reports in a read-only "My team" view. Access is granted only by the recorded reporting line (the employee's Manager field) and is checked on the server for every request. Times are shown in the employee's own time zone and the week runs Monday to Sunday. Out of scope: approving or locking timesheets, reports, exports, notifications, indirect (skip-level) reports, and any team access for Payroll Admin or System Admin.

### US-020: List my direct reports

**Priority:** high

> As a Manager, I want to see a list of the people who report directly to me, so that I can choose whose timesheet to look at.

| ID | Given | When | Then |
|---|---|---|---|
| AC-052 | a Manager is signed in and active users exist whose Manager field is set to that Manager | they open the My team view | those users are listed with their name and time zone, and no other users are listed |
| AC-053 | one of the Manager's direct reports has been deactivated | the Manager opens the My team view | the deactivated user is not listed |
| AC-054 | a Manager has no active direct reports | they open the My team view | an empty state is shown saying they have no direct reports |

### US-021: View a direct report's weekly timesheet (read-only)

**Priority:** high

> As a Manager, I want to view a direct report's weekly timesheet and entries without being able to change them, so that I can see what my team has recorded.

| ID | Given | When | Then |
|---|---|---|---|
| AC-055 | a Manager has selected a direct report and a week | the timesheet is displayed | the week runs Monday to Sunday and shows that person's timesheet grid, entries list, daily and weekly totals, and the billable / non-billable split |
| AC-056 | the direct report's profile time zone differs from the Manager's | the Manager views that person's week | entry times and day boundaries are shown in the direct report's time zone, and that time zone is labelled on the view |
| AC-057 | a Manager is viewing a direct report's timesheet | the view is displayed | no controls to add, edit or delete entries or breaks, or to change clock state, are offered |
| AC-058 | a Manager is signed in | they send any request via the UI or API to create, edit or delete another user's time entries or breaks, or to clock them in or out | the server responds 403 and no data is changed |

### US-022: Team access restricted to the reporting line

**Priority:** critical

> As a System Admin, I want team timesheet access to be granted only by the recorded reporting line and enforced on the server, so that personal time data is only visible to the person's own manager.

| ID | Given | When | Then |
|---|---|---|---|
| AC-059 | a Manager is signed in | they request the team endpoints for a user whose Manager field is not set to them | the server responds 403 and no data about that user is returned |
| AC-060 | a user with the Employee, Payroll Admin or System Admin role is signed in | they call any team endpoint | the server responds 403 and no team data is returned |
| AC-061 | an employee is reassigned from Manager A to Manager B | each manager makes their next team request | Manager A is refused with 403 for that employee and Manager B can list and view them |
| AC-062 | a direct report is deactivated, or the Manager's own role is changed away from Manager or their account is deactivated | the next team request is made | access is decided by the new state: the deactivated report is no longer listed or viewable, and a former Manager is refused with 403 |
| AC-063 | an Employee is signed in after this feature is released | they view or change time data | they can still only see and change their own time entries |
<!-- sdlc:auto:end epics -->
