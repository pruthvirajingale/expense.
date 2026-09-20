# expense. — Personal Money OS

Built from the uploaded Perplexity-style expense tracker and expanded into a local-first money dashboard.

## Main systems
- Expenses
- Money received / income log
- Monthly spending and available balance
- Daily spending budget
- Automatic daily unspent-budget allocation
- Multiple buying goals
- Manual goal contributions
- Goal priorities and completion tracking
- Spending insights and projected monthly spend
- CSV export
- PDF export
- PWA manifest + service worker
- Offline app shell
- Responsive mobile layout
- Subtle interface animations

## Daily budget behavior
If the daily budget is ₹150 and you spend ₹110, ₹40 is recorded as that day's available goal funding. The allocation is stored once for that date so refreshing the app does not create money repeatedly.

## Run
Install Node.js, then:

    node server.js

Open http://localhost:3000

All financial data remains in browser localStorage; there is no backend database.
