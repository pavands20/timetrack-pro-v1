# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-c1c419c58ca4 · draft · source: deployment:c1c419c58ca4

TimeTrack Pro V1 is reported live at version c1c419c58ca4. The release has a separately hosted frontend and backend. This is a deployment record only. It does not say which features are included.

Stated in input:
- Status: live
- Version: c1c419c58ca4
- Frontend URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://44-240-155-47.sslip.io/apps/856624deec93/

Not stated in input, so not recorded:
- Deployment date and time
- Who deployed or approved the release
- Environment name (e.g. production or staging)
- Which requirements (US-001 to US-019) are in this build
- Pre- or post-deployment test or smoke-check results
- Rollback plan or previous version
- Release notes or changelog

The entry status is 'draft' because the input records no sign-off.

**Related:** DEP-c1c419c58ca4-FE, DEP-c1c419c58ca4-BE

### DEP-c1c419c58ca4-FE · draft · source: deployment:c1c419c58ca4

This is the frontend web app endpoint for release c1c419c58ca4. It is the browser entry point for Employees, Managers, Payroll Admins and System Admins.

- URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- The hostname suggests AWS Amplify hosting. This is inferred from the domain only; the input does not say so.
- No TLS, CDN, custom domain or availability details were provided.

**Related:** DEP-c1c419c58ca4

### DEP-c1c419c58ca4-BE · draft · source: deployment:c1c419c58ca4

This is the backend API endpoint for release c1c419c58ca4. It is served under an app-specific path on an sslip.io hostname.

- URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- The sslip.io hostname maps to IP 44.240.155.47. The app is served under the path /apps/856624deec93/.
- The app id 856624deec93 also appears in the frontend hostname (p856624deec93), which suggests the two endpoints belong together.
- The input gives no database, scaling, backup, monitoring or health-check details.
- Operational note: an sslip.io IP-based hostname is usually temporary. Confirm whether a stable domain is planned. This is an observation, not a decision recorded in the input.

**Related:** DEP-c1c419c58ca4
<!-- sdlc:auto:end narrative -->
