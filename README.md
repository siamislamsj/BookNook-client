# BookNook — Online Library

JavaScript full-stack library app using Next.js App Router, Express.js, MongoDB Atlas and Better Auth.

## Features
- Responsive public homepage with navbar, footer and 3-slide Swiper hero
- Latest 6 books from MongoDB and two editorial homepage sections
- Browse all books with title/author search and category filtering
- Book details with availability and borrow action
- Email/password registration, login, logout and optional Google sign-in
- Add books with title, author, category, cover image URL, description and total copies
- My Books with owner-only edit and confirmed delete
- My Borrows with borrow history and return action
- JWT-protected private APIs and owner checks
- Atomic copy decrement, duplicate active-borrow protection and copy restoration on return
- Loading UI, toast feedback, error boundary, custom 404 and route metadata
- Seed script with 20 curated books

## Requirements
- Node.js 20.9+
- npm
- MongoDB Atlas database

## Local setup

Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env.local`. Put the same MongoDB connection string in both files. Generate a random `BETTER_AUTH_SECRET` with at least 32 characters. Never commit environment files.

`server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
AUTH_BASE_URL=http://localhost:3000
CLIENT_URL=http://localhost:3000
```

`client/.env.local`:
```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Backend terminal:
```bash
cd server
npm install
npm run seed
npm run dev
```
Frontend second terminal:
```bash
cd client
npm install
npm run dev
```
Open http://localhost:3000.

## Optional Google sign-in
Email/password works without Google credentials. To enable Google, add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to `client/.env.local` and configure the Google provider redirect URI for the Better Auth application URL.

## Required API routes
| Method | Endpoint | Access |
|---|---|---|
| GET | `/books` | Public |
| GET | `/books/:id` | Public |
| POST | `/books` | JWT |
| PATCH | `/books/:id` | JWT + owner |
| DELETE | `/books/:id` | JWT + owner |
| POST | `/borrows` | JWT |
| GET | `/borrows` | JWT |
| DELETE | `/borrows/:id` | JWT + borrower |

## Assignment checklist
- [ ] Configure Atlas and local environment variables
- [ ] Run seed script and verify all 20 books
- [ ] Test registration, login, logout and session persistence
- [ ] Test all 8 API endpoints
- [ ] Test add/edit/delete and ownership restrictions
- [ ] Test borrow, duplicate rejection, out-of-stock rejection and return
- [ ] Test mobile, tablet and desktop layouts
- [ ] Run `npm run build` in client and fix build errors
- [ ] Create at least 15 meaningful client commits and 8 meaningful server commits
- [ ] Push code to GitHub
- [ ] Deploy frontend and backend, configure production environment variables and CORS
- [ ] Add live URL and at least 5 feature highlights to final README

## Commit guidance
Create real commits for completed work, not empty/fake commits. Client commit topics: setup, theme, navbar, hero, latest arrivals, books grid, search/filter, details, auth pages, add-book form, my-books, edit, delete confirmation, my-borrows, return flow, responsive polish. Server topics: Express setup, MongoDB connection, books GET, create, update, delete, JWT middleware, borrow, history, return, indexes and seed data.

## Deployment
Deploy Express to a Node-compatible host and Next.js to Vercel. Configure production `NEXT_PUBLIC_API_URL`, `BETTER_AUTH_URL`, `AUTH_BASE_URL`, `CLIENT_URL`, MongoDB URI and Better Auth secret. Update CORS and Better Auth trusted origins for production domains. Test protected workflows on the live app.


## Important setup after extracting the updated project

1. Keep your existing `server/.env` and `client/.env.local` files; they contain your local database and OAuth settings. Do not share them.
2. In the `server` terminal run `npm install`, then `npm run seed` once. The seed script is safe to run again: it adds only missing sample books and does not overwrite existing books. It inserts 20 curated sample books.
3. In the `client` terminal run `npm install` and `npm run dev`.
4. Keep the server running separately with `npm run dev` from the `server` folder.

### Google sign-in checklist

In Google Cloud Console, use an OAuth **Web application** client. Add `http://localhost:3000` as an Authorized JavaScript origin and `http://localhost:3000/api/auth/callback/google` as an Authorized redirect URI. Put the matching client ID and secret in `client/.env.local` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, then restart the Next.js dev server. If the OAuth consent screen is in Testing mode, add the Google account you are testing with under Test users. The exact Google error message is still needed to diagnose provider-console configuration problems.

### Borrow flow and profile

When a signed-out visitor chooses **Borrow this book**, the app now sends them to sign-in with the book details URL saved as the return destination. After signing in, they return to that book page and can complete the borrow. The user must choose a return date again if they had not yet signed in.

The profile page supports name, public profile-image URL, favourite authors, and password changes. Profile updates use Better Auth; password changes require the current password.
