/* Jar Stars – pocket money, jobs and savings for brothers and sisters.
   One shared family device. Everything is saved only in this browser (localStorage).
   No accounts, no tracking. */

/* ---------- Helpers ---------- */
const app = document.getElementById('app');
const KEY = 'jarstars-v1';
const clone = o => JSON.parse(JSON.stringify(o));
const pad = n => String(n).padStart(2,'0');
const dkey = (d=new Date()) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2,6);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const shuffle = a => { a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const $ = (sel, el=app) => el.querySelector(sel);
const $$ = (sel, el=app) => [...el.querySelectorAll(sel)];
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Family and children ---------- */
// F = the whole family (shared PIN, currency, children). S = the child whose jar is open.
const MONEY_DEFAULT = () => ({ rate:0.10, dayBonus:0.20, allow:{ amt:0, day:'sat', last:'' }, gigs:[], ledger:[], reviewed:{}, gigLog:[], goals:[], wishes:[] });
const KID_DEFAULT = () => ({ stars:0, earned:{}, spent:0, pet:null, owned:[], food:{}, home:'box', wear:null,
  routine: clone(ROUTINE_DEFAULT), ticks:{}, noSchool:{}, canEdit:true, money: MONEY_DEFAULT() });

function loadFamily(){ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; } }
let F = Object.assign({ pin:'', cur:'£', kids:[], current:null }, loadFamily());
F.kids.forEach(fixKid);
let S = null;

function fixKid(k){
  const d = KID_DEFAULT();
  Object.keys(d).forEach(x => { if (k[x] === undefined) k[x] = d[x]; });
  k.money = Object.assign(MONEY_DEFAULT(), k.money);
  k.money.allow = Object.assign({ amt:0, day:'sat', last:'' }, k.money.allow);
  return k;
}
const kidById = id => F.kids.find(k => k.id === id) || null;
const colourOf = k => COLOURS.find(c => c.id === k.colour) || COLOURS[0];
// Run fn with S set to another child, then put S back
function withKid(k, fn){ const was = S; S = k; try { return fn(); } finally { S = was; } }

function save(){ try { localStorage.setItem(KEY, JSON.stringify(F)); } catch(e){} updateStars(); }

function view(html){ app.innerHTML = `<div class="pop">${html}</div>`; }

let timers = [];
function later(fn, ms){ const t = setTimeout(fn, ms); timers.push(t); return t; }
function stopTimers(){ timers.forEach(clearTimeout); timers = []; }

const wallet = () => S ? Math.max(0, S.stars - S.spent) : 0;
function updateStars(){ document.getElementById('starcount').textContent = wallet(); }
function bumpStar(){ const el = document.getElementById('starbox'); el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

let toastT;
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
}

// Give stars once per key (use a date in the key for "once a day" rewards)
function award(key, n=1, msg='Great job!'){
  if (S.earned[key]) return false;
  S.earned[key] = true; S.stars += n; save();
  toast(`+${n} ⭐ ${msg}`); bumpStar();
  return true;
}

function confetti(){
  if (reduceMotion) return;
  const bits = ['🎉','⭐','🪙','🌟','🎊','✨'];
  for (let i=0;i<24;i++){
    const s = document.createElement('span');
    s.className = 'confetti';
    s.textContent = bits[i % bits.length];
    s.style.left = Math.random()*100 + 'vw';
    s.style.animationDelay = (Math.random()*0.6) + 's';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 3200);
  }
}

/* ---------- Top bar & routing ---------- */
let backTo = null;
// kid: show the child's stars and avatar in the top bar
function setTop(title, back, theme, kid = true){
  document.getElementById('title').textContent = title || '';
  const b = document.getElementById('back');
  backTo = back; b.hidden = !back;
  document.body.className = 't-' + (theme || 'home');
  const showKid = kid && !!S;
  document.getElementById('starbox').hidden = !showKid;
  const w = document.getElementById('who');
  w.hidden = !showKid;
  if (showKid) w.textContent = S.avatar;
  const c = S ? colourOf(S) : COLOURS[0];
  document.body.style.setProperty('--kid', c.c);
  document.body.style.setProperty('--kid-soft', c.soft);
}
document.getElementById('back').addEventListener('click', () => { if (backTo) location.hash = backTo; });

const routes = {
  'who': who, 'welcome': welcome, 'home': home,
  'week': week, 'week/edit': weekEdit, 'money': money,
  'pet': petRoom, 'pet/adopt': petAdopt, 'pet/shop': petShop,
  'gu': family, 'gu/kid': moneyParent, 'gu/week': weekEdit, 'gu/child': childForm
};

let parentUnlocked = false;
let curPath = '', curParams = new URLSearchParams();
function route(){
  stopTimers();
  const h = location.hash.replace(/^#\/?/, '');
  const [path, q] = h.split('?');
  const params = new URLSearchParams(q || '');
  curPath = path; curParams = params;
  window.scrollTo(0, 0);
  F.kids.forEach(runAllowance);
  const grownUp = path === 'gu' || path.startsWith('gu/');
  // Leaving the grown-up area always locks it again
  if (!grownUp) parentUnlocked = false;

  if (grownUp){
    S = params.get('k') ? kidById(params.get('k')) : null;
    if (!parentUnlocked) return parentGate(route);
    if ((path === 'gu/kid' || path === 'gu/week') && !S){ location.hash = '#/gu'; return; }
    return routes[path](params);
  }
  if (!F.kids.length) return welcome();
  S = kidById(F.current);
  if (!S || path === 'who' || !path) return who();
  (routes[path] || home)(params);
}
window.addEventListener('hashchange', route);

/* ---------- Welcome, who's here, home ---------- */
function welcome(){
  S = null;
  setTop('Jar Stars', null, 'home', false);
  view(`
    <div class="bigemoji">🫙⭐</div>
    <h1 class="center">Welcome to Jar Stars</h1>
    <p class="intro center">Jobs, pocket money and saving up, for every child in the family, on one tablet.</p>
    <div class="card">
      <h3>A grown-up sets it up</h3>
      <p>You'll choose a 4-number PIN, then add each child with their own name, picture and colour. Each child gets their own jobs, jar, savings goals and pet.</p>
      <a class="btn block" href="#/gu/child">Set up Jar Stars →</a>
    </div>
  `);
}

function who(){
  S = null;
  if (F.current){ F.current = null; save(); }
  setTop('Jar Stars', null, 'home', false);
  view(`
    <h1 class="center" style="margin-top:8px">Who's here?</h1>
    <p class="intro center">Tap your picture to open your jar.</p>
    <div class="kids">${F.kids.map(k => { const c = colourOf(k);
      return `<button class="kidtile" data-k="${k.id}" style="--c:${c.c};--cs:${c.soft}"><span class="kt-av">${k.avatar}</span><span class="kt-name">${esc(k.name)}</span></button>`; }).join('')}</div>
    <a class="small-link" href="#/gu">🔒 Grown-ups</a>
  `);
  $$('.kidtile').forEach(b => b.onclick = () => { F.current = b.dataset.k; save(); location.hash = '#/home'; });
}

function home(){
  const g = GREETINGS[Math.floor(Math.random()*GREETINGS.length)];
  setTop('Jar Stars', null, 'home');
  view(`
    <section class="hello">
      <span class="avatar">${S.avatar}</span>
      <div><h1>Hi ${esc(S.name)}!</h1><p>${g}</p></div>
    </section>
    ${weekBanner()}
    ${moneyBanner()}
    ${petBanner()}
    <a class="btn ghost block" href="#/who" style="margin-top:6px">👋 Not ${esc(S.name)}? Switch</a>
    <a class="small-link" href="#/gu">🔒 Grown-ups</a>
  `);
}

/* ---------- My Pet ---------- */
const petType = () => S.pet && PETS.find(p => p.id === S.pet.type);
const findItem = id => [...HOMES, ...FURNITURE, ...TOYS, ...FOOD, ...ACCESSORIES].find(i => i.id === id);

function petBanner(){
  if (S.pet){
    const t = petType();
    return `<a class="petbanner" href="#/pet"><span class="pb-pet">${t.e}</span><span><b>Visit ${esc(S.pet.name)}</b><small>You have ${wallet()} ⭐ to spend</small></span><span class="pb-go">→</span></a>`;
  }
  const need = Math.max(0, ADOPT_COST - wallet());
  return `<a class="petbanner" href="#/pet/adopt"><span class="pb-pet">🐾</span><span><b>Adopt a pet!</b><small>${need ? `Earn ${need} more ⭐ by doing your jobs` : 'You have enough stars. Pick your pet!'}</small></span><span class="pb-go">→</span></a>`;
}

function spend(cost){
  if (wallet() < cost){ toast(`You need ${cost - wallet()} more ⭐`); return false; }
  S.spent += cost; save(); bumpStar(); return true;
}

function petAdopt(){
  if (S.pet){ location.hash = '#/pet'; return; }
  setTop('Adopt a pet', '#/home', 'friends');
  let pick = null;
  const choose = () => {
    const w = wallet();
    view(`
      <div class="bigemoji">🐾</div>
      <p class="intro center">Collect stars by doing your jobs and packing your bag. Then spend them on a pet and things for its home!</p>
      ${w < ADOPT_COST ? `<div class="card center"><p><b>You have ${w} of ${ADOPT_COST} ⭐</b></p><div class="progress"><i style="width:${Math.round(w/ADOPT_COST*100)}%"></i></div><a class="btn" href="#/week">Do my jobs</a></div>` : ''}
      <div class="chips">${PETS.map(p => { const c = p.cost || ADOPT_COST;
        return `<button class="chip" data-id="${p.id}" ${w < c ? 'disabled style="opacity:.5"' : ''}><span class="e">${p.e}</span>${p.name}<small class="price">${c} ⭐</small></button>`; }).join('')}</div>
    `);
    $$('.chip').forEach(b => b.onclick = () => { pick = PETS.find(p => p.id === b.dataset.id); name(); });
  };
  const name = () => {
    view(`
      <div class="bigemoji" style="font-size:96px">${pick.e}</div>
      <h2 class="center">What will you call your ${pick.name.toLowerCase()}?</h2>
      <input id="pn" maxlength="16" placeholder="Pet name" autocomplete="off">
      <div class="examples">${shuffle(PET_NAMES).slice(0,6).map(n => `<button>${n}</button>`).join('')}</div>
      <div class="row" style="margin-top:12px"><button class="btn ghost" id="bk">← Back</button><button class="btn" id="ad">Adopt for ${pick.cost || ADOPT_COST} ⭐</button></div>
    `);
    $$('.examples button').forEach(b => b.onclick = () => { $('#pn').value = b.textContent; });
    $('#bk').onclick = choose;
    $('#ad').onclick = () => {
      const n = $('#pn').value.trim();
      if (!n){ toast('Give your pet a name first!'); return; }
      if (!spend(pick.cost || ADOPT_COST)) return;
      S.pet = { type: pick.id, name: n, since: dkey(), fed: null };
      S.home = 'box';
      S.food[pick.fav] = (S.food[pick.fav] || 0) + 2;  // welcome gift
      save(); confetti();
      toast(`Welcome home, ${n}! 🎁 2 free snacks`);
      location.hash = '#/pet';
    };
  };
  choose();
}

function petRoom(){
  if (!S.pet){ location.hash = '#/pet/adopt'; return; }
  const t = petType(), home = HOMES.find(h => h.id === S.home) || HOMES[0];
  setTop(S.pet.name, '#/home', 'friends');
  const fedToday = S.pet.fed === dkey();
  const say = !fedToday ? `Hi ${S.name}! I'm a little bit peckish… 🍽️` : `Hi ${S.name}! I'm so happy you came!`;
  const acc = ACCESSORIES.find(a => a.id === S.wear);
  view(`
    <div class="bubble" id="say">${esc(say)}</div>
    <div class="room" style="--wall:${home.wall};--floor:${home.floor}">
      ${FURNITURE.filter(f => S.owned.includes(f.id)).map(f => `<span class="it" style="left:${f.x}%;top:${f.y}%">${f.e}</span>`).join('')}
      ${TOYS.filter(f => S.owned.includes(f.id)).map(f => `<button class="it toy" data-id="${f.id}" style="left:${f.x}%;top:${f.y}%" aria-label="Play with ${f.name}">${f.e}</button>`).join('')}
      <button class="petwrap" id="pet" aria-label="Stroke ${esc(S.pet.name)}"><span class="pet">${t.e}</span>${acc ? `<span class="acc ${acc.where}">${acc.e}</span>` : ''}</button>
      <span class="homelabel">${home.e} ${home.name}</span>
    </div>
    <div class="tray" id="tray">
      ${FOOD.filter(f => S.food[f.id] > 0).map(f => `<button class="food" data-id="${f.id}" aria-label="Feed ${f.name}">${f.e}<b>${S.food[f.id]}</b></button>`).join('') || '<span class="muted">No food yet. Buy some in the shop!</span>'}
    </div>
    <p class="muted center" style="font-size:15px;margin-top:-4px">Tap ${esc(S.pet.name)} for a cuddle, tap food to feed, tap toys to play.</p>
    <div class="row"><a class="btn" href="#/pet/shop">🛍️ Shop</a><a class="btn ghost" href="#/week">⭐ Earn stars</a></div>
  `);
  const pw = $('#pet'), bubble = $('#say');
  const talk = (txt) => { bubble.textContent = txt; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); };
  const jump = () => { pw.classList.remove('jump'); void pw.offsetWidth; pw.classList.add('jump'); };
  const hearts = (n=3, e='💖') => {
    for (let i=0;i<n;i++){ const h = document.createElement('span'); h.className = 'heart'; h.textContent = e;
      h.style.left = (44 + Math.random()*12) + '%'; h.style.animationDelay = (i*0.15) + 's';
      $('.room').appendChild(h); setTimeout(() => h.remove(), 1600); }
  };
  pw.onclick = () => {
    const lines = [...PET_SAYS];
    const g = S.money.goals.find(x => x.saved < x.amt);
    if (g) lines.push(`Ooh, you're saving for ${g.name}! ${fmtMoney(g.amt - g.saved)} to go!`);
    talk(lines[Math.floor(Math.random()*lines.length)]); jump(); hearts();
  };
  $$('.toy').forEach(b => b.onclick = () => {
    const toy = TOYS.find(x => x.id === b.dataset.id);
    b.classList.remove('spin'); void b.offsetWidth; b.classList.add('spin');
    talk(toy.say); jump(); hearts(2, '✨');
  });
  $$('.food').forEach(b => b.onclick = () => {
    const f = FOOD.find(x => x.id === b.dataset.id);
    S.food[f.id]--; S.pet.fed = dkey(); save();
    const fav = f.id === t.fav;
    const bite = document.createElement('span'); bite.className = 'eat'; bite.textContent = f.e; $('.room').appendChild(bite);
    setTimeout(() => bite.remove(), 1000);
    talk(fav ? `${f.name}! My FAVOURITE! Thank you! 😋` : `Yum yum, thank you! 😋`); jump(); hearts(fav ? 5 : 2, fav ? '💖' : '😋');
    later(() => { const n = S.food[f.id]; if (n > 0) b.querySelector('b').textContent = n; else b.remove();
      if (!$('#tray .food')) $('#tray').innerHTML = '<span class="muted">All gone! Buy more in the shop.</span>'; }, 300);
  });
}

function petShop(){
  if (!S.pet){ location.hash = '#/pet/adopt'; return; }
  setTop('Pet shop', '#/pet', 'friends');
  const tabs = [
    { id:'homes', name:'🏡 Homes', items:HOMES },
    { id:'furniture', name:'🛋️ Furniture', items:FURNITURE },
    { id:'toys', name:'⚽ Toys', items:TOYS },
    { id:'food', name:'🍎 Food', items:FOOD },
    { id:'wear', name:'🎩 Dress up', items:ACCESSORIES }
  ];
  let tab = 'homes';
  const t = petType();
  const draw = () => {
    const cur = tabs.find(x => x.id === tab);
    const w = wallet();
    view(`
      <div class="wallet">You have <b>${w} ⭐</b> to spend</div>
      <div class="tabs">${tabs.map(x => `<button class="tab ${x.id===tab?'on':''}" data-t="${x.id}">${x.name}</button>`).join('')}</div>
      <div class="shop">${cur.items.map(i => {
        let btn, note = '';
        if (tab === 'food'){
          note = `<small>You have ${S.food[i.id] || 0}${i.id === t.fav ? ' · ' + esc(S.pet.name) + '\'s favourite!' : ''}</small>`;
          btn = `<button class="buy" data-id="${i.id}" ${w < i.cost ? 'disabled' : ''}>Buy ${i.cost} ⭐</button>`;
        } else if (tab === 'homes'){
          const own = i.cost === 0 || S.owned.includes(i.id);
          btn = S.home === i.id ? `<button class="buy using" disabled>Living here</button>`
              : own ? `<button class="buy use" data-id="${i.id}">Move in</button>`
              : `<button class="buy" data-id="${i.id}" ${w < i.cost ? 'disabled' : ''}>Buy ${i.cost} ⭐</button>`;
        } else if (tab === 'wear'){
          const own = S.owned.includes(i.id);
          btn = S.wear === i.id ? `<button class="buy using" data-id="${i.id}">Take off</button>`
              : own ? `<button class="buy use" data-id="${i.id}">Wear it</button>`
              : `<button class="buy" data-id="${i.id}" ${w < i.cost ? 'disabled' : ''}>Buy ${i.cost} ⭐</button>`;
        } else {
          btn = S.owned.includes(i.id) ? `<button class="buy using" disabled>In the room ✓</button>`
              : `<button class="buy" data-id="${i.id}" ${w < i.cost ? 'disabled' : ''}>Buy ${i.cost} ⭐</button>`;
        }
        return `<div class="shopitem"><span class="se">${i.e}</span><b>${esc(i.name)}</b>${note}${btn}</div>`;
      }).join('')}</div>
      <a class="btn block" href="#/pet" style="margin-top:8px">Back to ${esc(S.pet.name)}</a>
    `);
    $$('.tab').forEach(b => b.onclick = () => { tab = b.dataset.t; draw(); });
    $$('.buy[data-id]').forEach(b => b.onclick = () => {
      const i = findItem(b.dataset.id);
      if (tab === 'food'){
        if (spend(i.cost)){ S.food[i.id] = (S.food[i.id] || 0) + 1; save(); toast(`${i.e} Added to the food tray`); }
      } else if (tab === 'homes'){
        if (S.owned.includes(i.id) || i.cost === 0 || spend(i.cost)){
          if (!S.owned.includes(i.id)) S.owned.push(i.id);
          S.home = i.id; save(); confetti(); toast(`${i.e} ${S.pet.name} moved into the ${i.name.toLowerCase()}!`);
        }
      } else if (tab === 'wear'){
        if (S.wear === i.id){ S.wear = null; save(); }
        else if (S.owned.includes(i.id) || spend(i.cost)){
          if (!S.owned.includes(i.id)) S.owned.push(i.id);
          S.wear = i.id; save(); toast(`${i.e} Looking good, ${S.pet.name}!`);
        }
      } else if (spend(i.cost)){
        S.owned.push(i.id); save(); toast(`${i.e} Added to ${S.pet.name}'s room!`);
      }
      draw();
    });
  };
  draw();
}


/* ---------- My Week ---------- */
const DAY_KEYS = ['mon','tue','wed','thu','fri','sat','sun'];
const DAY_LONG = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const addDays = n => { const d = new Date(); d.setHours(12,0,0,0); d.setDate(d.getDate() + n); return d; };
const dayIdx = d => (d.getDay() + 6) % 7;
const fmtHour = h => `${h % 12 || 12}${h < 12 ? 'am' : 'pm'}`;
const fmtTime = t => { if (!t) return ''; const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}${m ? ':' + pad(m) : ''}${h < 12 ? 'am' : 'pm'}`; };
const isCustom = c => c.custom || !CLUB_EMOJI.some(o => o.e === c.e);
const focusName = k => { const el = $(`input[data-c="${k}"][data-f="name"]`); if (el){ el.scrollIntoView({ block:'center' }); el.focus(); } };

function bagFor(d){
  const key = dkey(d), di = dayIdx(d);
  const groups = [];
  const school = S.routine.school.filter(i => onDay(i, DAY_KEYS[di])).map(i => i.t);
  if (di < 5 && !S.noSchool[key] && school.length) groups.push({ id:'school', e:'🏫', name:'School', items:school });
  (S.routine.clubs[DAY_KEYS[di]] || []).forEach(c => { if (c.bag.length) groups.push({ id:c.id, e:c.e, name:c.name, items:c.bag }); });
  return groups;
}
const bagIds = d => bagFor(d).flatMap(g => g.items.map(i => `${g.id}:${i}`));
const ticked = (date, id) => (S.ticks[date] || []).includes(id);
function toggleTick(date, id){
  const t = S.ticks[date] = S.ticks[date] || [];
  const i = t.indexOf(id);
  if (i >= 0) t.splice(i, 1); else t.push(id);
  // keep only the last 21 days of ticks
  const cut = dkey(addDays(-21));
  Object.keys(S.ticks).forEach(k => { if (k < cut) delete S.ticks[k]; });
  save();
  return i < 0;
}
const onDay = (it, dk) => !it.days || it.days.includes(dk);
const isSchoolDay = d => dayIdx(d) < 5 && !S.noSchool[dkey(d)];
const partsFor = d => JOB_PARTS.filter(p => !p.school || isSchoolDay(d));
const schoolList = key => key === 'school' || (JOB_PARTS.find(p => p.id === key) || {}).school;
const jobsFor = d => partsFor(d).flatMap(p => S.routine.jobs[p.id].filter(j => onDay(j, DAY_KEYS[dayIdx(d)])));

function todayCount(){
  const d = addDays(0), key = dkey(d);
  const ids = [...jobsFor(d).map(j => 'job:' + j.id), ...bagIds(d).map(b => 'bag:' + b)];
  return { done: ids.filter(id => ticked(key, id)).length, total: ids.length };
}

function weekBanner(){
  const d = addDays(0), clubs = S.routine.clubs[DAY_KEYS[dayIdx(d)]] || [];
  const { done, total } = todayCount();
  const sub = clubs.length ? 'Today: ' + clubs.map(c => c.e + ' ' + esc(c.name)).join(' · ') : 'No clubs today';
  return `<a class="petbanner weekbanner" href="#/week"><span class="pb-pet">📅</span><span><b>My week and jobs</b><small>${sub} · ${done} of ${total} done</small></span><span class="pb-go">→</span></a>`;
}

let weekOffset = 0;
function week(){
  setTop('My week', '#/home', 'week');
  const draw = () => {
    const d = addDays(weekOffset), key = dkey(d), di = dayIdx(d);
    const isToday = weekOffset === 0;
    const clubs = S.routine.clubs[DAY_KEYS[di]] || [];
    const groups = bagFor(d);
    const bIds = bagIds(d);
    const bagDone = bIds.filter(id => ticked(key, 'bag:' + id)).length;
    const { done, total } = todayCount();
    const checkRow = (id, e, t, disabled) => `<button class="check ${ticked(key, id) ? 'on' : ''}" data-id="${esc(id)}" ${disabled ? 'disabled' : ''}><span class="box">${ticked(key, id) ? '✓' : ''}</span>${e ? `<span class="ce">${e}</span>` : ''}<span class="ct">${esc(t)}</span></button>`;
    view(`
      <div class="weekstrip">${[...Array(7)].map((_,n) => { const x = addDays(n), xc = (S.routine.clubs[DAY_KEYS[dayIdx(x)]] || []);
        return `<button class="wd ${n===weekOffset?'on':''}" data-n="${n}"><small>${n===0 ? 'Today' : n===1 ? 'Tmrw' : DAY_LONG[dayIdx(x)].slice(0,3)}</small><b>${x.getDate()}</b><span>${xc.map(c => c.e).join('') || '·'}</span></button>`; }).join('')}</div>
      <a class="moneypill" href="#/money"><span>🫙 My jar</span><b>${fmtMoney(balance())}</b><span class="pb-go">→</span></a>
      <h2>${isToday ? 'Today, ' : weekOffset === 1 ? 'Tomorrow, ' : ''}${DAY_LONG[di]} ${d.getDate()} ${d.toLocaleDateString('en-GB',{month:'long'})}</h2>
      ${isToday ? `<div class="card soft"><b>${done} of ${total} done today</b><div class="progress" style="margin-bottom:0"><i style="width:${total ? Math.round(done/total*100) : 0}%"></i></div></div>` : ''}

      <h3>✅ My jobs</h3>
      ${isToday ? partsFor(d).map(p => `<div class="card"><p class="grp">${p.e} ${p.name}</p>
          ${S.routine.jobs[p.id].filter(j => onDay(j, DAY_KEYS[di])).map(j => checkRow('job:' + j.id, j.e, j.t)).join('') || '<p class="muted" style="margin:0">No jobs here.</p>'}
          ${p.id === 'bedtime' ? '<button class="btn ghost block" id="tmrw" style="margin-top:10px">🎒 Open tomorrow\'s bag</button>' : ''}</div>`).join('')
        : `<div class="card muted center">Jobs are ticked off on the day. Come back ${weekOffset === 1 ? 'tomorrow' : 'on ' + DAY_LONG[di]}!</div>`}

      <h3 style="margin-top:18px">Clubs and activities</h3>
      ${clubs.length ? clubs.map(c => `<div class="club"><span class="ce">${c.e}</span><span><b>${esc(c.name)}</b>${c.time ? `<small>${fmtTime(c.time)}</small>` : ''}</span></div>`).join('')
        : `<div class="card muted center">No clubs ${isToday ? 'today' : 'this day'}. Free time! 🎉</div>`}

      <h3 style="margin-top:18px">🎒 Pack my bag${weekOffset === 1 ? ' for tomorrow' : ''}</h3>
      ${di < 5 ? `<label class="noschool"><input type="checkbox" id="ns" ${S.noSchool[key] ? 'checked' : ''}> No school this day (holiday or INSET day)</label>` : ''}
      ${groups.length ? `<div class="card">${groups.map(g => `<p class="grp">${g.e} ${esc(g.name)}</p>${g.items.map(i => checkRow(`bag:${g.id}:${i}`, '', i)).join('')}`).join('')}
        <p class="muted center" style="margin:8px 0 0">${bagDone} of ${bIds.length} packed${bagDone === bIds.length ? ' 🎉' : ''}</p></div>`
        : `<div class="card muted center">Nothing to pack. Enjoy your day!</div>`}

      ${S.canEdit ? '<a class="btn ghost block" href="#/week/edit" style="margin-top:6px">✏️ Change my week</a>' : ''}
    `);
    $$('.wd').forEach(b => b.onclick = () => { weekOffset = +b.dataset.n; draw(); });
    if ($('#tmrw')) $('#tmrw').onclick = () => { weekOffset = 1; draw(); window.scrollTo(0, 0); };
    if ($('#ns')) $('#ns').onchange = e => { if (e.target.checked) S.noSchool[key] = true; else delete S.noSchool[key]; save(); draw(); };
    $$('.check').forEach(b => b.onclick = () => {
      const id = b.dataset.id;
      if (id.startsWith('job:') && rvOf(key).paid.includes(id.slice(4))){ toast('A grown-up has already checked this one ✓'); return; }
      const on = toggleTick(key, id);
      if (on && id.startsWith('job:')) award(`job-${key}-${id}`, 1, 'Job done!');
      if (on && id.startsWith('bag:') && bIds.every(x => ticked(key, 'bag:' + x))) { award(`bag-${key}`, 2, 'Bag all packed!'); }
      if (on && isToday){
        const c = todayCount();
        if (c.done === c.total && award(`day-${key}`, 3, 'Whole day done! 🎉')) confetti();
      }
      const y = window.scrollY; draw(); window.scrollTo(0, y);
    });
  };
  draw();
}

// A grid of pictures to choose from; extra = data attributes saying which job it is for
const iconGrid = (cur, extra) => `<div class="iconpick"><p class="muted" style="margin:0 0 6px;font-size:15px">Pick a picture:</p><div class="pickpics">${JOB_EMOJI.map(e => `<button class="ipick ${e === cur ? 'on' : ''}" ${extra} data-ico="${e}" aria-label="Picture ${e}">${e}</button>`).join('')}</div></div>`;

// Used by the child ("Change my week") and by a grown-up ("Set up X's week")
function weekEdit(){
  const gu = curPath === 'gu/week';
  if (!gu && !S.canEdit){ location.hash = '#/week'; return; }
  const back = gu ? `#/gu/kid?k=${S.id}` : '#/week';
  setTop(gu ? `${S.name}'s week` : 'Change my week', back, 'week', !gu);
  let day = dayIdx(addDays(0)), picking = null;
  const R = S.routine;
  const listEditor = (key, items, placeholder) => `
    <div class="elist" data-list="${key}">
      ${items.map((it, k) => { const dks = schoolList(key) ? DAY_KEYS.slice(0,5) : DAY_KEYS; const none = it.days && !it.days.length;
        const job = key !== 'school', open = job && picking === key + ':' + k;
        return `<div class="erow">${job ? `<button class="jicon ${open ? 'on' : ''}" data-list="${key}" data-k="${k}" aria-label="Change picture for ${esc(it.t)}">${it.e || '⭐'}</button>` : ''}<div class="etext"><span>${esc(it.t)}</span>
          <div class="daychips">${dks.map(dk => `<button class="dchip ${onDay(it, dk) ? 'on' : ''}" data-list="${key}" data-k="${k}" data-day="${dk}" aria-label="${DAY_LONG[DAY_KEYS.indexOf(dk)]}">${DAY_LONG[DAY_KEYS.indexOf(dk)].slice(0,2)}</button>`).join('')}</div>
          ${none ? '<small class="warn">Not on any day. Tap a day to turn it on.</small>' : ''}</div>
          <button class="del" data-list="${key}" data-k="${k}" aria-label="Remove">✕</button></div>
          ${open ? iconGrid(it.e, `data-list="${key}" data-k="${k}"`) : ''}`; }).join('')}
      <div class="row"><input id="add-${key}" maxlength="50" placeholder="${placeholder}"><button class="btn addbtn" data-list="${key}" style="flex:none">Add</button></div>
    </div>`;
  const draw = () => {
    const dk = DAY_KEYS[day], clubs = R.clubs[dk];
    view(`
      <p class="intro">${gu ? `Set up ${esc(S.name)}'s jobs, clubs and what to pack.` : 'Set up your jobs, clubs and what to pack.'} Changes save straight away.</p>
      ${JOB_PARTS.map(p => `<div class="card"><h3>${p.e} ${p.name} jobs</h3>${p.school ? '<p class="muted" style="margin-top:-4px">Only on school days.</p>' : ''}${listEditor(p.id, R.jobs[p.id], 'e.g. Feed the cat')}</div>`).join('')}
      <div class="card">
        <h3>Clubs and activities</h3>
        <div class="tabs">${DAY_KEYS.map((k,i) => `<button class="tab ${i===day?'on':''}" data-d="${i}">${DAY_LONG[i].slice(0,3)}${R.clubs[k].length ? ' ' + R.clubs[k].map(c => c.e).join('') : ''}</button>`).join('')}</div>
        ${clubs.map((c,k) => `
          <div class="clubedit">
            <div class="row">
              <select data-c="${k}" data-f="e" aria-label="Activity" style="flex:1;min-width:0">${CLUB_EMOJI.map(o => `<option value="${o.e}" ${!isCustom(c) && o.e===c.e?'selected':''}>${o.e} ${o.name}</option>`).join('')}<option value="custom" ${isCustom(c)?'selected':''}>✏️ My own club…</option></select>
            </div>
            ${isCustom(c) ? `<label class="lbl">Pick a picture</label>
            <div class="pickpics">${OWN_EMOJI.map(e => `<button class="${e===c.e?'on':''}" data-c="${k}" data-pic="${e}" aria-label="Picture ${e}">${e}</button>`).join('')}</div>` : ''}
            <label class="lbl">Name</label>
            <input data-c="${k}" data-f="name" value="${esc(c.name)}" maxlength="30" placeholder="${isCustom(c) ? 'e.g. Park run' : 'Club name'}">
            <label class="lbl">Time (optional)</label>
            <div class="row timepick">
              <select data-c="${k}" data-t="h" aria-label="Hour"><option value="">No time</option>${[...Array(16)].map((_,n) => { const h = pad(n+6); return `<option value="${h}" ${c.time.slice(0,2)===h?'selected':''}>${fmtHour(n+6)}</option>`; }).join('')}</select>
              <select data-c="${k}" data-t="m" aria-label="Minutes" ${c.time ? '' : 'disabled'}>${['00','15','30','45'].map(m => `<option value="${m}" ${c.time.slice(3)===m?'selected':''}>:${m}</option>`).join('')}</select>
            </div>
            <label class="lbl">What to pack (one per line)</label>
            <textarea data-c="${k}" data-f="bag" placeholder="e.g. Swimming costume">${esc(c.bag.join('\n'))}</textarea>
            <button class="btn ghost block delclub" data-c="${k}" style="margin-top:10px">Remove this club</button>
          </div>`).join('') || `<p class="muted">No clubs on ${DAY_LONG[day]}.</p>`}
        <div class="stack">
          <button class="btn block" id="addclub">+ Add a club on ${DAY_LONG[day]}</button>
          <button class="btn ghost block" id="addown">✏️ Add ${gu ? 'a' : 'my'} own club</button>
        </div>
      </div>
      <div class="card">
        <h3>🏫 School bag</h3>
        <p class="muted" style="margin-top:-4px">Tap the days each thing is needed. Lit-up days are on.</p>
        ${listEditor('school', R.school, 'e.g. Reading book')}
      </div>
      ${gu ? `<div class="card">
        <h3>Start again</h3>
        <button class="btn ghost block" id="resetweek">Go back to the starter week</button>
      </div>` : ''}
      <a class="btn block" href="${back}">Done</a>
    `);
    $$('.tab[data-d]').forEach(b => b.onclick = () => { day = +b.dataset.d; draw(); });
    $$('[data-c][data-f]').forEach(el => el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
      const c = clubs[+el.dataset.c], f = el.dataset.f;
      if (f === 'e' && el.value === 'custom'){
        const was = isCustom(c) ? null : CLUB_EMOJI.find(o => o.e === c.e);
        c.custom = true; c.e = OWN_EMOJI[0];
        if (was && c.name === was.name) c.name = '';
        if (was && c.bag.join('|') === was.bag.join('|')) c.bag = [];
        save(); draw(); focusName(+el.dataset.c); return;
      }
      if (f === 'e'){
        c.custom = false;
        const was = CLUB_EMOJI.find(o => o.e === c.e), now = CLUB_EMOJI.find(o => o.e === el.value);
        c.e = el.value;
        if (now){
          if (!c.name.trim() || (was && c.name === was.name)) c.name = now.name;
          if (!c.bag.length || (was && c.bag.join('|') === was.bag.join('|'))) c.bag = now.bag.slice();
        }
        save(); draw(); return;
      }
      c[f] = f === 'bag' ? el.value.split('\n').map(x => x.trim()).filter(Boolean) : el.value;
      save();
    }));
    $$('[data-t]').forEach(el => el.addEventListener('change', () => {
      const k = +el.dataset.c, c = clubs[k];
      const h = $(`select[data-c="${k}"][data-t="h"]`).value, m = $(`select[data-c="${k}"][data-t="m"]`).value || '00';
      c.time = h ? `${h}:${m}` : ''; save(); draw();
    }));
    $$('[data-pic]').forEach(b => b.onclick = () => { clubs[+b.dataset.c].e = b.dataset.pic; save(); draw(); });
    $('#addown').onclick = () => { clubs.push({ id: uid(), custom: true, e: OWN_EMOJI[0], name: '', time: '', bag: [] }); save(); draw(); focusName(clubs.length - 1); };
    $$('.delclub').forEach(b => b.onclick = () => {
      if (!b.dataset.sure){ b.dataset.sure = '1'; b.textContent = 'Tap again to remove'; return; }
      clubs.splice(+b.dataset.c, 1); save(); draw();
    });
    $('#addclub').onclick = () => { clubs.push({ id: uid(), e: CLUB_EMOJI[0].e, name: CLUB_EMOJI[0].name, time: '', bag: CLUB_EMOJI[0].bag.slice() }); save(); draw();
      const ins = $$('.clubedit input[data-f=name]'); ins[ins.length-1].focus(); };
    const listOf = key => key === 'school' ? R.school : R.jobs[key];
    const partEmoji = { morning:'☀️', after:'🏠', bedtime:'🌙' };
    $$('.dchip').forEach(b => b.onclick = () => {
      const it = listOf(b.dataset.list)[+b.dataset.k], dk = b.dataset.day;
      const all = schoolList(b.dataset.list) ? DAY_KEYS.slice(0,5) : DAY_KEYS;
      let days = it.days ? it.days.slice() : all.slice();
      days = days.includes(dk) ? days.filter(x => x !== dk) : [...days, dk];
      if (all.every(x => days.includes(x))) delete it.days; else it.days = all.filter(x => days.includes(x));
      save(); const y = window.scrollY; draw(); window.scrollTo(0, y);
    });
    $$('.del').forEach(b => b.onclick = () => { picking = null; listOf(b.dataset.list).splice(+b.dataset.k, 1); save(); const y = window.scrollY; draw(); window.scrollTo(0, y); });
    $$('.jicon').forEach(b => b.onclick = () => { const id = b.dataset.list + ':' + b.dataset.k; picking = picking === id ? null : id; const y = window.scrollY; draw(); window.scrollTo(0, y); });
    $$('.ipick').forEach(b => b.onclick = () => { listOf(b.dataset.list)[+b.dataset.k].e = b.dataset.ico; picking = null; save(); const y = window.scrollY; draw(); window.scrollTo(0, y); });
    $$('.addbtn').forEach(b => b.onclick = () => {
      const key = b.dataset.list, inp = $('#add-' + key), v = inp.value.trim();
      if (!v) return;
      listOf(key).push(key === 'school' ? { t: v } : { id: uid(), e: partEmoji[key], t: v });
      save(); const y = window.scrollY; draw(); window.scrollTo(0, y);
    });
    if ($('#resetweek')) $('#resetweek').onclick = e => {
      const b = e.currentTarget;
      if (!b.dataset.sure){ b.dataset.sure = '1'; b.textContent = 'Tap again to replace the week'; return; }
      S.routine = clone(ROUTINE_DEFAULT); save(); weekEdit();
    };
  };
  draw();
}


/* ---------- Pocket money ---------- */
const M = () => S.money;
const minorOf = () => (CURRENCIES.find(c => c.c === F.cur) || CURRENCIES[0]).minor;
function fmtMoney(x){
  x = Math.round(x * 100) / 100;
  const sign = x < 0 ? '−' : '', a = Math.abs(x);
  if (a > 0 && a < 1) return `${sign}${Math.round(a * 100)}${minorOf()}`;
  return `${sign}${F.cur}${a.toFixed(2)}`;
}
const rvOf = key => { const r = M().reviewed[key]; return r && typeof r === 'object' ? r : { paid: [], bonus: false }; };
const balance = () => M().ledger.reduce((t, l) => t + l.amt, 0);
const addLedger = (amt, note, date = dkey()) => M().ledger.unshift({ id: uid(), date, amt: Math.round(amt * 100) / 100, note });

// Weekly pocket money: pay any paydays since we last looked (up to 8 weeks back)
function runAllowance(k){
  const a = k.money.allow, today = dkey();
  if (!a.amt){ a.last = today; return; }
  if (!a.last){ a.last = today; save(); return; }
  if (a.last >= today) return;
  const d = new Date(a.last + 'T12:00'); d.setDate(d.getDate() + 1);
  const end = new Date(today + 'T12:00');
  const due = [];
  while (d <= end){ if (DAY_KEYS[dayIdx(d)] === a.day) due.push(dkey(d)); d.setDate(d.getDate() + 1); }
  due.slice(-8).forEach(date => k.money.ledger.unshift({ id: uid(), date, amt: a.amt, note: 'Weekly pocket money' }));
  a.last = today;
  save();
}

// Days (last 14, up to today) with something for a grown-up to check
function daysToCheck(){
  const out = [];
  for (let n = 0; n > -14; n--){
    const d = addDays(n), key = dkey(d);
    const rv = rvOf(key);
    const jobTicks = (S.ticks[key] || []).filter(t => t.startsWith('job:') && !rv.paid.includes(t.slice(4))).length;
    const gigs = M().gigLog.filter(g => g.date === key && g.status === 'pending').length;
    const unpaidToday = n === 0 && M().rate > 0 && jobsFor(d).some(j => !rv.paid.includes(j.id));
    if (jobTicks || gigs || unpaidToday) out.push({ d, key, jobTicks, gigs });
  }
  return out;
}
const waitingCount = () => daysToCheck().reduce((t, x) => t + x.jobTicks + x.gigs, 0);

const inGoals = () => M().goals.reduce((t, g) => t + g.saved, 0);
const spendable = () => Math.round((balance() - inGoals()) * 100) / 100;
// If money was paid out, take it back out of goals so the numbers always add up
function fixGoals(){
  let over = inGoals() - Math.max(0, balance());
  for (let i = M().goals.length - 1; i >= 0 && over > 0.001; i--){
    const g = M().goals[i], take = Math.min(g.saved, over);
    g.saved = Math.round((g.saved - take) * 100) / 100; over -= take;
  }
}
function moneyBanner(){
  const g = M().goals.length, w = M().wishes.length;
  const sub = [g ? `${g} goal${g === 1 ? '' : 's'}` : '', w ? `${w} on wish list` : ''].filter(Boolean).join(' · ') || 'Earn, save and plan';
  return `<a class="petbanner moneybanner" href="#/money"><span class="pb-pet">🫙</span><span><b>My jar · ${fmtMoney(balance())}</b><small>${sub}</small></span><span class="pb-go">→</span></a>`;
}
const PICS = ['🎨','🧸','📚','🎮','🛼','🎧','⚽','🦖','🎁','🐶','🚲','🎹','🧩','📱','🎟️','🍦','⛺','🪁','🏎️','🦄','🎀','🛹','🔭','🧱'];
const daysAgo = iso => Math.floor((new Date(dkey() + 'T12:00') - new Date(iso + 'T12:00')) / 864e5);
const amtIn = id => Math.round(Math.max(0, +($(id).value) || 0) * 100) / 100;

let moneyTab = 'earned';
function money(){
  setTop('My jar', '#/home', 'money');
  fixGoals(); save();
  const tabs = [['earned','🪙 Earned'],['goals','🎯 Goals'],['wish','💭 Wish list']];
  const top = `
    <div class="card center moneycard">
      <div class="jar" aria-hidden="true">🫙</div>
      <p class="muted" style="margin:0">I have</p>
      <div class="bigmoney">${fmtMoney(balance())}</div>
      <div class="split"><span><b>${fmtMoney(Math.max(0, spendable()))}</b><small>to spend</small></span><span><b>${fmtMoney(inGoals())}</b><small>in my goals</small></span></div>
    </div>
    <div class="tabs">${tabs.map(([id, n]) => `<button class="tab ${moneyTab === id ? 'on' : ''}" data-mt="${id}">${n}</button>`).join('')}</div>`;
  const body = moneyTab === 'goals' ? goalsTab() : moneyTab === 'wish' ? wishTab() : earnedTab();
  view(top + body.html);
  $$('[data-mt]').forEach(b => b.onclick = () => { moneyTab = b.dataset.mt; money(); });
  body.bind();
}

function earnedTab(){
  const today = dkey();
  const waiting = waitingCount();
  const sumSince = n => M().ledger.filter(l => l.amt > 0 && daysAgo(l.date) < n).reduce((t, l) => t + l.amt, 0);
  const ever = M().ledger.filter(l => l.amt > 0).reduce((t, l) => t + l.amt, 0);
  const a = M().allow;
  return { html: `
    <div class="stats">
      <div><b>${fmtMoney(sumSince(7))}</b><small>this week</small></div>
      <div><b>${fmtMoney(sumSince(30))}</b><small>this month</small></div>
      <div><b>${fmtMoney(ever)}</b><small>ever</small></div>
    </div>
    ${a.amt ? `<div class="card soft">📅 Pocket money day: <b>${DAY_LONG[DAY_KEYS.indexOf(a.day)]}</b> · ${fmtMoney(a.amt)} a week</div>` : ''}
    ${M().rate ? `<div class="card soft">✅ Each daily job: <b>${fmtMoney(M().rate)}</b>${M().dayBonus ? ` · all done in a day: <b>+${fmtMoney(M().dayBonus)}</b>` : ''}</div>` : ''}
    ${waiting ? `<div class="card soft">⏳ ${waiting} job${waiting === 1 ? '' : 's'} waiting for a grown-up to check</div>` : ''}
    <h3>⭐ Bonus jobs</h3>
    <p class="muted" style="margin-top:-6px">Extra jobs to earn more. Tap "I did it!" and a grown-up will check.</p>
    ${M().gigs.length ? M().gigs.map(x => {
      const log = M().gigLog.find(l => l.gid === x.id && l.date === today);
      const st = !log ? `<button class="buy" data-gig="${x.id}" style="width:auto">I did it!</button>`
        : log.status === 'pending' ? '<span class="tagp wait">⏳ Waiting</span>'
        : log.status === 'paid' ? '<span class="tagp ok">✓ Paid</span>' : '<span class="tagp no">Not this time</span>';
      return `<div class="club"><span class="ce">${x.e}</span><span style="flex:1;min-width:0"><b>${esc(x.t)}</b><small>${fmtMoney(x.pay)}</small></span>${st}</div>`; }).join('')
      : '<div class="card muted center">No bonus jobs yet. Ask a grown-up to choose some!</div>'}
    <h3 style="margin-top:18px">📒 History</h3>
    <div class="card">${M().ledger.slice(0, 20).map(l => `<div class="entry"><span style="flex:1;min-width:0"><b>${esc(l.note)}</b><small>${new Date(l.date + 'T12:00').toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' })}</small></span><b class="${l.amt < 0 ? 'neg' : 'pos'}">${l.amt > 0 ? '+' : ''}${fmtMoney(l.amt)}</b></div>`).join('') || '<p class="muted" style="margin:0">Nothing yet. Do your jobs and a grown-up will check them.</p>'}</div>
    <a class="btn ghost block" href="#/gu/kid?k=${S.id}">🔒 Grown-up check</a>`,
    bind(){
      $$('[data-gig]').forEach(b => b.onclick = () => {
        const x = M().gigs.find(g => g.id === b.dataset.gig);
        M().gigLog.unshift({ id: uid(), gid: x.id, e: x.e, t: x.t, pay: x.pay, date: today, status: 'pending' });
        M().gigLog = M().gigLog.slice(0, 200);
        save(); award(`gig-${x.id}-${today}`, 1, 'Bonus job done!'); money();
      });
    }};
}

function goalsTab(){
  const sp = Math.max(0, spendable());
  return { html: `
    ${M().goals.map(g => { const pct = Math.min(100, Math.round(g.saved / g.amt * 100)), done = g.saved >= g.amt - 0.001;
      return `<div class="card goalc" data-g="${g.id}">
        <div class="gh"><span class="ge">${g.e}</span><span style="flex:1;min-width:0"><b>${esc(g.name)}</b><small>${fmtMoney(g.saved)} of ${fmtMoney(g.amt)}${done ? '' : ` · ${fmtMoney(g.amt - g.saved)} to go`}</small></span><button class="del gdel" aria-label="Delete goal">✕</button></div>
        <div class="progress"><i style="width:${pct}%"></i></div>
        ${done ? `<button class="btn block gbuy">🎉 I've saved enough! I bought it</button>` : `
        <p class="muted" style="margin:0 0 8px;font-size:15px">Move money into this goal:</p>
        <div class="quick">${[0.10, 0.50, 1, 2].map(v => `<button class="qamt" data-v="${v}" ${v > sp + 0.001 ? 'disabled' : ''}>+${fmtMoney(v)}</button>`).join('')}
          <button class="qamt" data-v="all" ${sp <= 0 ? 'disabled' : ''}>All I can</button></div>`}
        ${g.saved > 0 && !done ? '<button class="linkbtn gout">Take money back out</button>' : ''}
      </div>`; }).join('') || '<div class="card muted center">No savings goals yet. What would you like to save up for?</div>'}
    <div class="card">
      <h3>🎯 New savings goal</h3>
      <div class="row"><select id="ge" aria-label="Picture" style="flex:none;width:76px">${PICS.map(e => `<option>${e}</option>`).join('')}</select><input id="gn" maxlength="30" placeholder="e.g. Lego set" style="flex:1;min-width:0"></div>
      <label class="lbl" for="ga">How much does it cost?</label>
      <input id="ga" type="number" inputmode="decimal" min="0" step="0.5" placeholder="8.00">
      <button class="btn block" id="gsave" style="margin-top:12px">Start saving</button>
    </div>
    <div class="card soft"><p style="margin:0">💡 <b>Saving tip:</b> try putting some of every bit of money you earn into a goal. Little and often adds up!</p></div>`,
    bind(){
      const G = el => M().goals.find(g => g.id === el.closest('.goalc').dataset.g);
      $$('.qamt').forEach(b => b.onclick = () => {
        const g = G(b), room = Math.round((g.amt - g.saved) * 100) / 100;
        let v = b.dataset.v === 'all' ? Math.max(0, spendable()) : +b.dataset.v;
        v = Math.min(v, room, Math.max(0, spendable()));
        if (v <= 0) return;
        g.saved = Math.round((g.saved + v) * 100) / 100; save();
        if (g.saved >= g.amt - 0.001){ confetti(); toast(`You've saved enough for ${g.name}! 🎉`); } else toast(`${fmtMoney(v)} saved 🫙`);
        money();
      });
      $$('.gout').forEach(b => b.onclick = () => { const g = G(b); toast(`${fmtMoney(g.saved)} moved back to spending`); g.saved = 0; save(); money(); });
      $$('.gbuy').forEach(b => b.onclick = () => {
        const g = G(b);
        if (!b.dataset.sure){ b.dataset.sure = '1'; b.textContent = 'Tap again if you bought it'; return; }
        addLedger(-g.saved, `Bought: ${g.name}`); M().goals = M().goals.filter(x => x !== g);
        save(); award('goalbuy-' + g.id, 3, 'Saving superstar!'); confetti(); money();
      });
      $$('.gdel').forEach(b => b.onclick = () => {
        if (!b.dataset.sure){ b.dataset.sure = '1'; b.textContent = '?'; toast('Tap ✕ again to delete. The money goes back to spending.'); return; }
        const g = G(b); M().goals = M().goals.filter(x => x !== g); save(); money();
      });
      $('#gsave').onclick = () => {
        const n = $('#gn').value.trim(), a = amtIn('#ga');
        if (!n || !a){ toast('Add a name and how much it costs'); return; }
        M().goals.push({ id: uid(), e: $('#ge').value, name: n, amt: a, saved: 0 }); save();
        award('firstgoal', 2, 'Goal set!'); money();
      };
    }};
}

function wishTab(){
  const sp = Math.max(0, spendable());
  const list = M().wishes.slice().sort((a, b) => b.want - a.want);
  return { html: `
    <div class="card soft"><p style="margin:0">💭 Write down things you'd like. <b>Wait a week</b> before buying. If you still really want it, it's probably a good buy!</p></div>
    ${list.map(w => { const age = daysAgo(w.added), wait = Math.max(0, 7 - age), can = sp >= w.price;
      return `<div class="card wishc" data-w="${w.id}">
        <div class="gh"><span class="ge">${w.e}</span><span style="flex:1;min-width:0"><b>${esc(w.name)}</b><small>${fmtMoney(w.price)} · ${wait ? `⏳ thinking time: ${wait} day${wait === 1 ? '' : 's'} left` : '✓ waited a week'}</small></span><button class="del wdel" aria-label="Remove">✕</button></div>
        <div class="hearts"><span class="muted">How much do I want it?</span>${[1,2,3].map(n => `<button class="hrt ${n <= w.want ? 'on' : ''}" data-n="${n}" aria-label="${n}">${n <= w.want ? '❤️' : '🤍'}</button>`).join('')}</div>
        <div class="row">
          <button class="btn ghost wgoal">🎯 Save for it</button>
          <button class="btn wbuy" ${can ? '' : 'disabled'}>${can ? 'I bought it' : `Need ${fmtMoney(w.price - sp)} more`}</button>
        </div>
      </div>`; }).join('') || '<div class="card muted center">Your wish list is empty.</div>'}
    <div class="card">
      <h3>➕ Add to my wish list</h3>
      <div class="row"><select id="we" aria-label="Picture" style="flex:none;width:76px">${PICS.map(e => `<option>${e}</option>`).join('')}</select><input id="wn" maxlength="30" placeholder="e.g. Football cards" style="flex:1;min-width:0"></div>
      <label class="lbl" for="wp">About how much is it?</label>
      <input id="wp" type="number" inputmode="decimal" min="0" step="0.5" placeholder="3.50">
      <button class="btn block" id="wsave" style="margin-top:12px">Add to wish list</button>
    </div>`,
    bind(){
      const W = el => M().wishes.find(w => w.id === el.closest('.wishc').dataset.w);
      $$('.hrt').forEach(b => b.onclick = () => { W(b).want = +b.dataset.n; save(); money(); });
      $$('.wgoal').forEach(b => b.onclick = () => {
        const w = W(b); M().goals.push({ id: uid(), e: w.e, name: w.name, amt: w.price, saved: 0 });
        M().wishes = M().wishes.filter(x => x !== w); save(); toast('Moved to your savings goals 🎯'); moneyTab = 'goals'; money();
      });
      $$('.wbuy').forEach(b => b.onclick = () => {
        const w = W(b);
        if (!b.dataset.sure){ b.dataset.sure = '1'; b.textContent = 'Tap again to confirm'; return; }
        addLedger(-w.price, `Bought: ${w.name}`); M().wishes = M().wishes.filter(x => x !== w); save(); toast(`Enjoy your ${w.name}! 🛍️`); money();
      });
      $$('.wdel').forEach(b => b.onclick = () => { const w = W(b); M().wishes = M().wishes.filter(x => x !== w); save(); money(); });
      $('#wsave').onclick = () => {
        const n = $('#wn').value.trim(), p = amtIn('#wp');
        if (!n){ toast('What would you like?'); return; }
        M().wishes.push({ id: uid(), e: $('#we').value, name: n, price: p, want: 2, added: dkey() }); save(); money();
      };
    }};
}


/* ---------- Grown-ups ---------- */
// Family page: every child at a glance, plus shared settings
function family(){
  setTop('Grown-ups', '#/who', 'money', false);
  view(`
    <div class="card soft"><p style="margin:0">Tap a child to check their jobs and set their pay. Children only ever see their own jar.</p></div>
    ${F.kids.map(k => withKid(k, () => { const c = colourOf(k), w = waitingCount(), a = k.money.allow;
      const pay = [k.money.rate ? `${fmtMoney(k.money.rate)} a job` : '', a.amt ? `${fmtMoney(a.amt)} a week` : ''].filter(Boolean).join(' · ') || 'No pay set yet';
      return `<a class="famrow" href="#/gu/kid?k=${k.id}" style="--c:${c.c};--cs:${c.soft}">
        <span class="fr-av">${k.avatar}</span>
        <span class="fr-main"><b>${esc(k.name)}</b><small>${pay}</small></span>
        <span class="fr-side"><b>${fmtMoney(balance())}</b>${w ? `<span class="tagp wait">${w} to check</span>` : '<small>All checked</small>'}</span>
      </a>`; })).join('') || '<div class="card muted center">No children yet. Add one below.</div>'}
    <a class="btn block" href="#/gu/child">+ Add a child</a>

    <div class="card" style="margin-top:16px">
      <h3>💷 Currency</h3>
      <select id="cur">${CURRENCIES.map(c => `<option ${c.c === F.cur ? 'selected' : ''}>${c.c}</option>`).join('')}</select>
    </div>
    <div class="card gu">
      <h3>💡 Tips</h3>
      <ul>
        <li>Each child has their own pay, so older children can earn more per job or have a bigger weekly amount.</li>
        <li>Some families keep everyday jobs unpaid as "family jobs" and only pay for bonus jobs. Set a child's daily jobs to "Nothing" to do that.</li>
        <li>The wish list asks children to wait a week before buying, which helps them tell wants from must-haves.</li>
        <li>Everything is saved only on this device. Clearing the browser's data removes it.</li>
      </ul>
    </div>
    <div class="card">
      <h3>🔒 PIN</h3>
      <button class="btn ghost block" id="newpin">Change PIN</button>
      <a class="btn block" href="#/who" style="margin-top:10px">Lock and go to children</a>
    </div>
    <div class="card gu">
      <h3>Reset</h3>
      <p>Removes every child, their jobs, money records and pets from this device.</p>
      <button class="btn ghost block" id="reset">Reset everything</button>
    </div>
  `);
  $('#cur').onchange = e => { F.cur = e.target.value; save(); family(); };
  $('#newpin').onclick = () => { F.pin = ''; save(); parentUnlocked = false; route(); };
  $('#reset').onclick = e => {
    const b = e.currentTarget;
    if (!b.dataset.sure){ b.dataset.sure = '1'; b.textContent = 'Tap again to delete everything'; return; }
    try { localStorage.removeItem(KEY); } catch(err){}
    F = { pin:'', cur:'£', kids:[], current:null }; S = null; parentUnlocked = false;
    location.hash = '#/welcome'; route();
  };
}

// Add or edit a child
function childForm(params){
  const k = params.get('k') ? kidById(params.get('k')) : null;
  setTop(k ? `Edit ${k.name}` : 'Add a child', k ? `#/gu/kid?k=${k.id}` : '#/gu', 'money', false);
  const taken = F.kids.filter(x => x !== k).map(x => x.colour);
  let av = k ? k.avatar : AVATARS.find(a => !F.kids.some(x => x.avatar === a)) || AVATARS[0];
  let col = k ? k.colour : (COLOURS.find(c => !taken.includes(c.id)) || COLOURS[0]).id;
  view(`
    ${!F.kids.length ? '<div class="card soft"><p style="margin:0">Add your first child. You can add brothers and sisters straight after.</p></div>' : ''}
    <div class="card">
      <label class="lbl" for="nm" style="margin-top:0">Name</label>
      <input id="nm" maxlength="20" placeholder="A nickname is fine" value="${esc(k ? k.name : '')}" autocomplete="off">
      <label class="lbl">Picture</label>
      <div class="chips" id="av">${AVATARS.map(a => `<button class="chip ${a===av?'on':''}" data-a="${a}" aria-label="${a}"><span class="e">${a}</span></button>`).join('')}</div>
      <label class="lbl">Colour</label>
      <div class="swatches" id="col">${COLOURS.map(c => `<button class="sw ${c.id===col?'on':''}" data-c="${c.id}" style="--c:${c.c}" aria-label="${c.name}">${taken.includes(c.id) ? '<small>used</small>' : ''}</button>`).join('')}</div>
    </div>
    <button class="btn block" id="go">${k ? 'Save' : 'Add child'}</button>
    ${k ? `<div class="card gu" style="margin-top:16px"><h3>Remove ${esc(k.name)}</h3><p>Deletes ${esc(k.name)}'s jobs, money records, goals and pet from this device.</p><button class="btn ghost block" id="del">Remove ${esc(k.name)}</button></div>` : ''}
  `);
  $$('#av .chip').forEach(b => b.onclick = () => { av = b.dataset.a; $$('#av .chip').forEach(x => x.classList.toggle('on', x === b)); });
  $$('#col .sw').forEach(b => b.onclick = () => { col = b.dataset.c; $$('#col .sw').forEach(x => x.classList.toggle('on', x === b)); });
  $('#go').onclick = () => {
    const n = $('#nm').value.trim();
    if (!n){ toast('Type a name first'); return; }
    if (k){ Object.assign(k, { name:n, avatar:av, colour:col }); save(); toast('Saved'); location.hash = `#/gu/kid?k=${k.id}`; return; }
    const kid = fixKid({ id: uid(), name: n, avatar: av, colour: col });
    F.kids.push(kid); save(); toast(`${n} added 🎉`);
    location.hash = `#/gu/kid?k=${kid.id}&new=1`;
  };
  if ($('#del')) $('#del').onclick = e => {
    const b = e.currentTarget;
    if (!b.dataset.sure){ b.dataset.sure = '1'; b.textContent = `Tap again to remove ${k.name}`; return; }
    F.kids = F.kids.filter(x => x !== k); if (F.current === k.id) F.current = null;
    save(); toast(`${k.name} removed`); location.hash = '#/gu';
  };
}

// One child: check jobs, pay settings, bonus jobs, money in and out
function moneyParent(params){
  setTop(S.name, '#/gu', 'money', false);
  const isNew = params && params.get('new');
  const payOpts = (sel, steps = PAY_STEPS) => steps.map(v => `<option value="${v}" ${Math.abs(v - sel) < 0.001 ? 'selected' : ''}>${v ? fmtMoney(v) : 'Nothing'}</option>`).join('');
  const chosen = new Set(M().gigs.map(g => g.t));
  const nm = esc(S.name);
  let gpick = null;
  const draw = () => {
    const days = daysToCheck(), a = M().allow, c = colourOf(S);
    view(`
      <div class="kidhead" style="--c:${c.c};--cs:${c.soft}"><span class="fr-av">${S.avatar}</span><span style="flex:1;min-width:0"><b>${nm}</b><small>Jar: ${fmtMoney(balance())}</small></span><a class="btn ghost" href="#/gu/child?k=${S.id}" style="min-height:44px;padding:8px 14px;font-size:15px">✏️ Edit</a></div>
      ${isNew ? `<div class="card soft"><p style="margin:0"><b>${nm} is set up.</b> Choose their pay below, and look at their week. Then add any brothers or sisters from the Grown-ups page.</p></div>` : ''}
      ${days.length ? `<div class="card soft"><p style="margin:0">Check what ${nm} has ticked off. Untick anything that wasn't really done, then tap <b>Approve</b> to add it to their jar.</p></div>` : ''}
      ${days.map(x => {
        const rv = rvOf(x.key), jobs = jobsFor(x.d).filter(j => !rv.paid.includes(j.id)), ticks = S.ticks[x.key] || [];
        const gigs = M().gigLog.filter(g => g.date === x.key && g.status === 'pending');
        return `<div class="card review" data-date="${x.key}">
          <h3>${x.key === dkey() ? 'Today' : x.d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'short' })}</h3>
          ${rv.paid.length ? `<p class="muted" style="margin:0 0 6px">Already paid for ${rv.paid.length} job${rv.paid.length === 1 ? '' : 's'} this day ✓</p>` : ''}
          ${jobs.length ? `<p class="grp">Daily jobs · ${fmtMoney(M().rate)} each</p>${jobs.map(j => `<label class="rv"><input type="checkbox" data-job="${j.id}" ${ticks.includes('job:' + j.id) ? 'checked' : ''}><span>${j.e} ${esc(j.t)}</span></label>`).join('')}` : ''}
          ${gigs.length ? `<p class="grp">Bonus jobs</p>${gigs.map(g => `<label class="rv"><input type="checkbox" data-glog="${g.id}" checked><span>${g.e} ${esc(g.t)}</span><b>${fmtMoney(g.pay)}</b></label>`).join('')}` : ''}
          <p class="paysum"></p>
          <button class="btn block approve">Approve</button>
        </div>`; }).join('') || `<div class="card muted center">Nothing of ${nm}'s to check right now.</div>`}

      <div class="card">
        <h3>💷 ${nm}'s pay</h3>
        <label class="lbl" for="allow" style="margin-top:0">Weekly pocket money</label>
        <div class="row"><select id="allow" style="flex:1;min-width:0">${payOpts(a.amt, ALLOWANCE_STEPS)}</select>
          <select id="aday" style="flex:1;min-width:0" ${a.amt ? '' : 'disabled'} aria-label="Pay day">${DAY_KEYS.map((d, i) => `<option value="${d}" ${d === a.day ? 'selected' : ''}>on ${DAY_LONG[i]}s</option>`).join('')}</select></div>
        <p class="muted" style="margin:6px 0 0;font-size:15px">Added to the jar automatically each week.</p>
        <label class="lbl" for="rate">Each daily job pays</label>
        <select id="rate">${payOpts(M().rate)}</select>
        <label class="lbl" for="bonus">Extra for doing every job that day</label>
        <select id="bonus">${payOpts(M().dayBonus)}</select>
        <p class="muted" style="margin:10px 0 0;font-size:15px">Tip: to pay for bonus jobs only, set daily jobs and the extra to "Nothing".</p>
      </div>

      <div class="card">
        <h3>📅 ${nm}'s week</h3>
        <p class="muted" style="margin-top:-4px">Daily jobs, clubs and what to pack.</p>
        <a class="btn ghost block" href="#/gu/week?k=${S.id}">✏️ Set up ${nm}'s week</a>
        <label class="rv" style="border:0;margin-top:8px"><input type="checkbox" id="canedit" ${S.canEdit ? 'checked' : ''}><span>Let ${nm} change their own week</span></label>
      </div>

      <div class="card">
        <h3>⭐ ${nm}'s bonus jobs</h3>
        ${M().gigs.map((g, k) => `<div class="erow" style="align-items:center"><button class="jicon ${gpick === k ? 'on' : ''}" data-gi="${k}" aria-label="Change picture for ${esc(g.t)}">${g.e}</button><span style="flex:1;min-width:0">${esc(g.t)}</span>
          <input class="payin" type="number" inputmode="decimal" min="0" step="0.05" value="${g.pay.toFixed(2)}" data-k="${k}" aria-label="Pay">
          <button class="del" data-gk="${k}" aria-label="Remove">✕</button></div>${gpick === k ? iconGrid(g.e, `data-gi="${k}"`) : ''}`).join('') || '<p class="muted">None chosen yet. Add some below.</p>'}
        ${F.kids.length > 1 && M().gigs.length ? `<button class="btn ghost block" id="copygigs" style="margin-top:12px">Copy these to ${F.kids.length > 2 ? 'the other children' : esc(F.kids.find(x => x !== S).name)}</button>` : ''}
        <p class="grp" style="margin-top:14px">Add your own</p>
        <div class="row"><input id="gt" maxlength="50" placeholder="e.g. Clean the guinea pig hutch" style="flex:1;min-width:0"><input id="gp" class="payin" type="number" inputmode="decimal" min="0" step="0.05" placeholder="0.50" aria-label="Pay"></div>
        <button class="btn block" id="gadd" style="margin-top:10px">Add bonus job</button>
      </div>

      <div class="card">
        <h3>💡 Ideas for bonus jobs</h3>
        <p class="muted" style="margin-top:-4px">Tap + to add one for ${nm}. You can change the price after.</p>
        ${GIG_SUGGESTIONS.map((c, ci) => `<p class="grp">${c.cat}</p>${c.list.map((g, gi) => `<div class="erow" style="align-items:center"><span style="flex:1;min-width:0">${g.e} ${esc(g.t)} <small class="muted">${fmtMoney(g.pay)}</small></span>
          ${chosen.has(g.t) ? '<span class="tagp ok">Added</span>' : `<button class="addgig" data-ci="${ci}" data-gi="${gi}" aria-label="Add">+</button>`}</div>`).join('')}`).join('')}
      </div>

      <div class="card">
        <h3>📒 Money in and out</h3>
        <p class="muted" style="margin-top:-4px">${nm}'s jar: <b>${fmtMoney(balance())}</b></p>
        <div class="row"><input id="adjamt" class="payin" type="number" inputmode="decimal" min="0" step="0.05" placeholder="1.00" aria-label="Amount"><input id="adjnote" maxlength="40" placeholder="What for?" style="flex:1;min-width:0"></div>
        <div class="row" style="margin-top:10px"><button class="btn ghost" id="adjout">− Paid out / spent</button><button class="btn" id="adjin">+ Add money</button></div>
      </div>
      <a class="btn ghost block" href="#/gu">← All children</a>
    `);
    // live pay totals
    const sums = () => $$('.review').forEach(card => {
      const key = card.dataset.date, jobs = $$('[data-job]', card), on = jobs.filter(c => c.checked).length;
      const gigTotal = $$('[data-glog]', card).filter(c => c.checked).reduce((t, c) => t + M().gigLog.find(g => g.id === c.dataset.glog).pay, 0);
      const d = new Date(key + 'T12:00'), rv = rvOf(key);
      const all = jobsFor(d).length && rv.paid.length + on >= jobsFor(d).length && !rv.bonus;
      const total = on * M().rate + (all ? M().dayBonus : 0) + gigTotal;
      card.querySelector('.paysum').innerHTML = `${on} of ${jobs.length} job${jobs.length === 1 ? '' : 's'}${all && M().dayBonus ? ` + ${fmtMoney(M().dayBonus)} all-done bonus` : ''}${gigTotal ? ` + ${fmtMoney(gigTotal)} bonus jobs` : ''} = <b>${fmtMoney(total)}</b>`;
      card.querySelector('.approve').dataset.total = total;
    });
    sums();
    $$('.review input').forEach(c => c.onchange = sums);
    $$('.approve').forEach(b => b.onclick = () => {
      const card = b.closest('.review'), key = card.dataset.date;
      // the grown-up's checks become the record for that day
      const rv = rvOf(key), d = new Date(key + 'T12:00');
      const ticks = (S.ticks[key] || []).filter(t => !t.startsWith('job:') || rv.paid.includes(t.slice(4)));
      $$('[data-job]', card).forEach(c => { if (c.checked){ ticks.push('job:' + c.dataset.job); rv.paid.push(c.dataset.job); } });
      S.ticks[key] = ticks;
      if (jobsFor(d).every(j => rv.paid.includes(j.id))) rv.bonus = true;
      $$('[data-glog]', card).forEach(c => { M().gigLog.find(g => g.id === c.dataset.glog).status = c.checked ? 'paid' : 'declined'; });
      const total = +b.dataset.total;
      if (total > 0) addLedger(total, key === dkey() ? 'Jobs today' : 'Jobs', key);
      M().reviewed[key] = rv;
      save(); toast(total > 0 ? `${fmtMoney(total)} added to ${S.name}'s jar 🫙` : 'Checked ✓'); draw();
    });
    $('#allow').onchange = e => {
      const v = +e.target.value;
      // Starting weekly money: count from yesterday so today pays if it's the pay day
      if (!a.amt && v){ a.last = dkey(addDays(-1)); a.start = dkey(); }
      a.amt = v; runAllowance(S); save(); draw();
    };
    $('#aday').onchange = e => {
      a.day = e.target.value;
      // Just set up today? Re-work out today's payment so picking today's day pays now (and only once)
      if (a.start === dkey()){
        M().ledger = M().ledger.filter(l => !(l.note === 'Weekly pocket money' && l.date === dkey()));
        a.last = dkey(addDays(-1)); runAllowance(S); fixGoals();
      }
      save(); draw(); toast(`Pocket money day: ${DAY_LONG[DAY_KEYS.indexOf(a.day)]}`);
    };
    $('#rate').onchange = e => { M().rate = +e.target.value; save(); draw(); };
    $('#bonus').onchange = e => { M().dayBonus = +e.target.value; save(); draw(); };
    $('#canedit').onchange = e => { S.canEdit = e.target.checked; save(); };
    $$('.payin[data-k]').forEach(i => i.onchange = () => { const v = Math.max(0, +i.value || 0); M().gigs[+i.dataset.k].pay = Math.round(v * 100) / 100; save(); });
    $$('.jicon[data-gi]').forEach(b => b.onclick = () => { gpick = gpick === +b.dataset.gi ? null : +b.dataset.gi; const y = scrollY; draw(); scrollTo(0, y); });
    $$('.ipick[data-gi]').forEach(b => b.onclick = () => { M().gigs[+b.dataset.gi].e = b.dataset.ico; gpick = null; save(); const y = scrollY; draw(); scrollTo(0, y); });
    $$('[data-gk]').forEach(b => b.onclick = () => { gpick = null; chosen.delete(M().gigs[+b.dataset.gk].t); M().gigs.splice(+b.dataset.gk, 1); save(); const y = scrollY; draw(); scrollTo(0, y); });
    if ($('#copygigs')) $('#copygigs').onclick = () => {
      let n = 0;
      F.kids.filter(x => x !== S).forEach(x => M().gigs.forEach(g => { if (!x.money.gigs.some(y => y.t === g.t)){ x.money.gigs.push({ ...g, id: uid() }); n++; } }));
      save(); toast(n ? `Copied ${n} bonus job${n === 1 ? '' : 's'}` : 'They already have these');
    };
    $$('.addgig').forEach(b => b.onclick = () => {
      const g = GIG_SUGGESTIONS[+b.dataset.ci].list[+b.dataset.gi];
      M().gigs.push({ id: uid(), e: g.e, t: g.t, pay: g.pay }); chosen.add(g.t); save();
      toast(`Added: ${g.t}`); const y = scrollY; draw(); scrollTo(0, y);
    });
    $('#gadd').onclick = () => {
      const t = $('#gt').value.trim(), v = Math.max(0, +$('#gp').value || 0);
      if (!t){ toast('Type the job first'); return; }
      M().gigs.push({ id: uid(), e:'⭐', t, pay: Math.round(v * 100) / 100 }); chosen.add(t); save(); draw();
    };
    const adj = sign => {
      const v = Math.abs(+$('#adjamt').value || 0), note = $('#adjnote').value.trim();
      if (!v){ toast('Type an amount first'); return; }
      addLedger(sign * v, note || (sign > 0 ? 'Money added' : 'Paid out')); fixGoals(); save(); toast('Saved'); draw();
    };
    $('#adjin').onclick = () => adj(1);
    $('#adjout').onclick = () => adj(-1);
  };
  draw();
}

function parentGate(next){
  const setting = !F.pin;
  setTop('Grown-ups', F.kids.length ? '#/who' : '#/welcome', 'money', false);
  view(`
    <div class="bigemoji">🔒</div>
    <h2 class="center">${setting ? 'Choose a grown-up PIN' : 'Grown-ups only'}</h2>
    <p class="intro center">${setting ? 'Pick 4 numbers. You\'ll use them to check jobs and change pay for every child.' : 'Type the 4-number PIN.'}</p>
    <input id="pin" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="••••" style="text-align:center;font-size:28px;letter-spacing:10px">
    <button class="btn block" id="go" style="margin-top:12px">${setting ? 'Save PIN' : 'Unlock'}</button>
    ${setting ? '' : '<button class="btn ghost block" id="forgot" style="margin-top:10px">Forgot the PIN?</button>'}
    <div id="fg"></div>
  `);
  const go = () => {
    const v = $('#pin').value.trim();
    if (!/^\d{4}$/.test(v)){ toast('Use 4 numbers'); return; }
    if (setting){ F.pin = v; save(); parentUnlocked = true; toast('PIN saved'); next(); }
    else if (v === F.pin){ parentUnlocked = true; next(); }
    else { toast('That PIN isn\'t right'); $('#pin').value = ''; }
  };
  $('#go').onclick = go;
  $('#pin').onkeydown = e => { if (e.key === 'Enter') go(); };
  if ($('#forgot')) $('#forgot').onclick = () => {
    const a = 13 + Math.floor(Math.random() * 12), b = 13 + Math.floor(Math.random() * 12);
    $('#fg').innerHTML = `<div class="card" style="margin-top:14px"><p>Grown-up check: what is <b>${a} × ${b}</b>?</p>
      <div class="row"><input id="fga" inputmode="numeric" maxlength="4" style="flex:1;min-width:0"><button class="btn" id="fgo" style="flex:none">Reset PIN</button></div></div>`;
    $('#fgo').onclick = () => { if (+$('#fga').value === a * b){ F.pin = ''; save(); parentGate(next); } else toast('Not quite. Try again'); };
  };
}

/* ---------- Start ---------- */
route();
