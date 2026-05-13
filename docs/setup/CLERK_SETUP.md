# Clerk Setup Guide

## 1. Create a Clerk application
1. Go to https://clerk.com and sign in or sign up.
2. Create a new application for this project.
3. Choose "Frontend" for the application type if prompted.

## 2. Configure redirect URLs
1. In the Clerk dashboard, open your application settings.
2. Add these URLs to the Redirect URLs / Allowed Redirect URLs section:
   - `http://localhost:3000/sign-in/callback`
   - `http://localhost:3000`
   - `http://localhost:3000/sign-in`
   - `http://localhost:3000/sign-up`
3. Add the same URLs to the Sign-in and Sign-up redirects if Clerk requires them.

## 3. Copy Clerk credentials
1. From your Clerk app settings, copy the following values:
   - Publishable key
   - Secret key
   - Frontend API or Clerk domain (if needed)
2. Keep these values safe.

## 4. Configure the app environment
1. Open `.env` or `.env.local` in the repo root.
2. Add or update these variables:
   ```env
   NEXT_PUBLIC_CLERK_FRONTEND_API=<your-clerk-frontend-api>
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=http://localhost:3000/sign-in
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=http://localhost:3000/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=http://localhost:3000/sign-up
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
   CLERK_SECRET_KEY=<your-clerk-secret-key>
   CLERK_WEBHOOK_SIGNING_SECRET=<your-clerk-webhook-signing-secret>
   ```
3. The `NEXT_PUBLIC_CLERK_FRONTEND_API` value is typically the Clerk host only, for example `content-lion-30.clerk.accounts.dev`.

## 5. Verify Clerk integration in the app
1. Confirm the project uses Clerk in these places:
   - `src/app/layout.tsx` (wraps the app with `ClerkProvider`)
   - `src/middleware.ts` (protects routes with `clerkMiddleware`)
   - `src/app/sign-in/[[...sign-in]]/page.tsx` (renders the Clerk sign-in page)
   - `src/app/api/webhooks/clerk/route.ts` (webhook handling)
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` and try signing in.

## 6. Optional: configure webhooks
1. In Clerk Dashboard, go to Webhooks.
2. Create a webhook URL pointing to:
   - `http://localhost:3000/api/webhooks/clerk`
3. If Clerk requires a webhook secret, store it in a new env variable and update `src/app/api/webhooks/clerk/route.ts` accordingly.

## 7. Troubleshooting
- If sign-in fails, make sure the redirect URLs exactly match the app URLs.
- If the app complains about missing Clerk variables, confirm the `.env` keys match `src/config/env.client.ts` and `src/config/env.server.ts`.
- Restart the dev server after changing `.env`.
