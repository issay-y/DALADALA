# DALADALA Shipping Tracking System

A local-only shipping tracking dashboard built with React, Vite, and a Supabase-ready integration layer.

## Features

- Shipment management dashboard
- Add and search shipping entries
- Status tracking with delivery progress
- File/document management panel
- Local persistence in browser storage
- Optional Supabase sync when environment variables are configured

## Local setup

1. Install dependencies:
   npm install
2. Copy the example environment file:
   cp .env.example .env
3. Add your Supabase values if you want remote syncing:
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
4. Start the app locally:
   npm run dev

## Local only

This project is intended for local development and testing only. It is not deployed or published anywhere.

## Recommended Supabase table

If you want to connect to Supabase later, create a table named `shipments` with fields such as:

- id: uuid or text
- tracking_number: text
- customer: text
- origin: text
- destination: text
- status: text
- eta: date or text
- notes: text
- last_updated: timestamptz or text

## Notes

When Supabase keys are not configured, the app runs fully in local browser storage and remains offline-only.
