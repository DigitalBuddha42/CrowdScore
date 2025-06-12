# Product Requirements Document (PRD)

## Product Name: Combat Sports Scorecard Web App (PWA MVP)

**Platforms:** Mobile Web (PWA via Next.js), Desktop Web

---

## 1. Feature Definition & Prioritization (Kano Model)

| Feature                              | Description                                             | Kano Category |
| ------------------------------------ | ------------------------------------------------------- | ------------- |
| Scorecard UI                         | Real-time, round-by-round scoring interface for fights  | Basic         |
| Fight Timeline & Stats Visualization | Timeline view with fight stats, audience scoring trends | Performance   |
| Judge Score Comparison               | Compare audience scorecards with official judge cards   | Excitement    |
| Social Media Sharing                 | Share user scorecards to major platforms (Twitter, IG)  | Performance   |
| User Profiles                        | Save scorecards, track history                          | Performance   |
| Gamification / Leaderboards          | Rankings for most active/accurate users                 | Excitement    |
| Push Notifications                   | Notify users when fights start or results are in        | Basic         |
| Monetization Features (Ads, Premium) | Freemium tier + in-app purchases + ad integrations      | Basic         |
| Judge Analytics Dashboard            | Internal tool to rank and report on judge performance   | Performance   |

---

## 2. Functional & Non-Functional Requirements

### Functional Requirements

- Users can select a live or past fight and assign scores round-by-round.
- Scores are submitted in real time and aggregated in backend.
- Users can view trends and stats mid-fight and post-fight.
- Users can compare their scoring with judges.
- Scorecards are shareable via social media.
- User data (score history, preferences) is saved securely.
- Monetization: display ads in free version, premium tier disables ads.

### Non-Functional Requirements

- **Performance:** Support 100k concurrent users during high-profile events.
- **Scalability:** Cloud backend auto-scales with demand.
- **Security:** End-to-end encryption of user data; GDPR/CCPA compliant.
- **Reliability:** 99.9% uptime during peak events.
- **Compliance:** Privacy controls, opt-outs, and consent management built-in.
- **PWA Specific:** Offline caching, installable experience, web push support (Android).

---

## 3. User Workflows & Journeys (User Story Mapping)

### Key Personas

- **Fan User**: Watches fights and scores rounds.
- **Data Analyst**: Uses judge analytics internally.
- **Marketing User**: Monitors engagement stats.

### Core User Journeys

**1. Scoring a Fight:**

- Open PWA → Select live fight → Tap score round → Submit → See live results

**2. Post-Fight Review:**

- Fight ends → View audience stats → Compare with judges → Share to social

**3. Score History Review:**

- Login → Go to profile → Browse previous scorecards → Analyze trends

### Friction Points

- Onboarding too long → Minimize steps
- Confusion over score mechanics → Add tooltips/help
- Lack of push on iOS → Supplement with email alerts

---

## 4. Technical Feasibility & Architecture

### Conceptual Architecture Diagram (Descriptive)

- **Frontend (Web App):** Next.js PWA (React-based), from `next-ai-starter`
- **Backend (API):** Edge API Routes or Next.js Functions (from `next-ai-starter`)
- **Data Layer:** Supabase with PostgreSQL, Prisma as ORM
- **Realtime Updates:** Redis pub/sub for score broadcasting
- **Auth & User Management:** NextAuth.js + Supabase auth support
- **Storage:** Scorecard image generation in-memory + optional upload to object store
- **Monitoring & Logging:** OpenTelemetry-compatible or platform logs

### Constraints

- iOS push notifications are limited
- Use Redis pub/sub + client polling for live update propagation

---

## 5. Acceptance Criteria (Gherkin Syntax)

### Scorecard Submission

```gherkin
Feature: Score a round
  Scenario: User submits a score
    Given the user has selected an active fight
    When the user selects a fighter and a round score
    Then the score is saved and aggregated with other users
Feature: Compare scores
  Scenario: User wants to compare scores with official judges
    Given the fight is complete
    When the user opens the comparison screen
    Then the official and audience scores are shown side-by-side
Feature: Share scorecard
  Scenario: User wants to share a fight result
    Given the user has scored a fight
    When the user taps the Share button
    Then the scorecard is exported and shared to the selected platform
## 6. Release Strategy & Timeline (Incremental Roadmap)

### Release 1: MVP (Month 1–4)

- ✅ **Installable PWA:** Next.js with offline support and home screen prompt
- ✅ **Fight List UI:** Select ongoing or past fights
- ✅ **Scorecard UI:** Round-by-round scoring interface
- ✅ **Backend Submission:** Submit score data to Supabase via API routes
- ✅ **Live Score Aggregation:** Redis pub/sub to update average scores in real time
- ✅ **Judge Comparison:** Simple UI to view judge scores vs. user scores
- ✅ **Basic Analytics:** View round-by-round audience stats
- ✅ **Auth:** Email/password and Google sign-in (NextAuth.js)
- ✅ **Deployment:** Deployed to Vercel with monitoring and logging enabled

### Release 2: Engagement Layer (Month 5–6)

- ✅ **User Profiles:** Store and view previous scorecards
- ✅ **Push Notifications:** Web push for new fight alerts, reminders
- ✅ **Leaderboards:** Ranked list of most active or accurate fans
- ✅ **Gamification:** Badges, levels, or streaks
- ✅ **Social Sharing:** Export scorecard images, direct share buttons

### Release 3: Premium Tier + Native Prep (Month 7+)

- ✅ **Premium Subscription Tier:** Unlock advanced judge analytics, remove ads
- ✅ **Judge Analytics Dashboard:** Insights into judge accuracy, trends, and rankings
- ✅ **Native App Prep:** Evaluate Capacitor or React Native wrapper for App Store
- ✅ **Advanced Features:** Save favorites, fight reminders, score breakdowns per fighter

### Dependencies

- Social media APIs (Twitter, IG)
- Third-party feed for official judge scorecards
- Redis or other pub/sub mechanism for real-time updates
- Supabase or PostgreSQL analytics aggregation jobs
- Push notification service setup (Web Push / Firebase Cloud Messaging)

---

## 7. Risk Management & Assumptions (RAID Log)

| Type       | Description                                                     | Impact | Mitigation Strategy                                |
|------------|------------------------------------------------------------------|--------|----------------------------------------------------|
| Risk       | Web push support limited on iOS                                 | Medium | Use email alerts or in-app reminders as fallback   |
| Risk       | High load during popular fights may cause lag                   | High   | Use Redis + horizontal scaling with Supabase pool  |
| Assumption | Users are familiar with 10-point must scoring system            | Low    | Provide tooltips, UI onboarding overlay            |
| Assumption | Social sharing will drive user growth organically               | Medium | Integrate tracking to evaluate and iterate         |
| Issue      | Limited access to judge data for obscure fights                 | Medium | Focus MVP on UFC or major cards with consistent data |
| Dependency | Real-time data sync between client and backend                  | High   | Redis pub/sub, socket fallback or polling hybrid   |
| Dependency | Platform policies (App Store, Web Push rules, rate limits, etc) | Medium | Design web-first and evaluate mobile store policies later |

---

## 8. MVP Granular Agile Stories (All 1-Point)

### Epic: Infrastructure Deployment & Hosting

- [ ] Scaffold Next.js app with PWA support using `next-ai-starter`
- [ ] Deploy to Vercel with staging + production environments
- [ ] Configure Redis pub/sub connection and test data flow
- [ ] Set up Supabase and Prisma schema for fights, scores, users
- [ ] Add service worker for offline support and install prompt
- [ ] Configure `.env` and secret management via Vercel or Doppler
- [ ] Set up CI/CD pipelines (optional for MVP)

### Epic: Score Fights in Real Time

- [ ] View list of current and upcoming fights
- [ ] Tap a fight to enter scoring screen
- [ ] Tap a fighter to score round (10–9, 10–8, 10–10, etc.)
- [ ] Submit score and view aggregated results instantly
- [ ] Receive score confirmation toast or alert
- [ ] Score auto-locks once submitted, editable until round ends

### Epic: View Fight Summaries

- [ ] After final round, show final score breakdown per user
- [ ] Compare user score vs. official judge scorecards
- [ ] Show total audience scoring trends (e.g. % of people who gave a round to X)
- [ ] Export fight score stats as JSON (dev-only)

### Epic: Onboarding & Auth

- [ ] Sign up using email + password
- [ ] Sign in with Google
- [ ] View list of saved fights
- [ ] Reset password workflow
- [ ] Handle account deletion (for compliance)

### Epic: Social Features

- [ ] Add “Share Scorecard” button after final round
- [ ] Generate scorecard image using canvas or server-side renderer
- [ ] Enable share to Twitter (text + image)
- [ ] Enable copy link (fallback if platform blocks direct share)

### Epic: PWA Basics

- [ ] Installable on Android/iOS
- [ ] App works offline when cached
- [ ] Add PWA manifest + icons
- [ ] Detect PWA install state and show prompt
- [ ] Use Lighthouse to ensure PWA standards

---

## 9. Definition of Done (DoD)

- ✅ Feature meets all related user stories  
- ✅ Code is peer reviewed and approved via pull request  
- ✅ Unit tests written with coverage over 80%  
- ✅ Acceptance criteria fully met per Gherkin specs  
- ✅ Live on staging environment (e.g. `staging.fightscore.io`)  
- ✅ Redis and Supabase services tested and healthy  
- ✅ No console errors or major UI bugs  
- ✅ PWA audit score ≥ 90 (Lighthouse)  
- ✅ Documentation updated (README, API routes, schema)
