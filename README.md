# Job Genie — Backend

The API layer for Job Genie. Handles authentication, company wishlist management, and job fetching, with Claude powering company recommendations.

Frontend repository: [Job-Genie-Frontend](https://github.com/TB0515/Job-Genie-Frontend)

## Contents

- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Tests](#tests)
- [My Contribution](#my-contribution)
- [Code review with Claude Code agents](#code-review-with-claude-code-agents)
- [Next phase](#next-phase)

## How it works

- The user signs in with Google or with an email and a password. Supabase Auth examines the credentials.

- The backend puts the Supabase access token in an HTTP-only cookie. The `requireAuth` middleware examines this token on each protected request.

- The user chooses the company filters and the backend sends these filters to Claude, which returns 4 real companies in a fixed structure.

- The backend saves all the data for each company with a valid website URL in the database and links the company to the user.

- The frontend sends the company names and role keywords to the backend. The backend asks the TheirStack API for UK roles from the last 7 days, with a maximum of 5 jobs for each company.

Each user can make 5 generate calls and 10 job searches in 10 minutes. This limit protects the Claude and TheirStack quotas.

## Tech stack

- Node.js, Express 5, TypeScript
- Supabase (PostgreSQL database and authentication)
- Anthropic SDK (Claude)
- TheirStack Jobs API
- Google Auth Library
- Vitest and Supertest
- Prettier, Husky and lint-staged

## Getting started

### Prerequisites

- Node.js v22+ (tested on Node.js 26)
- A [Supabase](https://supabase.com/) project
- An [Anthropic API key](https://console.anthropic.com/)
- A [Google OAuth app](https://console.cloud.google.com/)
- A [TheirStack](https://theirstack.com/) API token

### Setup locally

```bash
git clone https://github.com/TB0515/Job-Genie-Backend.git
cd Job-Genie-Backend
npm install
cp .env.example .env
```

Add the keys in your `.env` file.

```
npm run dev
```

### Tests

The project has two types of tests.

- API tests are in the tests/ folder. These tests use mocks for Supabase, Google, Claude and TheirStack.

```bash
npm test
```

- Database tests are in src/services/\*.test.ts. These tests write rows to your Supabase project and then delete them. Use a development project for these tests.

```bash
npm run test:db
```

## My contribution

This started as a four-person team project at Founders and Coders (cohort FAC 32).

- Authentication: Google sign-in with Supabase, email sign-up and login, /auth/me, the requireAuth middleware, and server-side token revocation at logout.
- Job roles: Replaced AI generated dummy jobs with TheirStack jobs API.
- Database: A team member built the first database services. When they left the course, I took over the database routes, linked them to the tables and auth, and wrote their tests.

After the course, I returned to shape this project:

- Wishlist: I replaced the in-memory wishlist with per-user database storage. I added Claude tool use for a fixed output structure.
- Input safety: I added a list of permitted filter values. This list stops prompt injection through the wishlist filters.
- Reliability: I added startup checks for the API keys and the CORS_ORIGIN setting. I also made the production build and the Render deployment.
- Safari support: The frontend sends API requests through Render rewrite rules. Thus, the session cookie is first-party and Safari accepts it.
- Tests: I wrote the integration tests for auth and jobs. I isolated the database tests with setup and cleanup steps.
- Code quality: With Claude Code, I reviewed and removed all `any` types, added per-user rate limits and input validation, and changed the company logos to Google favicons. I also added Helmet security headers, a startup check for the Google client ID and separate commands for the API and database tests.
- Tooling: I made the multi-agent Claude Code review.

## Code review with Claude Code agents

The .claude/ folder contains a multi-agent code review for Claude Code. This is part of a learning experiment.

To start a review, type this command in Claude Code:

`/review-code`

The review uses six agents:

1. **review-code**: Starts the review and runs the four specialist agents in parallel.
2. **security-reviewer**: Examines authentication, cookies, CORS, secrets and input validation.
3. **code-quality-reviewer**: Examines type safety, duplicate code, dead code and error handling.
4. **test-coverage-reviewer**: Examines test gaps, broken tests and test isolation.
5. **architecture-reviewer**: Examines layer separation, data flow and documentation drift.
6. **supervisor-reviewer**: Removes duplicate and false findings. Then it makes one ranked report.

.claude/settings.json lets Claude Code run the project's git, npm, Prettier, TypeScript and Vitest commands without a prompt each time.

## Next Phase

### Features and Fixes:

- User-Wishlist: Fetch the user's wishlist along with the saved job roles.
- Resume: Compare the user's skills with each job description and give a match score.
- JobAlerts: Schedule job fetch for the wishlist companies and send email or SMS alert to user on new open roles.
- Remove: Link the remove button to the 'rejected' status so the database stays up to date.
- Return saved jobs from the database for the same filters and time period. This decreases the number of API requests.
- Add filters for remote work and seniority.
