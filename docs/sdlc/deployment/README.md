# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEPLOY-93a8d3622727 · draft · source: deployment:93a8d3622727

TimeTrack Pro V1 is deployed and reported live at version 93a8d3622727. The deployment has a separate frontend and backend endpoint.

- Status: live
- Version: 93a8d3622727
- Frontend URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- Not stated in the input, so not recorded:
  - deployment date and time
  - who deployed or approved it
  - environment name (e.g. production or staging)
  - release notes or changelog
  - post-deploy verification or smoke-test results
  - rollback plan
  - which requirements (US-001..US-019) are included in this build
- Entry status is 'draft' because no sign-off or approval was provided.

**Related:** DEPLOY-93a8d3622727-FE, DEPLOY-93a8d3622727-BE

### DEPLOY-93a8d3622727-FE · draft · source: deployment:93a8d3622727

Frontend web endpoint for the live 93a8d3622727 deployment. This is the browser URL users open to access the app.

- URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- The hostname suggests AWS Amplify hosting. This is inferred from the domain only and was not stated in the input.
- Not provided: custom domain, TLS/certificate details, CDN or cache configuration.

**Related:** DEPLOY-93a8d3622727

### DEPLOY-93a8d3622727-BE · draft · source: deployment:93a8d3622727

Backend API endpoint for the live 93a8d3622727 deployment. The frontend calls this base path.

- URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- The hostname is an sslip.io wildcard DNS name that resolves to IP 44.240.155.47. The app is served under the path /apps/856624deec93/.
- Not provided:
  - hosting or runtime details
  - database or migration status
  - environment configuration
  - health-check results
  - monitoring or alerting setup

**Related:** DEPLOY-93a8d3622727
<!-- sdlc:auto:end narrative -->
