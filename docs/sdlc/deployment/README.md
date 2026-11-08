# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-7a76bf8d64bf · draft · source: deployment:7a76bf8d64bf

TimeTrack Pro V1 is live as version 7a76bf8d64bf. The release has a frontend URL and a backend URL. No deployment date, approver or release notes were provided.

- Status: live
- Version: 7a76bf8d64bf
- Frontend URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- Not provided in the input (not documented, not inferred):
  - deployment date and time
  - who deployed or approved the release
  - target environment label (e.g. production or staging)
  - which requirements (US-001 to US-019) are included in this version
  - release notes or changelog
  - post-deploy smoke tests or health-check results
  - rollback procedure or previous version

**Related:** DEP-7a76bf8d64bf-FE, DEP-7a76bf8d64bf-BE

### DEP-7a76bf8d64bf-FE · draft · source: deployment:7a76bf8d64bf

The frontend for version 7a76bf8d64bf is served from an AWS Amplify-hosted URL. This is the browser entry point for Employees, Managers, Payroll Admins and System Admins.

- URL: https://p856624deec93.d3j61xaup4zgrx.amplifyapp.com
- Hosting: AWS Amplify, based on the amplifyapp.com domain
- Version: 7a76bf8d64bf
- Status: live
- Not stated in the input:
  - custom domain
  - CDN or caching configuration
  - build pipeline details

**Related:** DEP-7a76bf8d64bf

### DEP-7a76bf8d64bf-BE · draft · source: deployment:7a76bf8d64bf

The backend for version 7a76bf8d64bf is served over HTTPS at an sslip.io hostname under the path /apps/856624deec93/. The app ID 856624deec93 matches the identifier in the frontend hostname.

- URL: https://44-240-155-47.sslip.io/apps/856624deec93/
- Hostname: sslip.io wildcard DNS resolving to IP 44.240.155.47
- App path ID: 856624deec93, which matches the frontend hostname prefix p856624deec93
- Version: 7a76bf8d64bf
- Status: live
- Not stated in the input:
  - database or hosting details
  - scaling configuration
  - backup policy
  - monitoring or alerting setup
- Observation for human review (not a recorded decision): the backend uses a raw-IP sslip.io hostname rather than a dedicated domain. Whether this is intended for long-term production use is not stated.

**Related:** DEP-7a76bf8d64bf
<!-- sdlc:auto:end narrative -->
