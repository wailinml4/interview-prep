# Clerk Subscriptions Setup Guide

This project uses Clerk's built-in pricing and subscription UI via the `PricingTable` component.

## 1. Enable subscriptions in Clerk
1. Open the Clerk dashboard: `https://dashboard.clerk.com`
2. Select your application.
3. Find the `Billing` / `Subscriptions` / `Plans` section in the app settings.
4. Define the subscription plans you want to offer, including:
   - plan name
   - price
   - billing interval
   - features

## 2. Configure your product and plan IDs
1. If Clerk requires product or plan IDs, copy them from the plan settings.
2. Optionally store those IDs in environment variables if your app needs to reference them directly.

## 3. Confirm the app uses Clerk pricing UI
The project renders Clerk's pricing table in `src/services/clerk/components/PricingTable.tsx`:

```tsx
import { PricingTable as ClerkPricingTable } from "@clerk/nextjs"

export function PricingTable() {
  return <ClerkPricingTable newSubscriptionRedirectUrl="/app" />
}
```

That means:
- Clerk will show subscription plan options automatically
- after creating a subscription, users are redirected to `/app`

## 4. Configure Clerk redirect URLs for subscriptions
1. In Clerk app settings, make sure these URLs are allowed:
   - `http://localhost:3000`
   - `http://localhost:3000/sign-in`
   - `http://localhost:3000/sign-up`
   - `http://localhost:3000/app`
2. If Clerk asks for a subscription redirect callback URL, use the same app host and path conventions.

## 5. Add any required env variables
This project already requires Clerk env values in `.env`.
If you need subscription-specific keys, add them as required by Clerk.

## 6. Verify subscription flow locally
1. Start the app:
   ```bash
   npm run dev
   ```
2. Open `http://localhost:3000`
3. Navigate to the upgrade/pricing page if available.
4. Choose a plan and complete the Clerk subscription flow.
5. Confirm the user is redirected to `/app` after subscribing.

## 7. Notes
- The subscription UI is managed by Clerk, so most billing logic is handled by Clerk.
- If you want custom subscription handling later, you can replace `ClerkPricingTable` with your own UI and use Clerk APIs.
- If Clerk warns about `@clerk/ui`, install it and pass `ui={ui}` into your `ClerkProvider` to stabilize styling.
