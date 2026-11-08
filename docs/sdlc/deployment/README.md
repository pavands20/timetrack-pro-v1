# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-e6355dec8dde · draft · source: deployment:e6355dec8dde

TimeTrack Pro V1 is reported live at version e6355dec8dde. The release has one frontend endpoint and one backend endpoint. No date, approver, or release notes were supplied with the deployment record.

Deployment record (as provided):
- Status: live
- Version: e6355dec8dde
- Frontend URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://44-240-155-47.sslip.io/apps/856624deec93/

Not provided in the input (left blank, not inferred):
- Deployment date/time
- Environment name (e.g. production vs. staging)
- Who deployed it and who approved the release
- Release notes or the list of requirements (US-001..US-019) included in this version
- Smoke-test or post-deploy verification results
- Rollback plan or previous version

Status is marked 'draft' because no release approval was recorded. 'Live' describes runtime state only and is not treated as sign-off.

**Related:** DEP-e6355dec8dde-FE, DEP-e6355dec8dde-BE

### DEP-e6355dec8dde-FE · draft · source: deployment:e6355dec8dde

This is the frontend web application endpoint for version e6355dec8dde. It is the URL users open in a browser to reach TimeTrack Pro V1.

- URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Version: e6355dec8dde
- Reported status: live
- The host is under the amplifyapp.com domain. Beyond that, the input gives no hosting configuration, custom domain, or CDN details.
- The identifier '856624deec93' appears in both the frontend and backend URLs. This suggests both belong to the same app instance, but the input does not state the link explicitly.

**Related:** DEP-e6355dec8dde

### DEP-e6355dec8dde-BE · draft · source: deployment:e6355dec8dde

This is the backend service endpoint for version e6355dec8dde. The frontend uses it for application data and logic.

- URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- Version: e6355dec8dde
- Reported status: live
- The hostname uses sslip.io, a wildcard DNS service that resolves to the IP embedded in the name (44.240.155.47). The input gives no stable custom domain.
- Not provided: database/storage details, scaling or availability setup, health-check endpoint, monitoring/alerting, backup policy, or how the audit trail data (timesheet change/approval history) is persisted in this environment.

**Related:** DEP-e6355dec8dde
<!-- sdlc:auto:end narrative -->
