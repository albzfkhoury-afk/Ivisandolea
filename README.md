# IVIS & OLEA — Online Ordering

Direct ordering web app for Ivis & Olea, a restaurant/bar in Beirut, Lebanon. Customers browse the menu, add items to cart, and place orders for delivery. Orders are sent to staff via Telegram.

## Features

- Mobile-first menu browsing with category navigation
- Cart with quantity management (persisted to localStorage)
- Checkout with delivery details
- Payment: Cash on Delivery or Whish (Lebanese mobile wallet)
- Order notifications via Telegram bot
- Admin portal for menu management (add/edit/remove items, toggle availability)

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Upstash Redis** for persistent menu storage
- **Telegram Bot API** for order notifications
- **Vercel** for deployment

## Getting Started

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill in the values:
   ```bash
   cp .env.local.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

> Note: Without Upstash Redis credentials, the app uses in-memory storage (menu resets on server restart). This is fine for local development.

## Telegram Bot Setup

1. Open Telegram, search for **@BotFather**
2. Send `/newbot` and follow the prompts
3. Copy the bot token to `TELEGRAM_BOT_TOKEN`
4. Create a group chat for orders and add the bot
5. Send a message in the group, then visit:
   ```
   https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
   ```
6. Find the `chat.id` in the response and set it as `TELEGRAM_CHAT_ID`

## Admin Portal

Access the admin portal at `/admin`. The password is set via the `ADMIN_PASSWORD` environment variable.

From the admin dashboard you can:
- Add new menu items
- Edit existing items (name, description, price, category)
- Toggle item availability (hide sold-out items from customers)
- Delete items

## Deployment

Deploy to Vercel:
1. Connect this repo to Vercel
2. Add an Upstash Redis integration from the Vercel Marketplace
3. Set all environment variables from `.env.local.example`
4. Deploy
