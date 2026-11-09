# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-3891e62d54b9 · draft · source: deployment:3891e62d54b9

TimeTrack Pro V1 version 3891e62d54b9 is live. The frontend is hosted on AWS Amplify and the backend is served from a separate URL. The entry is marked draft because the input contains no sign-off or approval record.

Recorded from deployment input:
- Status: live
- Version: 3891e62d54b9
- Frontend URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com (amplifyapp.com domain, so AWS Amplify hosting)
- Backend URL: https://44-240-155-47.sslip.io/apps/856624deec93/

Observations (factual, from the URLs only):
- The backend hostname uses sslip.io, a wildcard DNS service that maps the hostname to IP 44.240.155.47. A human should confirm whether this is the intended production endpoint or a temporary one.
- The app id 856624deec93 appears in both the frontend and backend URLs.

Not provided in input (left blank, not inferred):
- Deployment date/time
- Who deployed or approved the release
- Environment name (e.g. production or staging)
- Which requirements, tickets or sprint the release contains. related_ids is left empty because the input does not map this version to US-001 to US-019.
- Smoke test, health check or post-deployment verification results
- Rollback plan or previous version
- Configuration, secrets handling or infrastructure details
<!-- sdlc:auto:end narrative -->
