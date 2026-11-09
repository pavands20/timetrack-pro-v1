# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-6903b1043ba7 · draft · source: deployment:6903b1043ba7

TimeTrack Pro V1 version 6903b1043ba7 is live. The web frontend is served from an AWS Amplify URL. The backend API is served from a separate sslip.io host under the path /apps/856624deec93/.

Deployment record (as provided):
- Status: live
- Version: 6903b1043ba7
- Frontend URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://44-240-155-47.sslip.io/apps/856624deec93/

Observations (from the URLs only):
- The frontend host is an AWS Amplify app domain (amplifyapp.com).
- The backend host is an sslip.io wildcard DNS name, which resolves to IP 44.240.155.47.
- The app id 856624deec93 appears in both the frontend subdomain and the backend path.

Not stated in the input (left blank, not inferred):
- Deployment date/time.
- Environment name (e.g. production vs. staging/demo).
- Who performed or approved the deployment. The entry status is set to 'draft' because no approval is recorded; 'live' is the operational status only.
- Which user stories (US-001 to US-019) are included in this build, so related_ids is left empty.
- Release notes, changelog, or the commit/build that the version maps to.
- Smoke-test, health-check, or post-deploy verification results.
- Infrastructure, configuration, database, or migration details.
- Rollback plan or previous version.
- Monitoring or alerting setup.
<!-- sdlc:auto:end narrative -->
