# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-2991fa7c5e84 · draft · source: deployment:2991fa7c5e84

TimeTrack Pro V1 build 2991fa7c5e84 is deployed and reported as live. The build has a frontend and a separate backend, each at its own URL.

- Deployment status: live
- Version / build identifier: 2991fa7c5e84
- Frontend URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- Not stated in the input (left blank, not inferred):
  - Deployment date and time
  - Who performed the deployment
  - Who approved the deployment
  - Environment name (e.g. production or staging)
  - Release notes or the list of requirements and features included
  - Smoke test or verification results
  - Rollback procedure or previous version
- Status is recorded as 'draft' because the input gives no approval or sign-off. Update it if an approval record is provided.

**Related:** DEP-2991fa7c5e84-FE, DEP-2991fa7c5e84-BE

### DEP-2991fa7c5e84-FE · draft · source: deployment:2991fa7c5e84

This is the frontend web application endpoint for live build 2991fa7c5e84. It is the browser-facing URL for the TimeTrack Pro V1 web app.

- URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Version served: 2991fa7c5e84 (as reported for the deployment)
- The hostname is an amplifyapp.com domain. The input gives no further detail about hosting configuration, a custom domain, or caching.
- No availability or health check results were provided.

**Related:** DEP-2991fa7c5e84

### DEP-2991fa7c5e84-BE · draft · source: deployment:2991fa7c5e84

This is the backend service endpoint for live build 2991fa7c5e84. The frontend is expected to call it for application data and logic. The input gives only the base URL.

- Base URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- Version: 2991fa7c5e84 (as reported for the deployment)
- The hostname uses an sslip.io wildcard DNS name that resolves to IP 44.240.155.47. The input does not specify infrastructure details beyond the URL.
- Not provided:
  - API route list
  - Health endpoint
  - Database or migration status
  - Environment configuration
  - Monitoring or alerting setup

**Related:** DEP-2991fa7c5e84
<!-- sdlc:auto:end narrative -->
