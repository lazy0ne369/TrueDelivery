<div align="center">

<img src="https://img.shields.io/badge/TrueDelivery-Income%20Protection-f97316?style=for-the-badge&logo=shield&logoColor=white" alt="TrueDelivery"/>

# [TrueDelivery](https://true-delivery.vercel.app/)

#### *Your Earnings, Truly Protected.*

> **AI-powered parametric income insurance for India's food delivery workforce.**
> When a verified disruption hits your zone — heavy rain, AQI spike, curfew, platform outage — your lost income is returned to your UPI automatically. No forms. No calls. No waiting.

<br/>

[![Phase](https://img.shields.io/badge/Phase%201-Complete-22c55e?style=flat-square)](https://github.com)
[![Hackathon](https://img.shields.io/badge/Guidewire-DEVTrails%202026-f97316?style=flat-square)](https://github.com)
[![Coverage](https://img.shields.io/badge/Coverage-Income%20Loss%20Only-60a5fa?style=flat-square)](https://github.com)
[![Pricing](https://img.shields.io/badge/Model-Weekly%20Premium-a78bfa?style=flat-square)](https://github.com)

<br/>

[Problem](#-the-problem) · [How It Works](#-how-truedelivery-works) · [Triggers](#%EF%B8%8F-parametric-triggers) · [Features](#-features) · [AI/ML](#-aiml-architecture) · [Fraud Defense](#%EF%B8%8F-adversarial-defense--anti-spoofing) · [Tech Stack](#-tech-stack) · [Roadmap](#%EF%B8%8F-development-roadmap)

</div>

---

## 🚨 The Problem

India's **5+ million food delivery partners** on Zomato and Swiggy operate with zero safety net. No fixed salary. No paid leave. No insurance. Every rupee they earn depends entirely on being able to ride.

When external disruptions strike, they face devastating income loss:

| Disruption | What Happens | Monthly Impact |
|:---|:---|:---|
| 🌧️ Heavy rain / floods | Roads flooded, orders suspended | ₹1,500–3,000 lost |
| 🌡️ Extreme heat waves | Outdoor work becomes unsafe | ₹800–1,500 lost |
| 🌫️ Severe AQI spike | Government advisory, platforms halt | ₹600–1,200 lost |
| 🚫 Curfews & bandhs | Zone access blocked entirely | ₹500–2,000 lost |
| 📵 Platform outages | No orders available for hours | ₹300–800 lost |

These events cause delivery partners to lose **20–30% of their monthly earnings** — and they bear 100% of that loss alone.

**TrueDelivery changes that.**

> ⚠️ **Scope Boundary:** TrueDelivery covers **income loss only** from verified external disruptions. Health, life, accident, and vehicle repair coverage are strictly excluded by design.

---

## 📖 Table of Contents

1. [The Problem](#-the-problem)
2. [Real-World Scenarios](#-real-world-scenarios)
3. [How TrueDelivery Works](#-how-truedelivery-works)
4. [Payment Models](#-payment-models)
5. [Application Workflow](#-application-workflow)
6. [Weekly Premium Model](#-weekly-premium-model)
7. [Parametric Triggers](#%EF%B8%8F-parametric-triggers)
8. [Features](#-features)
9. [AI/ML Architecture](#-aiml-architecture)
10. [Adversarial Defense & Anti-Spoofing](#%EF%B8%8F-adversarial-defense--anti-spoofing)
11. [Tech Stack](#-tech-stack)
12. [Development Roadmap](#%EF%B8%8F-development-roadmap)
13. [Target Market](#-target-market)
14. [Team](#-team)

---

## 🎭 Real-World Scenarios

### Persona: The Food Delivery Partner

| Attribute | Details |
|:---|:---|
| Platforms | Zomato and/or Swiggy |
| Weekly earnings | ₹3,500–₹7,000 depending on city and hours |
| Daily hours | 8–12 hrs/day, 6–7 days/week |
| Geography | Urban and semi-urban zones across India |
| Current safety net | None |

### Scenario 1 — The Monsoon Blackout 🌧️

**Ravi · Swiggy Partner · Bengaluru**

A red alert is issued across Bengaluru. Roads flood. Swiggy suspends order assignments. Ravi cannot work for 5 hours.

| | Without TrueDelivery | With TrueDelivery |
|:---|:---|:---|
| Financial impact | ₹375 lost permanently | ₹375 returned to UPI — automatically |
| Effort required | None (still loses money) | Zero |
| Time to payout | Never | Under 3 minutes |

### Scenario 2 — The Curfew Strike 🚫

**Meena · Zomato Partner · Delhi**

A sudden bandh is called across East Delhi. Movement is restricted for 6 hours. Order volume in Meena's zone drops 90%.

**Result:** Govt alert API detects the bandh. Order volume drop confirmed. Claim auto-triggered. ₹480 paid to Meena's UPI — before she even realizes she was covered.

### Scenario 3 — The Pollution Shutdown 🌫️

**Arjun · Swiggy Partner · Delhi**

AQI crosses 450 — Severe+ category. Government issues an outdoor activity advisory. Deliveries are halted citywide.

**Result:** AQICN API flags the threshold breach. Arjun's zone is confirmed within the affected area. Payout auto-initiated for disrupted hours.

### Scenario 4 — The Fraud Attempt 🚨

**Telegram Syndicate · 47 workers · Mumbai**

A coordinated group attempts GPS-spoofing. 47 accounts simultaneously submit claims from the same GPS coordinate during a mild drizzle that doesn't meet the red-alert threshold.

**Result:** Syndicate Detection Layer flags 47 claims from a single pin within 4 minutes. Mock location APIs detected as active on 39 devices. Cell tower data contradicts GPS coordinates. All 47 claims rejected. Genuine workers in the actual flood zone are unaffected and paid instantly.

---

## ⚡ How TrueDelivery Works

Think of it like a **Jio recharge** — pay a small amount on Monday, get full income protection for the week.

```
┌──────────────────────────────────────────────────────────────┐
│  Worker pays small weekly premium (e.g. ₹49)                 │
│                           ↓                                  │
│  Gets income protection for 7 days                           │
│                           ↓                                  │
│  Disruption occurs (rain / curfew / outage)                  │
│                           ↓                                  │
│  Lost income returned AUTOMATICALLY to UPI                   │
│        (more than they paid — no repayment ever)             │
└──────────────────────────────────────────────────────────────┘
```

### The Numbers, Made Simple

**Ravi pays ₹49 on Monday. Heavy rain hits Thursday — 5 hours lost.**

```
Hours lost:            5 hours
Hourly earnings:       ₹75/hour
Total income loss:     ₹375

TrueDelivery pays:     ₹375 → Ravi's UPI  ✅
Ravi paid:             ₹49 premium

Net benefit:           Ravi saved ₹326 from total loss
```

### Does Ravi Repay the ₹375?

**No. Never.** This is how insurance works — the many fund the few.

```
1,000 workers  ×  ₹49/week  =  ₹49,000 collected
100 workers face disruption  ×  ₹375  =  ₹37,500 paid out
TrueDelivery operational margin         =  ₹11,500
```

The 900 workers who had a good week fund the 100 who were disrupted. Nobody repays. This is the 200-year-old principle of insurance — TrueDelivery makes it instant, automatic, and built for gig workers.

### Payout vs Premium

| Situation | Premium Paid | Payout Received | Net Outcome |
|:---|:---|:---|:---|
| No disruption this week | ₹49 | ₹0 | Peace of mind, full week |
| 3-hour rain disruption | ₹49 | ₹225 | **+₹176 saved** |
| Full-day curfew | ₹49 | ₹600 | **+₹551 saved** |
| Two-day flood | ₹49 | ₹1,200 | **+₹1,151 saved** |

> **No repayment. No loans. No strings. Ever.**

---

## 💳 Payment Models

### Model 1 — Self-Pay

```
Ravi earns ₹4,200 this week from Swiggy
→ Manually pays ₹49 to TrueDelivery
→ Full week coverage activated
```

Simple opt-in. No commitment required beyond 7 days.

### Model 2 — Platform Co-Pay ⭐ Recommended

```
Swiggy contributes  ₹25  (half the premium)
Ravi pays           ₹25  (other half)
                    ────
Total:              ₹50  → Full coverage activated
```

**Why would Swiggy / Zomato co-pay?**

- Protected partners stay on-platform longer — lower churn
- Less worker dropout during weather disruptions
- Platform can brand themselves as *"We protect our delivery partners"*
- Cheaper than recruiting and retraining replacements
- Strong ESG/CSR value proposition for institutional investors

This is a **B2B2C distribution model** — TrueDelivery sells to platforms, platforms offer it to their workers.

### Model 3 — Auto-Deduct from Earnings (Zero Friction)

```
Ravi earns ₹4,200 this week
Swiggy auto-deducts ₹49 before settlement
Ravi receives ₹4,151 — already insured, zero effort required
```

Functionally identical to EPF deduction. The worker is always protected without any active decision.

### Zero-Balance Safety Net 🛟

If a verified disruption hits and a worker's policy lapsed due to non-payment:

- TrueDelivery issues a **one-time emergency micro-payout of ₹100**
- Automatically recovered from their next premium payment
- No worker is ever left entirely unprotected

---

## 🔄 Application Workflow

```
┌──────────────────────────────────────────────────────────────┐
│                       WORKER JOURNEY                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. ONBOARD                                                  │
│     Mobile OTP login → Link Swiggy/Zomato Worker ID          │
│     → Select operating zones on HyperZone Map                │
│     → Declare weekly earnings                                │
│     → AI generates Risk Profile Score                        │
│                                                              │
│  2. SUBSCRIBE                                                │
│     View AI-calculated weekly premium (with breakdown)       │
│     → Pay via UPI or auto-deduct from platform earnings      │
│     → Policy activated for 7 days                            │
│                                                              │
│  3. WORK NORMALLY                                            │
│     TrueDelivery monitors disruptions in real time           │
│     HyperZone Map shows live zone safety status              │
│     Earnings Forecast shows tomorrow's weather risk          │
│                                                              │
│  4. DISRUPTION DETECTED                                      │
│     Parametric trigger fires automatically                   │
│     → Fraud check runs silently in the background            │
│     → Claim auto-initiated with zero worker effort           │
│                                                              │
│  5. PAYOUT DECISION                                          │
│     🟢 Risk Score 0–40:   Instant UPI payout                │
│     🟡 Risk Score 41–70:  2-hour hold → Auto-approved        │
│     🔴 Risk Score 71–100: Lightweight selfie verification    │
│                                                              │
│  6. DASHBOARD                                                │
│     Earnings protected · Active policy · Zone alerts         │
│     Payout history · Streak rewards · Weekly forecast        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📊 Weekly Premium Model

TrueDelivery uses a **dynamic weekly premium** model aligned with the gig worker's weekly earnings cycle.

### Why Weekly Pricing?

- Delivery partners are settled weekly by Zomato/Swiggy — the timing is natural
- Weekly subscription creates zero long-term commitment pressure
- Workers can pause during personal holidays or slow weeks without penalty
- Matches how gig workers naturally budget and think about money

### Premium Formula

```
Weekly Premium  =  Base Premium
                ×  Zone Risk Factor       (flood history, topology)
                ×  Seasonal Multiplier    (monsoon, summer heat)
                ×  Claim History Factor   (past 6 months)
                ×  Coverage Tier          (Basic / Standard / Pro)
```

### Coverage Tiers

| Tier | Weekly Premium | Max Weekly Payout | Best For |
|:---|:---|:---|:---|
| Basic Shield | ₹35–49 | ₹1,800 | Part-time / new workers |
| Standard Shield | ₹49–89 | ₹2,700 | Full-time workers ⭐ |
| Pro Shield | ₹89–120 | ₹4,000 | High-earning partners |

> Premiums stay **under 2% of average weekly earnings** to ensure genuine affordability at every tier.

### Dynamic Adjustment Factors

| Factor | Premium Impact |
|:---|:---|
| Flood-prone zone (e.g. Old City Hyderabad) | +₹5 to +₹15/week |
| Monsoon season (June–September) | +₹8/week |
| Loyalty: 3+ months active | −₹5/week |
| No-claim streak: 4 consecutive weeks | −₹3/week |
| High-disruption city (Delhi, Mumbai) | +₹10/week |

### Payout Formula

```
Payout = (Weekly Earnings ÷ 7 days ÷ Daily working hours) × Disrupted hours

Example:
  Worker earns ₹4,200/week, works 8 hrs/day, disruption = 4 hours
  → ₹4,200 ÷ 7 ÷ 8 = ₹75/hr
  → ₹75 × 4 hrs = ₹300 payout
```

---

## ⚙️ Parametric Triggers

Five automated triggers monitor in real time. When any threshold is breached within a worker's registered zone, a claim is initiated automatically — no manual filing required.

| # | Trigger | Data Source | Threshold | Worker Impact |
|:---|:---|:---|:---|:---|
| 1 | Heavy Rainfall | OpenWeatherMap API | > 50mm/hr **or** Red Alert issued | Deliveries halted, roads flooded |
| 2 | Extreme Heat | OpenWeatherMap API | > 43°C sustained for 2+ hours | Outdoor work unsafe |
| 3 | Severe Pollution | AQICN API | AQI > 400 (Severe+) | Platform suspends outdoor deliveries |
| 4 | Curfew / Bandh / Strike | Govt Alert API (mock) | Official advisory issued | Zone access blocked |
| 5 | Platform Outage | Zomato/Swiggy Mock API | Order volume drops > 80% | No orders available for 2+ hours |

---

## 🚀 Features

### Worker Mobile App

#### 1. HyperZone Live Map 🗺️

A live color-coded map of the worker's city showing zone status in real time.

- 🟢 Green — safe to work
- 🟡 Yellow — mild disruption, monitoring
- 🔴 Red — active disruption, claim triggered

Workers can tap any zone to see: *"Heavy rain detected. Coverage triggers in 12 minutes if you're operating here."*

#### 2. Earnings Forecast Widget 📈

Predictive weather and disruption forecasting integrated into the app's home screen.

- *"Tomorrow: 70% chance of heavy rain in your zone"*
- *"Recommendation: Upgrade to Pro Shield this week for an extra ₹800 coverage"*

Powered by weather forecast API + ML model. TrueDelivery becomes a financial companion, not just insurance.

#### 3. Hinglish Voice Assistant 🎙️

Full accessibility for low-literacy workers through natural language voice queries.

> Worker: *"Aaj kitna milega agar barish ho?"*
> App: *"Bhai, agar 3 ghante rain disruption hoti hai, toh ₹225 directly aapke UPI mein!"*

Powered by device speech-to-text + Claude API. Supports Hindi, Hinglish, and regional language variants.

#### 4. Weekly Streak Rewards 🏆

| Streak | Status | Benefit |
|:---|:---|:---|
| 4-week renewal | Loyal Rider | ₹10 discount/week |
| 8-week renewal | TrueWarrior | Priority payout in 30 seconds |

Drives retention and reduces platform churn — aligned with both worker and platform interests.

#### 5. Instant Payout Countdown ⏱️

```
✅ Claim Approved!
💰 ₹285 incoming to your UPI

[█████████░░░░░] 67%

Arriving in: 00:43 seconds
Ravi Kumar — SBI UPI
```

#### 6. Payout Split Intelligence 💳

Workers define their own payout routing rules:

- *"Send ₹200 to PhonePe for fuel, rest to savings"*
- *"If payout > ₹500, move 20% to savings jar automatically"*

Financial wellness built directly into the insurance product.

### AI Fraud Detection Suite

#### 7. Digital Twin Verification 👥

Every worker has a persistent AI behavioral model built from their zone history, working hours, movement speeds, and battery usage patterns. Every claim is cross-checked against this twin. A fraudster spoofing another worker's GPS coordinates fails the behavioral consistency check entirely.

#### 8. Telegram Honeypot Monitor 🍯 *(Simulated)*

Monitors for coordinated claim spikes matching known fraud syndicate patterns. In the demo: a simulated Telegram message — *"CLAIM NOW — Zone 4"* — triggers 30 simultaneous claims. The system detects and freezes all 30 in real time. Directly addresses the DEVTrails 2026 fraud scenario.

#### 9. Crowd Consensus Validator 🤝

A genuine flood affects hundreds of workers across a zone. Fraud is always a small isolated cluster.

- 50 workers in a zone showing rain signals → high confidence, real event
- 2 workers claiming, zero others showing disruption → suspicious, flagged for review
- Real disruptions have spatial distribution. Fraud rings have pinpoint clustering.

---

## 🧠 AI/ML Architecture

### 1. Risk Profiling Engine

| Property | Detail |
|:---|:---|
| Model | Gradient Boosted Decision Tree (scikit-learn / XGBoost) |
| Inputs | Worker zone, city, platform, historical weather, claim history |
| Output | Risk Score 0–100 → feeds weekly premium calculation |
| Update frequency | Every Sunday night for the upcoming week |

### 2. Dynamic Premium Calculator

| Property | Detail |
|:---|:---|
| Model | Rule-based regression with zone-level weighting |
| Transparency | Worker sees a full factor-by-factor breakdown of premium changes |
| Constraint | Premium capped at 2% of declared weekly earnings |

### 3. Fraud Detection Model

| Property | Detail |
|:---|:---|
| Model | Isolation Forest + rule-based anomaly detection |
| Inputs | Device signals, behavioral history, cluster analysis, platform activity |
| Output | Fraud Risk Score → 🟢 Auto-approve / 🟡 Soft hold / 🔴 Verify |
| Speed | Completes within seconds of claim initiation |

### 4. Digital Twin Model

| Property | Detail |
|:---|:---|
| Model | Unsupervised behavioral clustering per worker ID |
| Training data | 4 weeks of zone history, working hours, movement patterns |
| Purpose | Detects claims that are behaviorally inconsistent with the worker's established profile |

### 5. Predictive Disruption Model (Admin)

| Property | Detail |
|:---|:---|
| Model | Time-series forecasting — Prophet / LSTM |
| Purpose | Predict next week's likely claim surge by zone for liquidity management |
| Consumer | Insurer admin dashboard — proactive reserve allocation |

---

## 🛡️ Adversarial Defense & Anti-Spoofing

> Directly addressing the GPS-spoofing syndicate threat outlined in the DEVTrails 2026 problem document.

### The Threat Model

Organized groups coordinate via Telegram to spoof GPS coordinates into active disruption zones, triggering false parametric payouts and draining the insurance liquidity pool — without leaving home.

### What a Fraudster Can and Cannot Fake

A fraudster can fake GPS. They cannot fake everything simultaneously.

TrueDelivery builds a **Behavioral Consistency Score** across seven independent, uncorrelated signal layers:

| Signal | Genuine Worker | Spoofer |
|:---|:---|:---|
| Device accelerometer | Moving or sheltering from rain | Stationary at home |
| Mock Location API flag | OFF | ON |
| Network connection type | Mobile data (weakened by storm) | Home WiFi |
| Cell tower triangulation | Matches GPS zone | Contradicts GPS zone |
| Delivery app status | Logged in, no orders available | App may not be open |
| Zone history (4 weeks) | Has regularly delivered in this zone | May have never worked there |
| Digital Twin match | Consistent behavioral profile | Statistically inconsistent |

### Defense Layers

**Layer 1 — Device Intelligence**

- Android Mock Location API flag detection
- WiFi SSID check — outdoor workers in a storm are not on home WiFi
- Accelerometer and gyroscope movement pattern analysis
- Battery usage pattern profiling
- IP address geolocation cross-verification

**Layer 2 — Behavioral & Historical Intelligence**

- Worker's last 4 weeks of zone activity
- Sudden first-time claims in unfamiliar zones — flagged immediately
- Time-of-day pattern matching against established work schedule
- Platform activity check — is the delivery app open and active at claim time?
- Digital Twin behavioral consistency scoring

**Layer 3 — Environmental Cross-Validation**

- Weather API confirmation — does the disruption actually exist at that pin code?
- Order volume drop — did Zomato/Swiggy orders actually decrease in the claimed zone?
- News and public signal monitoring — independent confirmation of the event

**Layer 4 — Syndicate Detection**

- Cluster analysis: 15+ claims within 100m of the same GPS pin within 5 minutes → auto-freeze all
- Device fingerprint matching: same physical device registered under multiple worker IDs
- IP range analysis: multiple simultaneous claimers sharing the same subnet
- Simultaneity detection: statistically impossible claim timing patterns

> In a genuine flood, hundreds of workers file claims from different locations over hours. In a fraud ring, claims arrive from the same coordinate within seconds. That statistical impossibility is the strongest detection signal in the system.

### Fraud Risk Tiers — UX That Protects Without Punishing

**Core Principle:** Innocent until data proves otherwise. Verify silently in the background.

> ⚠️ Network degradation during a genuine storm is expected and normal. A failed WiFi check alone is never grounds for denial.

| Tier | Risk Score | Action | Experience |
|:---|:---|:---|:---|
| 🟢 Auto-Approve | 0–40 | Instant UPI payout | ~80% of all claims |
| 🟡 Soft Hold | 41–70 | 2-hour hold, auto-resolved | ~15% of claims |
| 🔴 Verify | 71–100 | One 10-second selfie video | ~5% of claims |

**Worker-Facing Language Policy**

- ❌ Never use: "fraud", "suspicious", "flagged", "blocked"
- ✅ Always use: "verification", "signal check", "confirming your location"

A genuine worker caught in a storm will experience the 🟡 hold as a minor delay, not an accusation. A fraudster at home cannot provide a 10-second video of a flooded street.

---

## 🔧 Tech Stack

| Layer | Technology | Rationale |
|:---|:---|:---|
| Mobile App | Flutter | Cross-platform iOS + Android from a single codebase |
| Web Dashboard | React + Tailwind CSS | Fast, component-based, well-suited for real-time dashboards |
| Backend | Node.js + Express | Lightweight, non-blocking API layer |
| Database | Firebase Firestore | Real-time sync, low-latency reads for live claim pipeline |
| AI/ML Service | Python · scikit-learn · XGBoost | Fraud detection and risk scoring as a standalone microservice |
| Weather | OpenWeatherMap API (free tier) | Real-time precipitation, temperature, and alert data |
| Air Quality | AQICN.org API (free tier) | City and zone-level AQI monitoring |
| Alerts | NewsAPI / Govt. alert mock | Curfew and strike event detection |
| Platform Data | Simulated/Mock API | Zomato/Swiggy order volume simulation |
| Payments | Razorpay Test Mode | UPI payout simulation and countdown |
| Maps | Google Maps API | HyperZone visualization and location validation |
| Authentication | Firebase Auth (OTP) | Mobile number–based login |
| Voice Assistant | Claude API + Device STT | Hinglish natural language voice queries |

---

## 🗓️ Development Roadmap

### Phase 1 — Ideation & Foundation `March 4–20` ✅

- [x] Problem research and delivery partner persona definition
- [x] Core architecture and system design
- [x] Weekly premium model and payment model design
- [x] Parametric trigger identification and threshold research
- [x] Feature ideation — HyperZone Map, Voice Assistant, Streak Rewards
- [x] Fraud detection and adversarial defense strategy
- [x] Full README documentation

### Phase 2 — Automation & Protection `March 21 – April 4`

- [ ] Worker onboarding flow (Flutter mobile app)
- [ ] HyperZone Live Map integration
- [ ] AI weekly premium calculator with risk scoring
- [ ] Policy creation and management screens
- [ ] 5 parametric trigger integrations (Weather, AQI, Govt alerts, Platform mock, News)
- [ ] Three-tier fraud detection pipeline (Green / Yellow / Red)
- [ ] Claims management and history screen
- [ ] Instant payout countdown (Razorpay test mode)
- [ ] Earnings Forecast Widget

### Phase 3 — Scale & Optimise `April 5–17`

- [ ] Digital Twin fraud detection model
- [ ] Telegram Honeypot Monitor (simulated)
- [ ] Crowd Consensus Validator
- [ ] Hinglish Voice Assistant (Claude API)
- [ ] Weekly Streak Rewards system
- [ ] Payout Split Intelligence
- [ ] Zero-Balance Safety Net
- [ ] Worker dashboard (full — earnings, coverage, forecast)
- [ ] Admin / insurer dashboard with predictive analytics
- [ ] Final 5-minute demo video
- [ ] Final pitch deck (PDF)

---

## 🎯 Target Market

| Dimension | Details |
|:---|:---|
| Geography | Pan-India — all major cities and tier-2 towns with active Zomato/Swiggy operations |
| Addressable users | ~5 million active food delivery partners |
| Launch cities | Delhi · Mumbai · Bengaluru · Hyderabad · Chennai · Pune · Kolkata · Ahmedabad |
| Distribution | B2C (worker self-enroll) + B2B2C (platform co-pay partnership) |
| Revenue model | Premium float · Operational margin on loss ratio |

---

## 👥 Team

| Name | Role | Institution |
|:---|:---|:---|
| *(Add name)* | *(Add role)* | *(Add institution)* |
| *(Add name)* | *(Add role)* | *(Add institution)* |
| *(Add name)* | *(Add role)* | *(Add institution)* |

---

## 🔗 Links

| Resource | Link |
|:---|:---|
| 🎥 Phase 1 Video | *(to be added)* |
| 🌐 Live Demo | *(to be added)* |
| 📊 Pitch Deck | *(to be added)* |
| 🔗 GitHub Repository | *(this repo)* |

---

<div align="center">

**Built for Guidewire DEVTrails 2026 University Hackathon**

*Theme: Seed. Scale. Soar.*

<br/>

*TrueDelivery — because every ride deserves a safety net.*

</div>
