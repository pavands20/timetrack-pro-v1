# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-SCOPE · draft · source: requirements:v1

Requirements version 1 uses a Lightweight delivery scope. It covers sign-in, user administration, clients, projects and tasks, clock in and out, the weekly timesheet, the dashboard, display rules and documentation. Several features from the project description are deferred.

- Requirements version: 1
- Delivery scope: lightweight
- Capabilities in scope:
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
  - Bill rate used for reporting only, with no invoicing
  - Initial data entered manually, with no SSO or HR-system sync
- Out of scope:
  - Native mobile app (the web app is responsive in the browser instead)
  - Invoicing and payroll calculation (the app only exports approved hours)
- Discussed but deferred from the Lightweight MVP (per the EPIC-001 scope note):
  - Timesheet approval
  - Leave
  - Labour-rule flags
  - Reports
  - Payroll export and API
  - Notifications
  - Audit log
- Conflict recorded:
  - The project description includes timesheet approval, time off, labour rules, reports, CSV and payroll export, notifications and audit.
  - The v1 requirements exclude these from the Lightweight scope.
  - The description's 'only exports approved hours' implies approval and export, but neither is drafted in v1.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, EPIC-007, EPIC-008

### REQ-STACK · approved · source: requirements:technology-stack

The product owner approved the technology stack: FastAPI 0.115, AWS, PostgreSQL 16 and React 19. Designs must use exactly these technologies.

- Backend: FastAPI 0.115 (Python)
  - Replaces the analyst's assumed Node.js API, because Node is not available on the platform.
  - Reasons given: strict request validation; automatic interactive API docs, useful for a future payroll connector; handles 500 users comfortably.
- Cloud: AWS
  - EU/UK regions available: Ireland, Frankfurt, Paris and London.
  - Managed PostgreSQL, encrypted backups and email sending are available in-region.
- Database: PostgreSQL 16
  - Reasons given: relational data; reports as queries; transactions for locking and audit; UTC times; access to sick-leave rows can be restricted.
- Frontend: React 19 with TypeScript
  - Reasons given: responsive browser app for phones; approval queues, tables and reports; handles the Monday submission peak.
- Conflict recorded:
  - EPIC-001 still lists the assumption 'React/TypeScript, Node.js REST API and PostgreSQL'.
  - The approved stack replaces Node.js with FastAPI.

**Related:** EPIC-001, NFR-006, NFR-015

### REQ-SERVICES · approved · source: requirements:services

The product owner approved an SMTP email service for password-reset emails. Email is sent through Amazon SES in an EU region.

- Service: Email via SMTP server (SaaS)
- Environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
- Purpose: password-reset emails
- Provider: Amazon SES in an EU region, so email handling stays in the EU
- API keys this app needs: SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USER
- Conflict recorded:
  - EPIC-001 states the email service API key 'has not yet been supplied'.
  - The services list names the required keys but does not confirm the values are supplied.

**Related:** US-003, NFR-006, NFR-016

### US-001 · draft · source: requirements:US-001

Priority: critical. Users sign in with email and password and land on the home page for their role. Users can sign out.

Epic: EPIC-001 Sign-in and account access
- AC-001: Correct credentials start a session, and the user lands on their role's home page.
- AC-002: A wrong password or unknown email is refused with a generic error that does not reveal whether the email exists.
- AC-003: Signing out ends the session, and protected pages require signing in again.
- Epic assumptions:
  - Hashed passwords, session cookies and password reset by email.
  - EU/UK hosting.
  - No SSO.

**Related:** EPIC-001, NFR-001, NFR-002

### US-002 · draft · source: requirements:US-002

Priority: high. Each user has exactly one role: Employee, Manager, Payroll Admin or System Admin. Access is restricted by role.

Epic: EPIC-001
- AC-004: An Employee is denied admin pages and admin API data, and no admin data is returned.
- AC-005: An Employee can see and change only their own time entries.
- AC-006: A System Admin can view and change user accounts and roles.

**Related:** EPIC-001, NFR-003, NFR-007

### US-003 · draft · source: requirements:US-003

Priority: medium. A user who forgot their password requests a reset link by email.

Epic: EPIC-001
- AC-007: For an active account, with the email service configured, a single-use, time-limited reset link is emailed.
- AC-008: A valid link plus a compliant new password updates the password. The link is then invalid, and the user can sign in with the new password.
- AC-009: An unknown email shows the same confirmation message, and no email is sent.
- Dependency: the email service API key (see REQ-SERVICES).

**Related:** EPIC-001, NFR-002, NFR-004, REQ-SERVICES

### US-004 · draft · source: requirements:US-004

Priority: critical. A System Admin creates a user with name, unique email, role and time zone.

Epic: EPIC-002 User account administration. Initial data is entered manually; no CSV import, SSO or HR sync.
- AC-010: Valid details with an unused email create the account. The user can then set a password and sign in.
- AC-011: A duplicate email is rejected with a clear duplicate-email message.
- AC-012: A missing required field is identified on the form, and no account is created.

**Related:** EPIC-002, NFR-013

### US-005 · draft · source: requirements:US-005

Priority: high. A System Admin assigns a manager to each employee, recording the reporting line for later approval features.

Epic: EPIC-002
- AC-013: Assigning a Manager-role user to an employee shows that manager on the employee's record.
- AC-014: Assigning a user who is not a Manager is refused.

**Related:** EPIC-002, NFR-003

### US-006 · draft · source: requirements:US-006

Priority: medium. A System Admin edits user details and deactivates users.

Epic: EPIC-002
- AC-015: Changes to name, role, manager or time zone are stored and apply from the user's next request.
- AC-016: A deactivated user cannot sign in. Their time entries are kept, and they cannot be selected as a new manager.

**Related:** EPIC-002, NFR-005, NFR-014

### US-007 · draft · source: requirements:US-007

Priority: high. A System Admin creates, edits and archives clients.

Epic: EPIC-003 Clients, projects, tasks and bill rate. The rate is for reporting only, with no invoicing, payments or payroll calculation.
- AC-017: A client created with a unique name appears in the client list.
- AC-018: Archiving a client blocks new time entries on its projects. Existing entries remain visible.

**Related:** EPIC-003, NFR-014

### US-008 · draft · source: requirements:US-008

Priority: high. A System Admin creates and edits projects under a client, each with an hourly bill rate.

Epic: EPIC-003
- AC-019: A project with a name and a non-negative rate is saved under its client.
- AC-020: A negative or non-numeric rate is rejected with a validation message.
- AC-021: Changing the rate stores the new value. Existing entries are not deleted or altered.
- AC-022: No screen offers invoice or payment functions.

**Related:** EPIC-003, NFR-013, NFR-014, NFR-017

### US-009 · draft · source: requirements:US-009

Priority: high. A System Admin creates, edits and archives tasks under a project.

Epic: EPIC-003
- AC-023: A task added with a name becomes selectable on that project.
- AC-024: Archived tasks are not offered for new entries, but existing entries still display them.

**Related:** EPIC-003, NFR-014

### US-010 · draft · source: requirements:US-010

Priority: critical. An employee clocks in and out in the browser, choosing a project, task and billable status.

Epic: EPIC-004 Clock in and out with breaks. Times are stored in UTC and shown in the user's time zone. Breaks are recorded but not checked against labour rules (out of scope).
- AC-025: Selecting a project, task and billable status and clocking in starts a running entry shown as in progress.
- AC-026: Clocking out closes the entry. Its duration, net of breaks, appears on that day of the timesheet.
- AC-027: A second clock-in while already clocked in is refused with a message.

**Related:** EPIC-004, NFR-009, NFR-012

### US-011 · draft · source: requirements:US-011

Priority: high. An employee starts and ends breaks during a running entry, and break time is excluded from worked hours.

Epic: EPIC-004
- AC-028: The break's start and end times are recorded and subtracted from the worked duration.
- AC-029: Clocking out during a break ends the break at the clock-out time.
- AC-030: Starting another break while already on a break is refused.

**Related:** EPIC-004

### US-012 · draft · source: requirements:US-012

Priority: medium. An employee corrects an entry they forgot to clock out of.

Epic: EPIC-004
- AC-031: An entry left running from an earlier day triggers an alert on the clock page, and the employee can set the correct end time.
- AC-032: An end time before the start time is rejected with a validation message.

**Related:** EPIC-004, NFR-013

### US-013 · draft · source: requirements:US-013

Priority: critical. An employee enters hours per day for a week, with a row per project and task.

Epic: EPIC-005 Weekly timesheet entry. Submission, approval and locking are out of Lightweight scope, so timesheets stay editable by their owner.
- AC-033: Adding a row with a project, task and daily hours saves the hours and updates daily and weekly totals.
- AC-034: Hours that are negative, non-numeric or above 24 are rejected with a validation message.
- AC-035: The week runs Monday to Sunday.
- AC-036: Clocked entries appear on the correct days alongside manually entered hours.

**Related:** EPIC-005, NFR-009, NFR-010, NFR-012, NFR-013

### US-014 · draft · source: requirements:US-014

Priority: high. Each time entry is marked billable or non-billable.

Epic: EPIC-005
- AC-037: The billable or non-billable choice is saved with the entry.
- AC-038: With no choice made, the entry uses the project default, or billable if none is set. The value is visible before saving.

**Related:** EPIC-005

### US-015 · draft · source: requirements:US-015

Priority: high. Employees edit or delete their own time entries, but not anyone else's.

Epic: EPIC-005
- AC-039: Changing the day, hours, project, task or billable flag updates the entry, and totals recalculate.
- AC-040: A confirmed delete removes the entry from the timesheet and totals.
- AC-041: Editing or deleting another employee's entry, via the UI or API, is denied.

**Related:** EPIC-005, NFR-003

### US-016 · draft · source: requirements:US-016

Priority: medium. A dashboard shows the employee's hours for the current week.

Epic: EPIC-006 Employee dashboard
- AC-042: The dashboard shows weekly total, hours per day and the billable versus non-billable split.
- AC-043: With no entries this week, it shows zero hours and links to the clock and timesheet.
- AC-044: Figures reflect entries recorded or deleted since the last visit.

**Related:** EPIC-006, NFR-010, NFR-012

### US-017 · draft · source: requirements:US-017

Priority: high. Times are stored in UTC and displayed in the user's own time zone.

Epic: EPIC-007 Time zone, week start, language and responsive layout
- AC-045: For a Europe/London user, clocking in at 09:00 local time stores a UTC timestamp and displays 09:00.
- AC-046: Durations and local times are correct across daylight-saving changes.

**Related:** EPIC-007, NFR-009

### US-018 · draft · source: requirements:US-018

Priority: medium. The interface is English-only and works on phone browsers as well as desktop.

Epic: EPIC-007. A native mobile app is out of scope.
- AC-047: At phone screen widths, the clock, timesheet and dashboard need no horizontal scrolling, and controls are tappable.
- AC-048: All labels and messages are in English.

**Related:** EPIC-007, NFR-011, NFR-012

### US-019 · draft · source: requirements:US-019

Priority: medium. Basic user, admin and project documentation is provided.

Epic: EPIC-008 Basic user and project documentation
- AC-049: The help link opens a user guide covering clocking in and out, breaks, the weekly timesheet, editing entries and the dashboard.
- AC-050: The admin guide covers creating users, assigning managers, and setting up clients, projects, tasks and bill rates.
- AC-051: Project documentation covers the stack, setup, configuration (including the email service API key) and the EU/UK hosting region.

**Related:** EPIC-008, NFR-016, REQ-SERVICES

### NFR-001 · draft · source: requirements:NFR-001

Security: passwords are stored safely and sessions use secure cookies.

- Passwords are stored only as hashed values.
- Sessions use secure cookies that browser scripts cannot read.
- Signing out ends the session.
- Applies to: US-001

**Related:** US-001

### NFR-002 · draft · source: requirements:NFR-002

Security: sign-in and reset messages reveal nothing about which accounts exist.

- Failed sign-ins show the same generic error whether the password is wrong or the email is unknown.
- Reset requests show the same confirmation whether or not an account exists.
- Applies to: US-001, US-003

**Related:** US-001, US-003

### NFR-003 · draft · source: requirements:NFR-003

Security: role-based access is enforced on the server.

- Access is checked on the server for every page and every API request, not only hidden in the UI.
- Employees never receive admin data and see or change only their own entries.
- Applies to: US-002, US-005, US-015

**Related:** US-002, US-005, US-015

### NFR-004 · draft · source: requirements:NFR-004

Security: password reset links are single-use and time-limited.

- A link works once and expires after a limited time.
- New passwords must meet the password rules.
- The link stops working once the password is changed.
- Applies to: US-003

**Related:** US-003

### NFR-005 · draft · source: requirements:NFR-005

Security: deactivated users lose access immediately.

- A deactivated user cannot sign in.
- Admin changes to a user's details or role apply from that user's next request.
- Applies to: US-006

**Related:** US-006

### NFR-006 · draft · source: requirements:NFR-006

Privacy: all personal data is hosted in an EU or UK region.

- Covers employee identities, working hours and any health-related data.
- Password-reset email is also handled in an EU region.
- Applies to: whole system

**Related:** REQ-STACK, REQ-SERVICES

### NFR-007 · draft · source: requirements:NFR-007

Compliance: the product must comply with GDPR and UK GDPR.

- Employees work only in the EU and UK.
- Access to personal data is limited by role.
- Applies to: whole system
- Note: compliance traceability is for human confirmation and is not legal advice.

**Related:** US-002, NFR-003

### NFR-008 · draft · source: requirements:NFR-008

Privacy: time records are kept for a configurable retention period, defaulting to 6 years.

- Target: default retention of 6 years for time records.
- Applies to: whole system

### NFR-009 · draft · source: requirements:NFR-009

Compatibility: times are stored in UTC and shown in each user's time zone.

- Daylight-saving changes must give correct local times and durations.
- Applies to: US-017, US-010, US-013

**Related:** US-017, US-010, US-013

### NFR-010 · draft · source: requirements:NFR-010

Usability: every weekly view runs Monday to Sunday.

- The start day cannot be changed in this version.
- Target: week starts on Monday.
- Applies to: US-013, US-016

**Related:** US-013, US-016

### NFR-011 · draft · source: requirements:NFR-011

Usability: the interface is English-only.

- All labels and messages are in English.
- No other languages are supported in this version.
- Applies to: US-018

**Related:** US-018

### NFR-012 · draft · source: requirements:NFR-012

Compatibility: the layout is responsive for phone browsers.

- The clock, timesheet and dashboard work without horizontal scrolling.
- Controls are easy to tap.
- There is no native mobile app.
- Applies to: US-018, US-010, US-013, US-016

**Related:** US-018, US-010, US-013, US-016

### NFR-013 · draft · source: requirements:NFR-013

Usability: rejected forms show clear validation messages.

- Cases covered:
  - Missing fields
  - Duplicate emails
  - Negative or non-numeric bill rates
  - Hours outside 0 to 24
  - End times before start times
- Target: daily hours between 0 and 24.
- Applies to: US-004, US-008, US-012, US-013

**Related:** US-004, US-008, US-012, US-013

### NFR-014 · draft · source: requirements:NFR-014

Maintainability: data stays intact when records change.

- Rate changes, archiving a client or task, and deactivating a user must not delete or alter existing time entries.
- Existing entries must still display correctly.
- Applies to: US-006, US-007, US-008, US-009

**Related:** US-006, US-007, US-008, US-009

### NFR-015 · draft · source: requirements:NFR-015

Scalability: the product supports up to 500 users.

- Includes the busy period around the weekly timesheet deadline.
- Target: up to 500 users.
- Applies to: whole system

**Related:** REQ-STACK

### NFR-016 · draft · source: requirements:NFR-016

Maintainability: project, setup and user documentation are provided.

- Project documentation covers the stack, setup, configuration (including email service settings) and the EU/UK hosting region.
- User and admin guides are also provided.
- Applies to: US-019

**Related:** US-019, REQ-SERVICES

### NFR-017 · draft · source: requirements:NFR-017

Compliance: the bill rate is for reporting only.

- No screen offers invoicing or payment functions.
- Applies to: US-008

**Related:** US-008
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-11-07

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
| AC-050 | a System Admin | they open the admin guide | it covers creating users, assigning managers and setting up clients, projects, tasks and bill rates |
| AC-051 | a developer or operator | they open the project documentation | it describes the stack, setup, configuration including the email service API key, and the EU/UK hosting region |
<!-- sdlc:auto:end epics -->
