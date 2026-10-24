# Jar Stars

Pocket money, jobs and saving up for brothers and sisters, on one family tablet. It works on phones and tablets, and you can add it to the home screen.

No accounts, no messaging, no tracking. Everything is saved only in the browser on that device.

## How it works

1. **A grown-up sets it up.** Choose a 4-digit PIN, then add each child with their own name, picture and colour.
2. **Who's here?** Each child taps their picture to open their own jar. Children only see their own jobs, money and pet. No balances show on the picker.
3. **Grown-ups** see every child on one page, with their jar total and how many jobs are waiting to be checked. The grown-up area locks again as soon as you leave it.

## What each child gets

| Section | What's in it |
|---|---|
| 📅 **My week and jobs** | Morning, after-school and bedtime jobs to tick off, clubs for each day, and a packing checklist (school bag Mon–Fri plus each club's kit, with tomorrow's bag for packing at bedtime). 1 star per job, bonuses for a packed bag and a finished day |
| 🫙 **My jar** | Three tabs: **Earned** (totals, pay rules, bonus jobs, history), **Goals** (several savings goals; move money into each) and **Wish list** (how much they want it, a one-week thinking time, save for it or buy it) |
| 🐾 **My pet** | Spend stars to adopt a pet, then buy homes, furniture, toys, food and dress-up items. No guilt mechanics: the pet never gets ill or leaves |

## Grown-up controls (per child)

- **Check jobs:** untick anything not really done, then approve to add it to that child's jar
- **Pay:** each child has their own weekly pocket money (paid automatically on the day you choose), pay per daily job and an all-done bonus, so older children can earn more
- **Bonus jobs:** choose from 61 ideas or add your own, set the price, and copy them to the other children
- **Their week:** set up their jobs, clubs and packing list, and choose whether they can change it themselves
- **Money in and out:** record money paid out or added
- **Family settings:** currency (£, €, $), change PIN, add or remove children, reset everything

## Run it

Plain HTML, CSS and JavaScript with no build step.

- **Locally:** open `index.html` in a browser, or run `python3 -m http.server` and go to http://localhost:8000
- **Online:** turn on GitHub Pages (Settings → Pages → Deploy from branch → `main` / root)

## Changing the words

The lists (pictures, colours, clubs, starter jobs, bonus job ideas, pet items, pay steps) are in `content.js`, so you can edit them without touching the app logic in `app.js`.

Based on the My Week and Pocket money sections of [Girl Talk](https://github.com/cjs1218/Girl-talk).
