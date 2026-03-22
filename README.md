# DressReady

DressReady is a React + TypeScript app that helps users plan what to wear by combining weather context, calendar context, and a polished dashboard experience.

## What This Repo Includes

- A Vite frontend built with React and TypeScript
- Google sign-in wiring for browser-based authentication
- Weather and event-focused dashboard screens
- Mock-friendly app settings for development

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion
- Radix UI

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local env file:

```bash
copy .env.example .env
```

3. Fill in your values in `.env`:

```env
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id.apps.googleusercontent.com
VITE_OPENWEATHER_API_KEY=your-openweather-api-key
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the app:

```bash
npm run dev
```

## Google OAuth Note

The Google OAuth client must be a `Web application` client in Google Cloud Console. For local development, add `http://localhost:5173` to Authorized JavaScript origins.

## Project Structure

```text
src/
  app/         Main screens, components, and app-specific services
  config/      API and app configuration
  hooks/       Reusable hooks for auth, weather, and events
  services/    API clients and Google auth logic
  styles/      Global styles and theme files
```

## GitHub Upload Notes

- Secrets were removed from source files
- `.env` is intentionally ignored
- Use `.env.example` as the template for local setup

