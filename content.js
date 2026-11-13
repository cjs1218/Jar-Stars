/* Jar Stars – content. Edit the words and lists here without touching app.js. */

/* ---------- Children ---------- */
const AVATARS = ['🦊','🐼','🦁','🐯','🐸','🐙','🦄','🐱','🐶','🐰','🦖','🐧','🦉','🐨','🐝','🚀','⚽','🌟'];

// Each child gets a colour so siblings can spot their own jar at a glance
const COLOURS = [
  { id:'blue',   name:'Blue',   c:'#2f72c8', soft:'#e1edfb' },
  { id:'green',  name:'Green',  c:'#1f8f5f', soft:'#dcf5e8' },
  { id:'purple', name:'Purple', c:'#7c4ddb', soft:'#ede5ff' },
  { id:'orange', name:'Orange', c:'#e07800', soft:'#fff0d9' },
  { id:'red',    name:'Red',    c:'#d6404a', soft:'#ffe3e3' },
  { id:'teal',   name:'Teal',   c:'#14897d', soft:'#d9f4f0' },
  { id:'pink',   name:'Pink',   c:'#d23f86', soft:'#ffe2f0' }
];

const GREETINGS = [
  'Ready to fill your jar?',
  'Every job is a step towards something you want.',
  'Little and often adds up!',
  'Nice to see you!',
  'What will you save up for?',
  'Tick it off, feel proud!'
];

/* ---------- My Pet ---------- */
// Stars earned for trying things can be spent here.
// Deliberately gentle: the pet never gets ill, sad or runs away if nobody visits.

const ADOPT_COST = 5;

const PETS = [
  { id:'kitten',  e:'🐱', name:'Kitten',      fav:'fish' },
  { id:'puppy',   e:'🐶', name:'Puppy',       fav:'bone' },
  { id:'bunny',   e:'🐰', name:'Bunny',       fav:'carrot' },
  { id:'hamster', e:'🐹', name:'Hamster',     fav:'cheese' },
  { id:'fox',     e:'🦊', name:'Fox cub',     fav:'apple' },
  { id:'panda',   e:'🐼', name:'Panda',       fav:'bamboo' },
  { id:'unicorn', e:'🦄', name:'Unicorn',     fav:'strawberry', cost:15 },
  { id:'dragon',  e:'🐲', name:'Baby dragon', fav:'pepper', cost:15 }
];

const PET_NAMES = ['Biscuit','Luna','Pip','Mochi','Sparkle','Coco','Bramble','Pickle','Honey','Star'];

// Homes change the room colours
const HOMES = [
  { id:'box',       e:'📦', name:'Cardboard box',  cost:0,  wall:'#f6e7d4', floor:'#d9b98f' },
  { id:'basket',    e:'🧺', name:'Cosy basket',    cost:8,  wall:'#fde2e4', floor:'#e8c39e' },
  { id:'cottage',   e:'🏡', name:'Little cottage', cost:15, wall:'#e3f1ff', floor:'#c8a27a' },
  { id:'treehouse', e:'🌳', name:'Treehouse',      cost:20, wall:'#dcf3d2', floor:'#a9825a' },
  { id:'beach',     e:'🏖️', name:'Beach hut',      cost:20, wall:'#fff3c4', floor:'#f1d39a' },
  { id:'igloo',     e:'🧊', name:'Snowy igloo',    cost:20, wall:'#e3f6ff', floor:'#f7fbff' },
  { id:'castle',    e:'🏰', name:'Castle',         cost:30, wall:'#ece4ff', floor:'#c6b6e6' }
];

// x / y are % starting positions in the room (children can move things about).
// seat: the pet can sit on it (tap it in the room). sx / sy = where the pet sits.
// art: drawn picture (see ART below) instead of an emoji, for things with no good emoji
const FURNITURE = [
  { id:'plant',   e:'🪴', name:'Plant',         cost:4,  x:7,  y:47 },
  { id:'picture', e:'🖼️', name:'Picture',       cost:5,  x:20, y:30 },
  { id:'clock',   e:'🕰️', name:'Clock',         cost:5,  x:9,  y:17 },
  { id:'window',  e:'🪟', name:'Window',        cost:4,  x:50, y:27, art:'window' },
  { id:'lights',  e:'✨', name:'Fairy lights',  cost:6,  x:50, y:6 },
  { id:'rainbow', e:'🌈', name:'Rainbow',       cost:8,  x:80, y:16 },
  { id:'books',   e:'📚', name:'Bookshelf',     cost:6,  x:88, y:48, art:'bookshelf' },
  { id:'sofa',    e:'🛋️', name:'Sofa',          cost:10, x:25, y:76, seat:true, sx:25, sy:63, say:'Ahh, this sofa is SO comfy! 😌' },
  { id:'bed',     e:'🛏️', name:'Comfy bed',     cost:8,  x:76, y:79, seat:true, sx:80, sy:75, say:'Time for a little snooze… 😴' },
  { id:'flowers', e:'💐', name:'Flowers',       cost:4,  x:88, y:23 },
  { id:'balloon', e:'🎈', name:'Balloon',       cost:3,  x:70, y:40 }
];

// Hand-drawn pictures for furniture with no good emoji
const ART = {
  bookshelf: `<svg viewBox="0 0 100 124" aria-hidden="true">
    <rect x="4" y="2" width="92" height="120" rx="5" fill="#8a5a33"/>
    <rect x="11" y="9" width="78" height="106" fill="#5e3b20"/>
    <g fill="#8a5a33"><rect x="11" y="40" width="78" height="6"/><rect x="11" y="77" width="78" height="6"/></g>
    <g>
      <rect x="15" y="15" width="9" height="25" rx="1.5" fill="#e4572e"/><rect x="25" y="19" width="8" height="21" rx="1.5" fill="#f3c13a"/>
      <rect x="34" y="13" width="10" height="27" rx="1.5" fill="#4f8fe0"/><rect x="45" y="18" width="7" height="22" rx="1.5" fill="#76c06f"/>
      <rect x="57" y="24" width="10" height="16" rx="1.5" fill="#b07ae0" transform="rotate(-18 62 40)"/>
      <rect x="70" y="16" width="9" height="24" rx="1.5" fill="#ff8fb1"/><rect x="80" y="20" width="6" height="20" rx="1.5" fill="#29a8a0"/>
      <rect x="15" y="54" width="8" height="23" rx="1.5" fill="#4f8fe0"/><rect x="24" y="50" width="10" height="27" rx="1.5" fill="#76c06f"/>
      <rect x="35" y="56" width="7" height="21" rx="1.5" fill="#e4572e"/><rect x="43" y="52" width="9" height="25" rx="1.5" fill="#f3c13a"/>
      <circle cx="68" cy="68" r="9" fill="#ffd25c"/><rect x="64" y="58" width="8" height="5" rx="2" fill="#2f9e6a"/>
      <rect x="79" y="53" width="8" height="24" rx="1.5" fill="#b07ae0"/>
      <rect x="15" y="89" width="22" height="9" rx="1.5" fill="#ff8fb1"/><rect x="15" y="98" width="24" height="9" rx="1.5" fill="#4f8fe0"/><rect x="17" y="107" width="20" height="8" rx="1.5" fill="#f3c13a"/>
      <rect x="44" y="90" width="9" height="25" rx="1.5" fill="#29a8a0"/><rect x="54" y="93" width="8" height="22" rx="1.5" fill="#e4572e"/>
      <rect x="63" y="88" width="10" height="27" rx="1.5" fill="#76c06f"/><rect x="74" y="92" width="11" height="23" rx="1.5" fill="#f3c13a"/>
    </g>
    <g fill="#fff" opacity=".35"><rect x="17" y="18" width="2" height="18"/><rect x="36" y="16" width="2" height="21"/><rect x="26" y="53" width="2" height="21"/><rect x="65" y="91" width="2" height="21"/></g>
  </svg>`,
  window: `<svg viewBox="0 0 140 112" aria-hidden="true">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ec8ff"/><stop offset="1" stop-color="#cdeeff"/></linearGradient></defs>
    <rect x="14" y="4" width="112" height="98" rx="8" fill="#fff"/>
    <rect x="21" y="11" width="98" height="84" rx="4" fill="url(#sky)"/>
    <circle cx="96" cy="32" r="11" fill="#ffd25c"/>
    <g fill="#fff"><ellipse cx="45" cy="34" rx="15" ry="8"/><ellipse cx="56" cy="29" rx="11" ry="8"/><ellipse cx="80" cy="64" rx="12" ry="6"/></g>
    <path d="M21 95 Q45 72 70 86 T119 80 V95 Z" fill="#7ccf6b"/>
    <g fill="#fff"><rect x="67" y="11" width="6" height="84"/><rect x="21" y="50" width="98" height="6"/></g>
    <rect x="8" y="98" width="124" height="10" rx="4" fill="#e8dccf"/>
    <path d="M6 2 H34 Q30 40 38 92 Q20 96 6 92 Z" fill="#ff9fb8"/><path d="M134 2 H106 Q110 40 102 92 Q120 96 134 92 Z" fill="#ff9fb8"/>
    <rect x="2" y="0" width="136" height="6" rx="3" fill="#b07a4a"/>
  </svg>`
};

const TOYS = [
  { id:'ball',  e:'⚽', name:'Ball',       cost:3, x:50, y:92, say:'Wheee! Kick it to me!' },
  { id:'yarn',  e:'🧶', name:'Wool ball',  cost:3, x:49, y:78, say:'Ooh, so bouncy and tangly!' },
  { id:'teddy', e:'🧸', name:'Teddy',      cost:5, x:36, y:46, say:'Teddy cuddles are the best!' },
  { id:'yoyo',  e:'🪀', name:'Yo-yo',      cost:4, x:66, y:44, say:'Up and down, up and down!' },
  { id:'kite',  e:'🪁', name:'Kite',       cost:6, x:86, y:10, say:'Let\'s fly it really high!' }
];

const FOOD = [
  { id:'apple',      e:'🍎', name:'Apple',      cost:1 },
  { id:'carrot',     e:'🥕', name:'Carrot',     cost:1 },
  { id:'strawberry', e:'🍓', name:'Strawberry', cost:1 },
  { id:'fish',       e:'🐟', name:'Fish',       cost:2 },
  { id:'bone',       e:'🦴', name:'Bone',       cost:2 },
  { id:'cheese',     e:'🧀', name:'Cheese',     cost:2 },
  { id:'bamboo',     e:'🎋', name:'Bamboo',     cost:2 },
  { id:'pepper',     e:'🌶️', name:'Spicy pepper', cost:2 },
  { id:'cupcake',    e:'🧁', name:'Cupcake treat', cost:3 }
];

// where = where it sits on the pet
const ACCESSORIES = [
  { id:'flower', e:'🌸', name:'Flower',     cost:4,  where:'head' },
  { id:'bow',    e:'🎀', name:'Bow',        cost:5,  where:'head' },
  { id:'shades', e:'🕶️', name:'Sunglasses', cost:6,  where:'face' },
  { id:'scarf',  e:'🧣', name:'Scarf',      cost:6,  where:'neck' },
  { id:'tophat', e:'🎩', name:'Top hat',    cost:8,  where:'head' },
  { id:'cap',    e:'🎓', name:'Clever cap', cost:10, where:'head' },
  { id:'crown',  e:'👑', name:'Crown',      cost:12, where:'head' }
];

const PET_SAYS = [
  'Every job you do counts!',
  'I\'m so proud of you!',
  'You can do hard things.',
  'Mistakes help us learn. Even pets know that!',
  'Saving a little at a time really adds up.',
  'Thank you for looking after me!',
  'You\'re a great helper.',
  'What are you saving up for?'
];

/* ---------- My Week ---------- */
// Starter week for each new child. Everything can be changed in the app ("Change my week").
// Days: mon tue wed thu fri sat sun. School items are packed Mon–Fri.

// Picking a picture fills in the club name and a starter kit list (if those are empty or still the old suggestion)
const CLUB_EMOJI = [
  { e:'🏊', name:'Swimming', bag:['Swimming costume','Towel','Goggles','Hairbrush'] },
  { e:'💃', name:'Dance', bag:['Leotard','Dance shoes','Hair bobble','Water bottle'] },
  { e:'🤸', name:'Gymnastics', bag:['Leotard','Hair bobble','Water bottle'] },
  { e:'⚽', name:'Football', bag:['Football kit','Shin pads','Football boots','Water bottle'] },
  { e:'🏀', name:'Netball', bag:['Netball kit','Trainers','Water bottle'] },
  { e:'🎾', name:'Tennis', bag:['Tennis racket','Trainers','Water bottle'] },
  { e:'🏸', name:'Badminton', bag:['Badminton racket','Trainers','Water bottle'] },
  { e:'🥋', name:'Karate', bag:['Karate suit','Belt','Water bottle'] },
  { e:'🐴', name:'Horse riding', bag:['Riding hat','Jodhpurs','Riding boots','Gloves'] },
  { e:'🛼', name:'Roller skating', bag:['Roller skates','Helmet','Knee pads'] },
  { e:'⛸️', name:'Ice skating', bag:['Gloves','Warm jumper','Hat'] },
  { e:'🏃', name:'Junior parkrun', bag:['parkrun barcode','Trainers','Water bottle'] },
  { e:'👟', name:'PE at school', bag:['PE kit','Trainers','Hair bobble'] },
  { e:'🧘', name:'Yoga', bag:['Comfy clothes','Water bottle'] },
  { e:'🎹', name:'Piano', bag:['Piano book'] },
  { e:'🎻', name:'Violin', bag:['Violin','Music book'] },
  { e:'🎶', name:'Music lesson', bag:['Instrument','Music book'] },
  { e:'🎤', name:'Choir', bag:['Song folder','Water bottle'] },
  { e:'🎭', name:'Drama', bag:['Script','Water bottle'] },
  { e:'🎨', name:'Art club', bag:['Apron'] },
  { e:'🧑‍🍳', name:'Cooking club', bag:['Apron','Container to bring food home'] },
  { e:'♟️', name:'Chess club', bag:[] },
  { e:'📚', name:'Library', bag:['Library book'] },
  { e:'🏉', name:'Rugby', bag:['Rugby kit','Gum shield','Boots','Water bottle'] },
  { e:'🏏', name:'Cricket', bag:['Cricket kit','Bat','Water bottle'] },
  { e:'🚴', name:'Cycling', bag:['Bike helmet','Water bottle'] },
  { e:'💻', name:'Coding club', bag:[] },
  { e:'🧭', name:'Beavers', bag:['Uniform','Subs money'] },
  { e:'🏕️', name:'Cubs', bag:['Uniform','Subs money'] },
  { e:'⚜️', name:'Scouts', bag:['Uniform','Subs money'] },
  { e:'🌈', name:'Rainbows', bag:['Uniform','Subs money'] },
  { e:'🌻', name:'Brownies', bag:['Brownies uniform','Subs money'] },
  { e:'⛪', name:'Church', bag:[] },
  { e:'👵', name:'Visit Grandma', bag:[] },
  { e:'🎉', name:'Party', bag:['Present','Card'] }
];

const ROUTINE_DEFAULT = {
  clubs: { mon:[], tue:[], wed:[], thu:[], fri:[], sat:[], sun:[] },
  school: [{ t:'Reading book & record' }, { t:'Water bottle' }, { t:'Lunchbox' }, { t:'Coat' }],
  // A job or school item with no 'days' happens every day. Add days:['mon','tue',...] to limit it.
  jobs: {
    morning: [
      { id:'j1', e:'🛏️', t:'Make my bed' },
      { id:'j2', e:'👕', t:'Get dressed' },
      { id:'j3', e:'🍽️', t:'Breakfast things in the dishwasher' },
      { id:'j4', e:'🪥', t:'Brush my teeth' },
      { id:'j5', e:'🪮', t:'Brush my hair' }
    ],
    after: [
      { id:'j6', e:'🎒', t:'Unpack my school bag', days:['mon','tue','wed','thu','fri'] },
      { id:'j7', e:'🥪', t:'Lunchbox to the kitchen', days:['mon','tue','wed','thu','fri'] },
      { id:'j8', e:'📖', t:'Reading or homework' }
    ],
    bedtime: [
      { id:'j9',  e:'🧺', t:'Dirty clothes in the wash basket' },
      { id:'j10', e:'👕', t:'Lay out clothes for tomorrow' },
      { id:'j11', e:'🎒', t:'Pack my bag for tomorrow' },
      { id:'j12', e:'🪥', t:'Brush my teeth' }
    ]
  }
};

const JOB_PARTS = [
  { id:'morning', e:'☀️', name:'Morning' },
  { id:'after',   e:'🏠', name:'After school', school:true },  // only on school days
  { id:'bedtime', e:'🌙', name:'Bedtime' }
];

// Pictures to choose from for "My own club"
const OWN_EMOJI = ['⭐','🏃','🚴','🌳','🏞️','🐕','🧗','🎳','🏓','🏐','⛳','🏄','🎣','🎮','🧶','🎸','🥁','🎺','🪴','🐾','🧪','🔭','🏕️','🎬','🧁','🛝','👫','📝','🧩','🫶'];

// Pictures a grown-up or child can pick for a job
const JOB_EMOJI = ['⭐','🛏️','👕','🧦','🪥','🪮','🚿','🛁','🧼','🍽️','🥣','🥪','🎒','📖','✏️','📚','🧺','🧹','🧽','🗑️','♻️','🪴','🌱','🐕','🐈','🐟','🐹','🥕','🧸','🧩','🎹','🎻','⚽','👟','🧥','🚗','🛒','📞','💊','⏰','🌙','☀️','🏠','💪','🫶','🎨'];

/* ---------- Pocket money ---------- */
// Suggested bonus jobs ("gigs") a grown-up can choose from. Prices are only suggestions.
const GIG_SUGGESTIONS = [
  { cat:'Around the house', list:[
    { e:'👕', t:'Fold and put away the washing', pay:0.50 },
    { e:'🧦', t:'Pair up all the socks', pay:0.30 },
    { e:'🧹', t:'Hoover a room', pay:0.50 },
    { e:'🪞', t:'Clean the mirrors', pay:0.30 },
    { e:'🚿', t:'Wipe the bathroom sink', pay:0.40 },
    { e:'♻️', t:'Sort the recycling', pay:0.30 },
    { e:'🛒', t:'Help unpack the shopping', pay:0.30 },
    { e:'🧸', t:'Sort old toys to give to charity', pay:1.00 },
    { e:'🪶', t:'Dust the living room', pay:0.40 },
    { e:'👟', t:'Clean and polish the shoes', pay:0.50 },
    { e:'🚪', t:'Wipe the door handles and light switches', pay:0.30 },
    { e:'🗑️', t:'Help put the bins out (with a grown-up)', pay:0.30 },
    { e:'🚙', t:'Clear the crumbs and rubbish out of the car', pay:0.75 },
    { e:'🪙', t:'Count and sort the coin jar', pay:0.30 }
  ]},
  { cat:'Kitchen', list:[
    { e:'🍽️', t:'Lay and clear the table', pay:0.30 },
    { e:'🧽', t:'Help wash up after dinner', pay:0.50 },
    { e:'🥗', t:'Help cook dinner', pay:0.50 },
    { e:'🧁', t:'Bake something with a grown-up', pay:0.50 },
    { e:'🍳', t:'Make a grown-up breakfast in bed', pay:1.00 },
    { e:'🥡', t:'Empty the dishwasher', pay:0.30 },
    { e:'🧻', t:'Wipe the kitchen table and counters', pay:0.20 },
    { e:'🥪', t:'Make my own packed lunch', pay:0.30 },
    { e:'🍓', t:'Make a fruit salad for pudding', pay:0.50 },
    { e:'📝', t:'Write the shopping list with a grown-up', pay:0.20 },
    { e:'📅', t:'Check the fridge for out-of-date food', pay:0.20 },
    { e:'👩‍🍳', t:'Plan a family meal and help cook it', pay:1.00 }
  ]},
  { cat:'Garden and outdoors', list:[
    { e:'🚗', t:'Help wash the car', pay:1.00 },
    { e:'🍂', t:'Sweep or rake the leaves', pay:1.00 },
    { e:'🌼', t:'Pull up weeds', pay:0.75 },
    { e:'🌱', t:'Water the plants', pay:0.20 },
    { e:'🥕', t:'Plant some seeds and look after them', pay:0.50 },
    { e:'🗑️', t:'Pick up litter on a walk (with gloves)', pay:0.50 },
    { e:'🧹', t:'Sweep the path or patio', pay:0.50 },
    { e:'🚲', t:'Wash the bikes', pay:0.75 },
    { e:'🪑', t:'Wash the garden furniture', pay:0.75 },
    { e:'🐦', t:'Fill up the bird feeder', pay:0.20 },
    { e:'🍎', t:'Pick fruit or vegetables from the garden', pay:0.30 },
    { e:'👚', t:'Bring in the washing from the line and fold it', pay:0.40 }
  ]},
  { cat:'Pets', list:[
    { e:'🐕', t:'Walk the dog with a grown-up', pay:0.50 },
    { e:'🐾', t:'Help clean out the pet\'s cage or bed', pay:1.00 },
    { e:'🥣', t:'Feed the pet without being reminded', pay:0.20 }
  ]},
  { cat:'Learning and kindness', list:[
    { e:'📚', t:'Finish a whole book', pay:1.00 },
    { e:'🧮', t:'15 minutes of times tables', pay:0.30 },
    { e:'✍️', t:'Write a thank-you card', pay:0.30 },
    { e:'🎂', t:'Make a birthday card for family', pay:0.30 },
    { e:'🤝', t:'Help a neighbour (with a grown-up)', pay:1.00 },
    { e:'🎹', t:'15 minutes of extra instrument practice', pay:0.30 },
    { e:'🔤', t:'Learn to spell 10 tricky words', pay:0.30 },
    { e:'🪡', t:'Learn to sew on a button (with a grown-up)', pay:0.50 },
    { e:'📖', t:'Write and illustrate a short story', pay:0.50 },
    { e:'👶', t:'Read a book to a younger brother, sister or cousin', pay:0.30 }
  ]},
  { cat:'My bedroom', list:[
    { e:'🛏️', t:'Change my bed sheets (with help)', pay:0.50 },
    { e:'🧽', t:'Tidy and dust my whole bedroom', pay:0.50 },
    { e:'📚', t:'Sort out my bookshelf', pay:0.30 },
    { e:'👕', t:'Sort clothes that are too small to give away', pay:1.00 },
    { e:'🧩', t:'Check games and puzzles have all their pieces', pay:0.50 }
  ]},
  { cat:'Little business ideas', list:[
    { e:'🔖', t:'Make bookmarks or cards to sell to family', pay:0.50 },
    { e:'📰', t:'Make a family newsletter', pay:0.50 },
    { e:'📱', t:'Teach Grandma or Grandad something on their phone', pay:0.50 },
    { e:'🧽', t:'Wash a neighbour\'s car (with a grown-up)', pay:1.50 },
    { e:'🏷️', t:'Get old toys ready for a car boot sale', pay:1.00 }
  ]}
];

const PAY_STEPS = [0, 0.05, 0.10, 0.15, 0.20, 0.25, 0.50, 1.00];
// Weekly pocket money choices (paid automatically on the chosen day)
const ALLOWANCE_STEPS = [0, 0.50, 1, 1.50, 2, 2.50, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20];
const CURRENCIES = [{ c:'£', minor:'p' }, { c:'€', minor:'c' }, { c:'$', minor:'¢' }];
