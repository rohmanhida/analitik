# SaaS Subscription Platform: **API Analytics Dashboard**

## 🎯 **The Idea**

A service that provides **API analytics and monitoring** for developers. Users get an API key to track their application's API usage, performance metrics, and errors. Different subscription tiers unlock more API calls, longer data retention, and advanced features.

**Why this idea?**

- Solves a real problem developers face
- Natural fit for tiered pricing
- Demonstrates both B2B SaaS patterns and technical depth
- Shows you understand rate limiting, data aggregation, and webhook handling

---

## ✨ **Core Features**

### **1. Authentication & User Management**

- Email/password registration and login (JWT)
- Email verification
- Password reset flow
- User profile management

### **2. Subscription Management**

- **Three Tiers:**
  - **Free:** 1,000 API calls/month, 7 days data retention
  - **Pro ($9/mo):** 50,000 calls/month, 30 days retention, email alerts
  - **Business ($29/mo):** 500,000 calls/month, 90 days retention, Slack webhooks, priority support

- Stripe integration for recurring payments
- Upgrade/downgrade between tiers
- Subscription status tracking (active, past_due, canceled)
- Handle Stripe webhooks (payment success, failure, subscription changes)

### **3. API Key Management**

- Generate API keys per project
- Users can create multiple projects (limited by tier)
- Rotate/revoke API keys
- View API key usage

### **4. Analytics Tracking (The Core Product)**

Users integrate your SDK/endpoint in their apps to send telemetry:

```typescript
// What users would send to your API
POST /api/v1/track
{
  "api_key": "sk_live_xxx",
  "endpoint": "/users/profile",
  "method": "GET",
  "status_code": 200,
  "response_time_ms": 145,
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### **5. Dashboard & Insights**

- Total API calls (current month)
- Average response time
- Error rate (4xx, 5xx)
- Most used endpoints
- Usage over time (charts)
- Real-time usage vs. tier limit

### **6. Rate Limiting & Enforcement**

- Enforce monthly call limits based on subscription tier
- Return 429 (Too Many Requests) when limit exceeded
- Throttling per API key

### **7. Alerts & Notifications**

- Email alerts when:
  - 80% of monthly quota reached
  - 100% quota exceeded
  - Payment fails
- Slack webhook integration (Business tier)

---

## 📦 **Scope & Technical Implementation**

### **Backend Architecture (NestJS)**

```
src/
├── auth/                 # JWT auth, guards, strategies
├── users/                # User CRUD, profile
├── subscriptions/        # Stripe integration, tier logic
├── projects/             # Project & API key management
├── analytics/            # Tracking endpoint, data ingestion
├── webhooks/             # Stripe webhook handler
├── notifications/        # Email/Slack alerts
├── billing/              # Usage metering, invoice history
├── common/               # Guards, decorators, interceptors
│   ├── guards/
│   │   ├── api-key.guard.ts      # Validate API keys
│   │   ├── rate-limit.guard.ts   # Enforce tier limits
│   │   └── subscription.guard.ts # Check active subscription
│   └── decorators/
│       └── current-tier.decorator.ts
└── database/             # TypeORM entities/Prisma schemas
```

### **Database Schema (PostgreSQL)**

**Users Table**

- id, email, password_hash, email_verified, created_at

**Subscriptions Table**

- id, user_id, stripe_customer_id, stripe_subscription_id, tier (enum), status, current_period_end

**Projects Table**

- id, user_id, name, api_key (encrypted), created_at

**Analytics Table** (partitioned by date for performance)

- id, project_id, endpoint, method, status_code, response_time_ms, timestamp

**Usage Table** (aggregated monthly)

- id, project_id, month, api_calls_count, last_reset_at

### **Key NestJS Patterns to Showcase**

1. **Guards**
   - `ApiKeyGuard` - validates API keys on tracking endpoint
   - `RateLimitGuard` - checks monthly quota before processing
   - `SubscriptionGuard` - ensures active subscription for premium features

2. **Interceptors**
   - `UsageTrackingInterceptor` - increments API call count

3. **Webhooks**
   - Stripe webhook signature verification
   - Idempotency handling (prevent duplicate processing)

4. **Background Jobs** (using `@nestjs/bull` or `@nestjs/schedule`)
   - Daily: Check for subscriptions nearing limits → send alerts
   - Monthly: Reset usage counters
   - Handle failed payment retries

5. **DTOs & Validation**
   - Class-validator for all inputs
   - Transform/sanitization pipes

---

## 🎨 **Frontend (Simple React/Next.js)**

Keep it minimal to focus on backend:

**Pages:**

1. Landing page (pricing tiers)
2. Sign up / Login
3. Dashboard home (usage overview)
4. Projects list & API key management
5. Analytics view (charts for selected project)
6. Billing & subscription management
7. Account settings

**Use:**

- Recharts or Chart.js for visualizations
- Tailwind CSS for quick styling
- React Query for API calls

---

## 🚀 **MVP Scope (What to Build First)**

**Phase 1 - Core (Week 1-2)**

- [ ] User auth (register, login, JWT)
- [ ] Stripe subscription setup (3 tiers)
- [ ] Project & API key CRUD
- [ ] Basic tracking endpoint (`POST /api/v1/track`)
- [ ] Usage counting & rate limiting

**Phase 2 - Analytics (Week 2-3)**

- [ ] Store analytics data
- [ ] Dashboard with basic metrics
- [ ] Usage vs. limit display
- [ ] Data retention enforcement by tier

**Phase 3 - Payments & Webhooks (Week 3-4)**

- [ ] Stripe webhook handling
- [ ] Subscription upgrade/downgrade
- [ ] Payment failure handling
- [ ] Email notifications (quota alerts)

**Phase 4 - Polish (Week 4+)**

- [ ] Charts & visualizations
- [ ] Slack webhook integration
- [ ] Better error handling
- [ ] API documentation (Swagger)

---

## 🔑 **What This Demonstrates**

✅ **NestJS Expertise:** Guards, interceptors, modules, dependency injection  
✅ **Payment Integration:** Stripe subscriptions, webhooks, idempotency  
✅ **Real-world Patterns:** Rate limiting, usage metering, tier-based access  
✅ **Database Design:** Efficient schema for time-series data  
✅ **Security:** API key handling, webhook verification, input validation  
✅ **Background Jobs:** Scheduled tasks, async processing  
✅ **Testing:** Unit tests for business logic, E2E for critical flows

---

## 📊 **Bonus Points**

- Add Swagger/OpenAPI documentation
- Implement caching (Redis) for rate limit checks
- Write tests (Jest) - especially for payment webhooks
- Add audit logs for security events
- Deploy to AWS/Railway/Render with CI/CD

---

Want me to help you set up the initial NestJS project structure, or dive into the Stripe integration first?
