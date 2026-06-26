<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# MetaCourt — Agent Guide

## Stack (versions matter)
- **Next.js 16** (App Router), **React 19**, **TypeScript ~6.0**, **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **MongoDB** via Mongoose 9, **Ethers.js 6**, **Hardhat v3** (breaking from v2), Solidity 0.8.28
- Auth: custom JWT in httpOnly cookies (not next-auth server-side; `next-auth` dep is unused on server)

## Commands
```sh
npm run dev        # dev server (localhost:3000)
npm run build      # production build
npm run start      # production server
npm run lint       # eslint (no args, uses eslint-config-next)
```
No test framework configured.

## Project map
```
src/
  app/
    (auth)/          login, register — no dashboard shell
    (dashboard)/     admin/, complainant/, juror/, opposite-party/ — wrapped in DashboardShell
    case/[caseId]/   public case detail page
    api/             REST routes: auth/, complaints/, blockchain/, upload/, votes/, admin/
  components/        auth/, complaint/, juror/, voting/, blockchain/, admin/, ui/, layout/
  lib/               auth.ts, mongodb.ts, web3.ts (stub), cloudinary.ts, hash.ts (stub), utils.ts
  models/            User, Complaint, Evidence, Vote, JurorApplication (Mongoose)
  types/             TS interfaces re-exported from index.ts
  constants/         roles, status, categories, decisions, jurorLevels, vote, contract
  context/           AuthContext, Web3Context (stub)
  middleware/        auth.ts (requireAuth), roleGuard.ts (requireRole, checkCaseRelationship)
  hooks/             useAuth, useBlockchain (stub), useComplaints, useUpload, useVoting
contracts/           MetaCourt.sol (empty)
scripts/             deploy.js (empty), verify.js (empty)
```

## Key conventions
- **Path alias**: `@/*` → `./src/*` (tsconfig paths)
- **Auth**: JWT in cookie named `token`, httpOnly, sameSite strict, 7-day expiry. Use `requireAuth()` in API routes.
- **Roles** (Mongoose): `user | juror | admin`. Dashboard routes by role — `user` maps to complainant.
- **RoleGuard**: `requireRole(user, [...])` throws `"FORBIDDEN"`. `checkCaseRelationship()` returns complainant/opposite_party/juror/none.
- **CaseId format**: `MC-{year}-{0001}` via `generateCaseId(sequence)` in `lib/utils.ts`
- **Evidence**: uploaded to Cloudinary `/api/upload`, stored as separate Evidence docs linked to Complaint
- **Allowed uploads**: image/jpeg, image/png, image/webp, application/pdf, MS Word — max 10MB
- **Votes**: anonymous by default, unique per complaint+juror. Values: `valid | invalid | needs_evidence`
- **States** (Complaint): pending → under_review → voting → decided → closed (or appealed/rejected)

## Stubs / work-in-progress
These files exist but are empty: `lib/web3.ts`, `lib/hash.ts`, `lib/caseId.ts`, `hooks/useBlockchain.ts`, `context/Web3Context.tsx`, `contracts/MetaCourt.sol`, `scripts/deploy.js`, `scripts/verify.js`, several API route handlers, some dashboard pages.

## Environment (.env.example)
`MONGODB_URI`, `JWT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Cloudinary creds, `NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_RPC_URL`, `PRIVATE_KEY`. Optional: `INFURA_API_KEY`, `ETHERSCAN_API_KEY`, `EMAIL_SERVICE_API_KEY`.

## Hardhat
Config in `hardhat.config.ts` (Solidity 0.8.28, default network). v3 API — consult `node_modules/hardhat/` docs before writing tasks or scripts.
