# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-d87a3273a648 · draft · source: deployment:d87a3273a648

TimeTrack Pro V1 version d87a3273a648 is reported as live. It is served from separate frontend and backend endpoints.

Provided in input:
- Deployment status: live
- Version: d87a3273a648
- Frontend URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://44-240-155-47.sslip.io/apps/856624deec93/

Not provided in input (left blank, not inferred):
- Deployment date and time
- Who deployed or approved the release
- Environment name (e.g. production or staging)
- Which requirements (US-001 to US-019) are in this build
- Release notes or changelog
- Smoke tests, health checks, or monitoring results
- Rollback procedure

Traceability note:
- No requirement IDs are linked, because the input does not say which features this version contains.

**Related:** DEP-d87a3273a648-FE, DEP-d87a3273a648-BE

### DEP-d87a3273a648-FE · draft · source: deployment:d87a3273a648

This is the frontend endpoint for version d87a3273a648. The hostname indicates AWS Amplify hosting.

- URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Host: the amplifyapp.com domain indicates AWS Amplify; no other hosting details were provided
- Status: live, as reported for the overall deployment
- Custom domain, CDN, and TLS configuration: not provided

**Related:** DEP-d87a3273a648

### DEP-d87a3273a648-BE · draft · source: deployment:d87a3273a648

This is the backend endpoint for version d87a3273a648. It is served under an app-specific path on an sslip.io hostname.

- URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- Hostname format: sslip.io wildcard DNS for IP address 44.240.155.47
- App path segment: /apps/856624deec93/, which matches the identifier in the frontend hostname (p856624deec93)
- Status: live, as reported for the overall deployment
- Database, runtime, scaling, and backup details: not provided

**Related:** DEP-d87a3273a648
<!-- sdlc:auto:end narrative -->
