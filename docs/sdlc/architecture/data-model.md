# Data Model

<!-- sdlc:auto:start entities -->
### users

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| email | varchar(320) unique (lower-case index) | False | — | False |
| full_name | varchar(200) | False | — | False |
| password_hash | varchar(255) | False | — | True |
| role | enum(employee, manager, payroll_admin, system_admin) | False | — | False |
| time_zone | varchar(64) IANA | False | — | False |
| manager_id | uuid | False | users.id | True |
| is_active | boolean | False | — | False |
| created_at | timestamptz | False | — | False |
| updated_at | timestamptz | False | — | False |

### sessions

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| token_hash | char(64) unique | False | — | False |
| created_at | timestamptz | False | — | False |
| expires_at | timestamptz | False | — | False |
| revoked_at | timestamptz | False | — | True |

### password_tokens

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| token_hash | char(64) unique | False | — | False |
| purpose | enum(reset, set_initial) | False | — | False |
| expires_at | timestamptz | False | — | False |
| used_at | timestamptz | False | — | True |

### clients

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| name | varchar(200) unique | False | — | False |
| archived_at | timestamptz | False | — | True |

### projects

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| client_id | uuid | False | clients.id | False |
| name | varchar(200), unique per client | False | — | False |
| hourly_bill_rate | numeric(10,2) check >= 0 | False | — | False |
| default_billable | boolean | False | — | True |
| archived_at | timestamptz | False | — | True |

### tasks

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| project_id | uuid | False | projects.id | False |
| name | varchar(200) | False | — | False |
| archived_at | timestamptz | False | — | True |

### time_entries

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| user_id | uuid | False | users.id | False |
| project_id | uuid | False | projects.id | False |
| task_id | uuid | False | tasks.id | False |
| source | enum(clock, manual) | False | — | False |
| billable | boolean | False | — | False |
| work_date | date (user-local) | False | — | False |
| started_at | timestamptz (UTC), required when source=clock | False | — | True |
| ended_at | timestamptz (UTC), null while running, check > started_at | False | — | True |
| duration_minutes | integer check 0..1440, required when source=manual | False | — | True |
| created_at | timestamptz | False | — | False |
| updated_at | timestamptz | False | — | False |

### breaks

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | uuid | True | — | False |
| time_entry_id | uuid | False | time_entries.id | False |
| started_at | timestamptz (UTC) | False | — | False |
| ended_at | timestamptz (UTC) | False | — | True |

### app_settings

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| key | varchar(100) | True | — | False |
| value | jsonb | False | — | False |
<!-- sdlc:auto:end entities -->

<!-- sdlc:auto:start relationships -->
| Source | Target | Type |
|---|---|---|
| users | users | one-to-many |
| users | sessions | one-to-many |
| users | password_tokens | one-to-many |
| clients | projects | one-to-many |
| projects | tasks | one-to-many |
| users | time_entries | one-to-many |
| projects | time_entries | one-to-many |
| tasks | time_entries | one-to-many |
| time_entries | breaks | one-to-many |
<!-- sdlc:auto:end relationships -->

<!-- sdlc:auto:start er-diagram -->
```mermaid
erDiagram
  users {
    uuid id PK
    varchar_320__unique__lower_case_index_ email
    varchar_200_ full_name
    varchar_255_ password_hash
    enum_employee__manager__payroll_admin__system_admin_ role
    varchar_64__IANA time_zone
    uuid manager_id FK
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  sessions {
    uuid id PK
    uuid user_id FK
    char_64__unique token_hash
    timestamptz created_at
    timestamptz expires_at
    timestamptz revoked_at
  }
  password_tokens {
    uuid id PK
    uuid user_id FK
    char_64__unique token_hash
    enum_reset__set_initial_ purpose
    timestamptz expires_at
    timestamptz used_at
  }
  clients {
    uuid id PK
    varchar_200__unique name
    timestamptz archived_at
  }
  projects {
    uuid id PK
    uuid client_id FK
    varchar_200___unique_per_client name
    numeric_10_2__check____0 hourly_bill_rate
    boolean default_billable
    timestamptz archived_at
  }
  tasks {
    uuid id PK
    uuid project_id FK
    varchar_200_ name
    timestamptz archived_at
  }
  time_entries {
    uuid id PK
    uuid user_id FK
    uuid project_id FK
    uuid task_id FK
    enum_clock__manual_ source
    boolean billable
    date__user_local_ work_date
    timestamptz__UTC___required_when_source_clock started_at
    timestamptz__UTC___null_while_running__check___started_at ended_at
    integer_check_0__1440__required_when_source_manual duration_minutes
    timestamptz created_at
    timestamptz updated_at
  }
  breaks {
    uuid id PK
    uuid time_entry_id FK
    timestamptz__UTC_ started_at
    timestamptz__UTC_ ended_at
  }
  app_settings {
    varchar_100_ key PK
    jsonb value
  }
  users ||--o{ users : "one-to-many"
  users ||--o{ sessions : "one-to-many"
  users ||--o{ password_tokens : "one-to-many"
  clients ||--o{ projects : "one-to-many"
  projects ||--o{ tasks : "one-to-many"
  users ||--o{ time_entries : "one-to-many"
  projects ||--o{ time_entries : "one-to-many"
  tasks ||--o{ time_entries : "one-to-many"
  time_entries ||--o{ breaks : "one-to-many"
```
<!-- sdlc:auto:end er-diagram -->
