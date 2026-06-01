# Debug: Revenue Chart Showing 0 RP for Today

## Goal
Fix the issue where the Revenue Chart for the current day shows 0 RP, even though the total transaction and the `Stats Card` omzet count them correctly.

## Root Cause
When the database queries transactions using `DATE(date AT TIME ZONE 'Asia/Jakarta')`, Prisma & Node-postgres translate this raw SQL DATE format back into JavaScript using the local timezone of the NodeJS server process. For example, '2026-04-03' gets parsed as `2026-04-02T17:00:00Z`. The matching script array strictly checks against the `wibD.getUTCDate()` which differs, resulting in no match and defaulting to `0`. 

## Tasks
- [ ] Task 1: Refactor `getRevenueChart` inside `transaction.ts` router to convert the date into a strict string formatted `YYYY-MM-DD` using `TO_CHAR`. → Verify: Fix timezone shifting bugs.
- [ ] Task 2: Validate the updated mapping string inside the `.find()` loop array to ensure strictly identical pattern matches.

## Done When
- [ ] Today's daily revenue matches exactly the overall omzet in the Dashboard.
