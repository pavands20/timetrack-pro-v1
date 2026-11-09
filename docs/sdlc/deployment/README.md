# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-02fe7f260800 · approved · source: deployment:02fe7f260800

TimeTrack Pro V1 is live at version 02fe7f260800. The application runs as a separately hosted frontend and backend.

- Status: live
- Version: 02fe7f260800
- Frontend URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- Not stated in input: deployment date, who deployed or approved it, environment name (e.g. staging or production), rollout or rollback procedure, release notes, smoke or post-deploy test results.
- Requirement coverage: the input does not specify which of US-001 to US-019 are included in this version, so no requirement links are recorded here.

**Related:** DEP-02fe7f260800-FE, DEP-02fe7f260800-BE

### DEP-02fe7f260800-FE · approved · source: deployment:02fe7f260800

Frontend web app endpoint for version 02fe7f260800. This is the browser entry point for Employees, Managers, Payroll Admins, and System Admins.

- URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- The hostname indicates AWS Amplify hosting. This is inferred from the domain only; the input does not state the hosting configuration.
- Version: 02fe7f260800
- Status: live

**Related:** DEP-02fe7f260800

### DEP-02fe7f260800-BE · approved · source: deployment:02fe7f260800

Backend API endpoint for version 02fe7f260800, which serves the frontend.

- URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- The hostname is an sslip.io wildcard DNS name resolving to IP 44.240.155.47. This is inferred from the URL only; the input does not state the hosting provider, region, or scaling setup.
- App path segment 856624deec93 matches the identifier in the frontend hostname.
- Version: 02fe7f260800
- Status: live

**Related:** DEP-02fe7f260800
<!-- sdlc:auto:end narrative -->
