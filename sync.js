/* Jar Stars – family sync.
   The family's data lives in one file (family.json) in a PRIVATE GitHub repo.
   Each device keeps its own copy and pushes / pulls changes through the GitHub API.
   Devices join with a sign-in link + family password: the link holds the GitHub token
   locked (AES-GCM) with a key made from the password, so the link alone is useless. */

const Sync = (() => {
  const DEV = 'jarstars-device';   // { repo, token, path, link } on this device only
  const ST = 'jarstars-sync';      // { sha, base, dirty } last synced copy, for merging
  const API = 'https://api.github.com';
  let dev = read(DEV), st = read(ST) || { sha: null, base: null, dirty: false };
  let pushT = null, busy = false, again = false, pollT = null;
  let status = 'off', lastTouch = 0, pendingRedraw = false;
  let hooks = { get: () => ({}), apply: () => {}, redraw: () => {} };

  function read(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } }
  function write(k, v){ try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }

  /* ---------- small helpers ---------- */
  const te = new TextEncoder(), td = new TextDecoder();
  const b64 = bytes => { let s = ''; bytes.forEach(b => s += String.fromCharCode(b)); return btoa(s); };
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
  const b64url = bytes => b64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const unb64url = s => unb64(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  const jsonEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const clone = o => o === undefined ? undefined : JSON.parse(JSON.stringify(o));
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

  /* ---------- the family password lock ---------- */
  async function keyFrom(pw, salt){
    const base = await crypto.subtle.importKey('raw', te.encode(pw), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 310000, hash: 'SHA-256' }, base,
      { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async function lock(obj, pw){
    const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    const c = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await keyFrom(pw, salt), te.encode(JSON.stringify(obj)));
    return '1.' + b64url(salt) + '.' + b64url(iv) + '.' + b64url(new Uint8Array(c));
  }
  async function unlock(blob, pw){
    const [v, s, i, c] = blob.split('.');
    if (v !== '1' || !c) throw new Error('bad-link');
    try {
      const p = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64url(i) }, await keyFrom(pw, unb64url(s)), unb64url(c));
      return JSON.parse(td.decode(p));
    } catch(e){ throw new Error('wrong-password'); }
  }

  /* ---------- GitHub ---------- */
  function gh(cfg, path, opts = {}){
    return fetch(API + path, { ...opts, cache: 'no-store', headers: {
      Authorization: 'Bearer ' + cfg.token, Accept: 'application/vnd.github+json',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}) } });
  }
  const filePath = cfg => `/repos/${cfg.repo}/contents/${encodeURIComponent(cfg.path || 'family.json')}`;
  async function getFile(cfg){
    const r = await gh(cfg, filePath(cfg));
    if (r.status === 404) return { sha: null, data: null };
    if (!r.ok) throw new Error('http-' + r.status);
    const j = await r.json();
    return { sha: j.sha, data: JSON.parse(td.decode(unb64((j.content || '').replace(/\s/g, '')))) };
  }
  async function putFile(cfg, data, sha){
    const body = { message: 'Jar Stars update', content: b64(te.encode(JSON.stringify(data, null, 1))) };
    if (sha) body.sha = sha;
    const r = await gh(cfg, filePath(cfg), { method: 'PUT', body: JSON.stringify(body) });
    if (r.status === 409 || r.status === 422) return { conflict: true };
    if (!r.ok) throw new Error('http-' + r.status);
    return { sha: (await r.json()).content.sha };
  }
  // Check the repo and token before using them
  async function check(cfg){
    let r;
    try { r = await gh(cfg, `/repos/${cfg.repo}`); } catch(e){ throw new Error('offline'); }
    if (r.status === 401) throw new Error('bad-token');
    if (r.status === 404 || r.status === 403) throw new Error('no-repo');
    if (!r.ok) throw new Error('http-' + r.status);
    const j = await r.json();
    if (!j.private) throw new Error('public-repo');
    return j;
  }

  /* ---------- merging two devices' changes ---------- */
  // base = last copy both sides agreed on; mine / theirs = the two newer copies.
  const COUNTERS = new Set(['stars', 'spent', 'saved']);
  function merge(b, l, r, key, parent){
    if (jsonEq(l, b)) return clone(r);
    if (jsonEq(r, b) || jsonEq(l, r)) return clone(l);
    if (l === undefined) return clone(r);      // one side deleted, other changed: keep the change
    if (r === undefined) return clone(l);
    if (isObj(l) && isObj(r)){
      const bo = isObj(b) ? b : {}, out = {};
      new Set([...Object.keys(l), ...Object.keys(r)]).forEach(k => {
        const v = (k in l) && (k in r) ? merge(bo[k], l[k], r[k], k, key)
          : (k in l) ? ((k in bo) && jsonEq(l[k], bo[k]) ? undefined : clone(l[k]))      // they deleted it
          : ((k in bo) && jsonEq(r[k], bo[k]) ? undefined : clone(r[k]));                // I deleted it
        if (v !== undefined) out[k] = v;
      });
      return out;
    }
    if (Array.isArray(l) && Array.isArray(r)){
      const ba = Array.isArray(b) ? b : [];
      const all = [...ba, ...l, ...r];
      if (all.length && all.every(x => isObj(x) && x.id !== undefined)){
        const byId = a => new Map(a.map(x => [x.id, x]));
        const B = byId(ba), L = byId(l), R = byId(r);
        const mine = l.filter(x => !B.has(x.id) && !R.has(x.id));   // things I added
        const kept = r.filter(x => !(B.has(x.id) && !L.has(x.id)))  // drop what I deleted
          .map(x => L.has(x.id) ? merge(B.get(x.id), L.get(x.id), x) : clone(x));
        const firstOld = l.findIndex(x => B.has(x.id));
        const front = mine.filter(x => firstOld === -1 || l.indexOf(x) < firstOld);
        return [...front.map(clone), ...kept, ...mine.filter(x => !front.includes(x)).map(clone)];
      }
      if (all.every(x => typeof x !== 'object')){
        const has = (a, x) => a.includes(x);
        return [...r.filter(x => !(has(ba, x) && !has(l, x))), ...l.filter(x => !has(ba, x) && !has(r, x))];
      }
      return clone(l);
    }
    if (typeof l === 'number' && typeof r === 'number' && typeof b === 'number' && (COUNTERS.has(key) || parent === 'food'))
      return Math.round((r + l - b) * 100) / 100;
    return clone(l);
  }

  /* ---------- pushing and pulling ---------- */
  function setStatus(s){
    status = s;
    const el = document.getElementById('sync');
    if (!el) return;
    el.hidden = !dev;
    el.textContent = { ok: '☁️', saving: '🔄', offline: '⚠️', error: '⚠️' }[s] || '';
    el.title = { ok: 'Saved for the whole family', saving: 'Saving…', offline: 'No internet. Changes will be saved later', error: 'Can\'t reach the family data. A grown-up may need to sign in again' }[s] || '';
  }
  const idle = () => Date.now() - lastTouch > 15000 && !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement || {}).tagName);
  function saveState(){ write(ST, st); }

  function changed(){
    if (!dev) return;
    st.dirty = true; saveState();
    clearTimeout(pushT); pushT = setTimeout(push, 1500);
    setStatus('saving');
  }

  async function push(){
    if (!dev) return;
    if (busy){ again = true; return; }
    busy = true;
    try {
      for (let tries = 0; tries < 5; tries++){
        const mine = hooks.get(), snap = JSON.stringify(mine);
        if (st.sha && jsonEq(mine, st.base)){ st.dirty = false; saveState(); break; }   // nothing new to save
        const res = await putFile(dev, mine, st.sha);
        if (res.conflict){
          // someone else saved first: fetch theirs, merge, try again
          const remote = await getFile(dev);
          const merged = remote.data ? merge(st.base, hooks.get(), remote.data) : hooks.get();
          hooks.apply(merged); st.sha = remote.sha; st.base = remote.data; saveState();
          pendingRedraw = true;
          continue;
        }
        st.sha = res.sha; st.base = JSON.parse(snap);
        st.dirty = JSON.stringify(hooks.get()) !== snap; saveState();
        break;
      }
      setStatus(st.dirty ? 'saving' : 'ok');
    } catch(e){ setStatus(e.message === 'http-401' || e.message === 'http-403' || e.message === 'http-404' ? 'error' : 'offline'); }
    busy = false;
    if (pendingRedraw && idle()){ pendingRedraw = false; hooks.redraw(); }
    if (again || st.dirty){ again = false; clearTimeout(pushT); pushT = setTimeout(push, 1500); }
  }

  async function pull(force){
    if (!dev || busy) return;
    if (!force && !idle()){ return; }
    busy = true;
    try {
      const remote = await getFile(dev);
      if (!remote.data){ busy = false; st.dirty = true; push(); return; }
      if (remote.sha !== st.sha){
        const merged = st.dirty ? merge(st.base, hooks.get(), remote.data) : remote.data;
        hooks.apply(merged);
        st.dirty = !jsonEq(merged, remote.data);
        st.sha = remote.sha; st.base = remote.data; saveState();
        if (idle()) hooks.redraw(); else pendingRedraw = true;
      }
      setStatus(st.dirty ? 'saving' : 'ok');
    } catch(e){ setStatus(e.message === 'http-401' || e.message === 'http-403' ? 'error' : 'offline'); }
    busy = false;
    if (st.dirty) push();
  }

  function startPolling(){
    clearInterval(pollT);
    if (!dev) return;
    pollT = setInterval(() => { if (document.visibilityState === 'visible') pull(); }, 20000);
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pull(true); });
  window.addEventListener('online', () => pull(true));
  ['pointerdown', 'keydown'].forEach(ev => addEventListener(ev, () => { lastTouch = Date.now(); }, true));
  // redraw once the person stops tapping, if newer data came in meanwhile
  setInterval(() => { if (pendingRedraw && idle()){ pendingRedraw = false; hooks.redraw(); } }, 5000);

  /* ---------- connecting a device ---------- */
  // mode 'remote' = use what's online; 'upload' = replace online with this device's copy
  async function connect(cfg, mode){
    await check(cfg);
    const remote = await getFile(cfg);
    dev = cfg; write(DEV, dev);
    if (remote.data && mode !== 'upload'){
      hooks.apply(remote.data);
      st = { sha: remote.sha, base: remote.data, dirty: false };
    } else {
      st = { sha: remote.sha, base: remote.data, dirty: true };
    }
    saveState(); startPolling();
    if (st.dirty) await push(); else setStatus('ok');
    return remote;
  }
  async function peek(cfg){ await check(cfg); return getFile(cfg); }

  return {
    init(h){ hooks = h; setStatus(dev ? 'ok' : 'off'); if (dev){ startPolling(); pull(true); } },
    get connected(){ return !!dev; },
    get repo(){ return dev && dev.repo; },
    get link(){ return dev && dev.link; },
    get status(){ return status; },
    changed, pull, push, connect, peek, lock, unlock, merge,
    setLink(l){ if (dev){ dev.link = l; write(DEV, dev); } },
    disconnect(){ dev = null; write(DEV, null); st = { sha: null, base: null, dirty: false }; write(ST, null); clearInterval(pollT); setStatus('off'); },
    // patch obj in place so screens holding references keep working
    patch
  };

  function patch(t, s){
    if (Array.isArray(t) && Array.isArray(s)){
      const byId = new Map(t.filter(x => isObj(x) && x.id !== undefined).map(x => [x.id, x]));
      const out = s.map((x, i) => {
        if (isObj(x) && x.id !== undefined && byId.has(x.id)) return patch(byId.get(x.id), x);
        if (isObj(x) && x.id === undefined && isObj(t[i]) && t[i].id === undefined) return patch(t[i], x);
        return clone(x);
      });
      t.length = 0; t.push(...out); return t;
    }
    if (isObj(t) && isObj(s)){
      Object.keys(t).forEach(k => { if (!(k in s)) delete t[k]; });
      Object.keys(s).forEach(k => {
        if ((isObj(t[k]) && isObj(s[k])) || (Array.isArray(t[k]) && Array.isArray(s[k]))) patch(t[k], s[k]);
        else t[k] = clone(s[k]);
      });
      return t;
    }
    return clone(s);
  }
})();
