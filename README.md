# Jar Stars

Pocket money, jobs and saving up for brothers and sisters. It works on phones and tablets, and you can add it to the home screen.

No messaging, no tracking. The family's data stays on your devices and, if you turn on family sync, in a private GitHub repo that only you control.

## Two apps

| App | Address | Who uses it |
|---|---|---|
| 🧒 **Children's app** | `index.html` | The children's tablet. Each child taps their picture ("Who's here?") to open their own jobs, jar and pet. There is no grown-up area in it at all |
| 🧑 **Grown-ups' app** | `grownups.html` | Grown-ups' phones. Asks for the 4-digit PIN every time it opens (and after 2 minutes put away). Check and approve jobs, set pay, add children, take money out |

Both use the same data. Children only ever see their own jar.

## Family sync (log in from any device)

The data lives in **one file (`family.json`) in a private GitHub repo**. Each device keeps a copy, saves its changes to the repo within a couple of seconds, and checks for other devices' changes every 20 seconds (and whenever the app is reopened). If two devices change things at the same moment, the changes are merged, so a job ticked on the tablet and an approval on a phone both survive. It keeps working without internet and catches up later. A ☁️ in the top bar means everything is saved.

### Setting it up (once)

1. **Make a private repo** on GitHub, e.g. `jar-stars-data`. Tick "Add a README" so it isn't empty. It must be **private**: the app refuses a public one.
2. **Make a token** for it: GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
   - Repository access: **Only select repositories** → `jar-stars-data`
   - Permissions → Repository permissions → **Contents: Read and write**
   - Expiration: the longest you're happy with (you'll need a new token when it runs out)
3. Open the **grown-ups' app** on your phone → **Set up family sync**. Enter the repo (`cjs1218/jar-stars-data`), paste the token, and choose a **family password**. If this device already has children set up, their data is uploaded.

### Adding a device

Grown-ups' app → **Family sync → Add a device**. Send the **Children's tablet** or **Grown-up's phone** link to the new device, open it there and type the family password.

The link contains the token **locked with your family password** (AES-256, PBKDF2), so the link is useless on its own. The token can only touch the one data repo.

**To lock out every old link** (e.g. a lost phone): delete the token on GitHub, make a new one, and run "Set up family sync" again.

## What each child gets

| Section | What's in it |
|---|---|
| 📅 **My week and jobs** | Morning, after-school and bedtime jobs to tick off, clubs for each day, and a packing checklist (school bag Mon–Fri plus each club's kit, with tomorrow's bag for packing at bedtime). 1 star per job, bonuses for a packed bag and a finished day |
| 🫙 **My jar** | Three tabs: **Earned** (totals, pay rules, bonus jobs, history), **Goals** (several savings goals; move money into each) and **Wish list** (how much they want it, a one-week thinking time, save for it or buy it) |
| 🐾 **My pet** | Spend stars to adopt a pet, then buy homes, furniture, toys, food and dress-up items. Tap "Move things around" to drag furniture and toys anywhere in the room, and tap the sofa or bed for the pet to sit on it. No guilt mechanics: the pet never gets ill or leaves |

## Grown-up controls (per child)

- **Check jobs:** untick anything not really done, then approve to add it to that child's jar
- **Pay:** each child has their own weekly pocket money (paid automatically on the day you choose), pay per daily job and an all-done bonus, so older children can earn more
- **Bonus jobs:** choose from 61 ideas or add your own, set the price and picture, and copy them to the other children
- **Their week:** set up their jobs (tap a job's picture to change it), clubs and packing list, and choose whether they can change it themselves
- **Take money out:** move money to their savings account, tick off a goal or wish you bought for them (taking all or part of the cost from the jar), or record cash paid out. Add money for gifts, and undo any entry by mistake
- **Family settings:** currency (£, €, $), change PIN, add or remove children, family sync, reset everything

## Run it

Plain HTML, CSS and JavaScript with no build step.

- **Locally:** run `python3 -m http.server` and go to http://localhost:8000 (children) or http://localhost:8000/grownups.html (grown-ups)
- **Online:** turn on GitHub Pages (Settings → Pages → Deploy from branch → `main` / root)

## Changing the words

The lists (pictures, colours, clubs, starter jobs, bonus job ideas, pet items, pay steps) are in `content.js`, so you can edit them without touching the app logic in `app.js`. Family sync is in `sync.js`.

Based on the My Week and Pocket money sections of [Girl Talk](https://github.com/cjs1218/Girl-talk).
