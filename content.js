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

// x / y are % positions in the room
const FURNITURE = [
  { id:'plant',   e:'🪴', name:'Plant',         cost:4,  x:9,  y:58 },
  { id:'picture', e:'🖼️', name:'Picture',       cost:5,  x:28, y:22 },
  { id:'clock',   e:'🕰️', name:'Clock',         cost:5,  x:12, y:20 },
  { id:'window',  e:'🪟', name:'Window',        cost:4,  x:50, y:24 },
  { id:'lights',  e:'✨', name:'Fairy lights',  cost:6,  x:50, y:7 },
  { id:'rainbow', e:'🌈', name:'Rainbow',       cost:8,  x:76, y:22 },
  { id:'books',   e:'📚', name:'Bookshelf',     cost:6,  x:91, y:52 },
  { id:'sofa',    e:'🛋️', name:'Sofa',          cost:10, x:18, y:80 },
  { id:'bed',     e:'🛏️', name:'Comfy bed',     cost:8,  x:80, y:82 },
  { id:'flowers', e:'💐', name:'Flowers',       cost:4,  x:94, y:76 },
  { id:'balloon', e:'🎈', name:'Balloon',       cost:3,  x:66, y:12 }
];

const TOYS = [
  { id:'ball',  e:'⚽', name:'Ball',       cost:3, x:38, y:90, say:'Wheee! Kick it to me!' },
  { id:'yarn',  e:'🧶', name:'Wool ball',  cost:3, x:60, y:91, say:'Ooh, so bouncy and tangly!' },
  { id:'teddy', e:'🧸', name:'Teddy',      cost:5, x:32, y:66, say:'Teddy cuddles are the best!' },
  { id:'yoyo',  e:'🪀', name:'Yo-yo',      cost:4, x:67, y:70, say:'Up and down, up and down!' },
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
