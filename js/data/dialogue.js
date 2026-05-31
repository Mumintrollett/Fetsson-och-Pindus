// All spoken dialogue in the game, grouped by trigger key.
// Each value is an array of { who, text } lines fed to the dialogue engine.
export const DLG = {
  intro: [
    { who: 'Pindus',  text: 'Wakey wakey, Fetsson! The sun is shining and the roosters are trying their best!' },
    { who: 'Pindus',  text: "Mrs. Hen promised us her legendary apple pancakes today. I've been up since the moon was still arguing with the horizon." },
    { who: 'Fetsson', text: "Mmm… pancakes… I'm up, I'm up!" },
    { who: 'Pindus',  text: "Oh — something's sticking out of that hay bale over there. Might be worth a look!" },
  ],
  pindus_barn_again: [
    { who: 'Pindus',  text: "Do you think she puts extra honey on the pancakes?" },
    { who: 'Fetsson', text: "She always does. Let's go already!" },
  ],
  hay_bale: [
    { who: 'Fetsson', text: "Oh! There's a sturdy stick buried in the hay." },
    { who: 'Fetsson', text: "I'll take it — you never know when a stick comes in handy." },
  ],
  farmhouse_locked_first: [
    { who: 'Fetsson', text: "Hmm. The farmhouse door is locked." },
    { who: 'Pindus',  text: "Mrs. Hen is a very organised hen. Except when she isn't." },
  ],
  farmhouse_locked_again: [
    { who: 'Fetsson', text: "Still locked. I should explore a bit more." },
  ],
  scarecrow: [
    { who: 'Scarecrow', text: '… … …' },
    { who: 'Fetsson',   text: 'Did… did the scarecrow just speak?' },
    { who: 'Scarecrow', text: 'CREEAK… The little stone man in the garden… he guards what you seek…' },
    { who: 'Pindus',    text: "Cryptic. Deeply cryptic. And yet, somehow, clarifying." },
    { who: 'Fetsson',   text: "Right. Now if only we could get INTO the garden…" },
  ],
  rusty_gate: [
    { who: 'Fetsson', text: "This gate is solid rust. It won't budge." },
  ],
  rusty_gate_hint: [
    { who: 'Fetsson', text: "This gate hasn't moved in years. The hinges are completely seized." },
    { who: 'Pindus',  text: "Iron's greatest weakness is water. Rust, you see, is iron giving up." },
  ],
  gate_open_water: [
    { who: 'Fetsson', text: "Let me pour this water on the rusty hinges…" },
    { who: 'Fetsson', text: "There we go! That loosened things up nicely." },
    { who: 'Pindus',  text: "The garden is open! Water solves everything eventually." },
  ],
  pickup_bucket: [
    { who: 'Fetsson', text: "An old wooden bucket by the well. Might be useful." },
  ],
  well_no_bucket: [
    { who: 'Fetsson', text: "A lovely stone well. The water looks cold and fresh." },
    { who: 'Pindus',  text: "And entirely unreachable without something to put it in." },
  ],
  fill_bucket: [
    { who: 'Fetsson', text: "I'll fill the bucket with well water." },
    { who: 'Pindus',  text: "Cold and clear. Good for many things." },
  ],
  gnome_no_stick: [
    { who: 'Fetsson', text: "I can see something shiny under that gnome, but my hoof can't reach it." },
    { who: 'Pindus',  text: "You need something long and thin. If only you had… a stick!" },
  ],
  gnome_with_stick: [
    { who: 'Fetsson', text: "Let me use this stick to fish under the gnome…" },
    { who: 'Fetsson', text: "Got it!" },
    { who: 'Pindus',  text: "Excellent. The gnome looks mildly offended." },
  ],
  veggies: [
    { who: 'Fetsson', text: "Look at those fat pumpkins! Nearly ready for harvest." },
    { who: 'Pindus',  text: "Mrs. Hen's pumpkin soup is legendary. But first — pancakes!" },
  ],
  open_door: [
    { who: 'Fetsson', text: "The key fits! The door swings open with a welcoming creak." },
    { who: 'Pindus',  text: "I can smell the pancakes from HERE!" },
  ],
  ending: [
    { who: 'Mrs. Hen', text: "Oh! Fetsson, Pindus! There you are! I was starting to worry." },
    { who: 'Fetsson',  text: "We found your spare key, Mrs. Hen! It was under the garden gnome." },
    { who: 'Mrs. Hen', text: "Oh gracious, I accidentally locked myself out earlier and hid the spare key in a hurry. How forgetful of me!" },
    { who: 'Pindus',   text: "No harm done! And those pancakes smell absolutely DIVINE." },
    { who: 'Mrs. Hen', text: "Sit, sit! Apple pancakes with clover honey — you've earned every last bite!" },
    { who: 'Fetsson',  text: "This is the best morning on the farm ever." },
    { who: 'Pindus',   text: "Agreed. I also found three excellent sticks in the garden on the way, so it's a double win for me." },
    { who: 'Mrs. Hen', text: "…You are a very peculiar stick insect, Pindus." },
    { who: 'Pindus',   text: "Thank you! That's the kindest thing anyone's said to me all week." },
  ],

  // ── Post-pancake ──────────────────────────────────────────────
  pancake_push: [
    { who: 'Fetsson', text: "Hmm. They're just out of reach. If I give them a nudge with this stick…" },
    { who: 'Fetsson', text: "Oh! They're sliding — SPLAT." },
    { who: 'Fetsson', text: "Ah well. Five-second rule." },
  ],
  apple_quest: [
    { who: 'Mrs. Hen', text: "Fetsson! You… you knocked my pancakes on the floor!" },
    { who: 'Fetsson',  text: "They still taste incredible! Every single one!" },
    { who: 'Mrs. Hen', text: "…Well, I suppose that's a compliment of sorts. But now I'm completely out of apples." },
    { who: 'Pindus',   text: "The orchard apples are the finest on the farm. But it's past the old bridge and the waterfall cave…" },
    { who: 'Mrs. Hen', text: "Oh, would you two be dears and fetch some? Take this basket. And — the old toolbox in the barn has everything you'll need. The combination is seven. Same as the pancakes you just ate off my floor." },
    { who: 'Pindus',   text: "Seven. Engraved upon my soul." },
  ],

  // ── Barn toolbox ─────────────────────────────────────────────
  toolbox_locked: [
    { who: 'Fetsson', text: "An old toolbox with a combination lock. Three dials." },
    { who: 'Pindus',  text: "Mrs. Hen did mention something about a number…" },
  ],
  toolbox_open: [
    { who: 'Fetsson', text: "Seven. Click! The lock pops." },
    { who: 'Fetsson', text: "A sturdy hammer and a good length of rope. Just what the farm ordered." },
  ],
  toolbox_empty: [
    { who: 'Fetsson', text: "Empty now. I already took everything useful." },
  ],

  // ── Bridge ───────────────────────────────────────────────────
  bridge_intro: [
    { who: 'Pindus',  text: "The old rope bridge! I remember crossing this as a larvae. It was much more structurally sound then." },
    { who: 'Fetsson', text: "Several planks have decided to pursue careers elsewhere. The railing looks suicidal. And that counterweight gate is locked." },
    { who: 'Pindus',  text: "Standard rot. I've seen it happen to sticks." },
    { who: 'Fetsson', text: "One thing at a time." },
  ],
  bridge_planks_pickup: [
    { who: 'Fetsson', text: "A pile of spare planks by the old shed. Could be just what this bridge needs." },
  ],
  bridge_no_tools: [
    { who: 'Fetsson', text: "Several planks are missing. I'd fall straight through into the ravine." },
    { who: 'Pindus',  text: "Tragic end. Undignified." },
  ],
  bridge_need_planks: [
    { who: 'Fetsson', text: "I have a hammer but nothing to actually repair. I'm just a pig carrying a hammer." },
    { who: 'Pindus',  text: "A very well-equipped pig." },
  ],
  bridge_need_hammer: [
    { who: 'Fetsson', text: "I have planks, but planks don't nail themselves." },
    { who: 'Pindus',  text: "That would be a remarkable advance in woodworking." },
  ],
  bridge_fix_floor: [
    { who: 'Fetsson', text: "Planks in, nails down…" },
    { who: 'Fetsson', text: "There. That floor isn't going anywhere." },
    { who: 'Pindus',  text: "Solid as the day it was built! Presumably." },
  ],
  bridge_need_rope: [
    { who: 'Fetsson', text: "The railing is a polite fiction at this point. It's mostly fraying hope." },
    { who: 'Pindus',  text: "I once held a bridge together with six good sticks and sheer willpower." },
    { who: 'Fetsson', text: "That's not helpful, Pindus." },
  ],
  bridge_fix_railing: [
    { who: 'Fetsson', text: "Lash the rope around the posts… pull it taut…" },
    { who: 'Fetsson', text: "That should hold. Bridge is certified Fetsson-proof." },
    { who: 'Pindus',  text: "Now for that gate mechanism." },
  ],
  bridge_mechanism_hint: [
    { who: 'Fetsson', text: "This mechanism controls the gate chain. Those stone blocks on the platform look like they belong somewhere." },
    { who: 'Pindus',  text: "I see a scale. Two pans. Heavy-looking rocks." },
    { who: 'Fetsson', text: "Some kind of counterweight. If we can balance it…" },
    { who: 'Pindus',  text: "The inscriptions on the rocks might be a clue. Just a hunch." },
  ],
  bridge_repaired: [
    { who: 'Fetsson', text: "The counterweight swings — the gate groans open!" },
    { who: 'Pindus',  text: "Onwards! I can practically smell the apples from here." },
    { who: 'Fetsson', text: "That's the ravine, Pindus." },
    { who: 'Pindus',  text: "I have an optimistic nose." },
  ],
  bridge_already_fixed: [
    { who: 'Fetsson', text: "The bridge is solid. Let's keep moving." },
  ],

  // ── Waterfall ────────────────────────────────────────────────
  waterfall_intro: [
    { who: 'Pindus',  text: "Mossfall Grotto! I've read about this place. Apparently someone very wise or very bored carved symbols in the cave." },
    { who: 'Fetsson', text: "And the only way through is behind that waterfall." },
    { who: 'Pindus',  text: "Pitch dark inside. I can hear the underground stream from here." },
    { who: 'Fetsson', text: "That's just pleasant." },
  ],
  torch_pickup: [
    { who: 'Fetsson', text: "An unlit torch on a wall bracket. Someone left it here with either hope or foresight." },
  ],
  campfire_no_torch: [
    { who: 'Fetsson', text: "The embers are still warm. Hot enough to start something." },
    { who: 'Pindus',  text: "A shame we have nothing to start." },
  ],
  campfire_light: [
    { who: 'Fetsson', text: "I touch the torch to the embers…" },
    { who: 'Fetsson', text: "It catches! A warm orange flame. Now we're in business." },
  ],
  cave_dark: [
    { who: 'Fetsson', text: "Absolutely, completely pitch dark in there. I'd walk straight into the stream." },
    { who: 'Pindus',  text: "I went in three steps and introduced my face to a stalactite. It was cold and unyielding." },
  ],
  cave_torch_unlit: [
    { who: 'Fetsson', text: "I'm not going in there with an unlit torch. That's just carrying a stick with ambitions." },
    { who: 'Pindus',  text: "Technically it IS a stick. Just with a dramatic hat." },
  ],
  stepping_stone_intro: [
    { who: 'Pindus',  text: "The underground stream. Natural. Inevitable. Deeply inconvenient." },
    { who: 'Fetsson', text: "There are stepping stones across. Three in each column." },
    { who: 'Pindus',  text: "And symbols carved into the rock above them. Someone put thought into this." },
    { who: 'Fetsson', text: "Let's hope it's navigable thought rather than the decorative kind." },
  ],
  waterfall_crossed: [
    { who: 'Fetsson', text: "Made it! The cave opens onto the other side. My feet are only slightly damp." },
    { who: 'Pindus',  text: "I smell apples. Real apples. We're close!" },
  ],

  // ── Apple Orchard ────────────────────────────────────────────
  orchard_intro: [
    { who: 'Pindus',  text: "The apple orchard! Look at those trees!" },
    { who: 'Fetsson', text: "The apples are perfectly ripe. Mrs. Hen is going to love these." },
    { who: 'Pindus',  text: "I have already found four excellent sticks. This place is paradise." },
  ],
  apple_pickup_no_basket: [
    { who: 'Fetsson', text: "I want to grab every apple I can see, but I'd need something to carry them in." },
    { who: 'Pindus',  text: "Mrs. Hen was very thoughtful about that." },
  ],
  apple_pickup: [
    { who: 'Fetsson', text: "I fill the basket with the ripest, reddest apples I can find." },
    { who: 'Pindus',  text: "That should be plenty. I also collected seventeen premium sticks." },
    { who: 'Fetsson', text: "Pindus, we came for apples." },
    { who: 'Pindus',  text: "I came for both." },
  ],
  rush_home: [
    { who: 'Fetsson', text: "We have a full basket of beautiful apples. Time to race back to Mrs. Hen!" },
    { who: 'Pindus',  text: "I know a shortcut through the hedge — follow me!" },
  ],

  // ── Game complete ─────────────────────────────────────────────
  game_complete: [
    { who: 'Mrs. Hen', text: "You're back — and you found the apples! You both look absolutely exhausted. What happened out there?" },
    { who: 'Fetsson',  text: "We fixed the old bridge, balanced a counterweight gate, crossed a dark cave, and made it all the way to the orchard and back." },
    { who: 'Pindus',   text: "I also acquired twenty-two sticks of exceptional quality. Very productive journey." },
    { who: 'Mrs. Hen', text: "Twenty-two sticks! You are truly remarkable, Pindus." },
    { who: 'Pindus',   text: "That's what I keep telling everyone." },
    { who: 'Mrs. Hen', text: "Sit, sit! I'll make a fresh batch of apple pancakes. With real apples this time." },
    { who: 'Fetsson',  text: "The best morning on the farm, second edition." },
  ],

  // ── Algott / Scarecrow arc ─────────────────────────────────────
  scarecrow_acting_weird: [
    { who: 'Mrs. Hen', text: "Oh — one more thing before you get too comfortable." },
    { who: 'Mrs. Hen', text: "The scarecrow in the yard has been… unusual. Every evening, standing perfectly still, staring through my kitchen window." },
    { who: 'Fetsson',  text: "Scarecrows are supposed to stare at things. That's the job." },
    { who: 'Mrs. Hen', text: "Into my KITCHEN window. Every night for three years. With what I can only describe as profound longing." },
    { who: 'Pindus',   text: "Technically, longing is a valid emotional state for a scarecrow. They have very little else to do." },
    { who: 'Mrs. Hen', text: "I wake up at three in the morning and it's just standing there, watching. Could you please find out what it wants? Before I lose my mind entirely." },
  ],
  scarecrow_weird_state: [
    { who: 'Fetsson', text: "Hey. Scarecrow. Are you… staring at Mrs. Hen's window?" },
    { who: 'Algott',  text: "…Yes." },
    { who: 'Fetsson', text: "Any particular reason?" },
    { who: 'Algott',  text: "The light from her kitchen. Warm and amber, a fire behind glass. It reminds me of my workshop at night." },
    { who: 'Pindus',  text: "You had a workshop?" },
    { who: 'Algott',  text: "My name is Algott. I was a watchmaker. In the city, on Gearsmith Street, for forty-two years. Every clock between the North Gate and the market square passed through my hands at some point." },
    { who: 'Pindus',  text: "And now you're a scarecrow." },
    { who: 'Algott',  text: "The city evicts what it outgrows. That's the diplomatic phrasing. I prefer 'discarded', but nobody asked me." },
  ],
  scarecrow_backstory: [
    { who: 'Algott',  text: "My landlord decided my lease was more valuable than my continued presence. He gave me seven minutes to collect my things." },
    { who: 'Fetsson', text: "Seven minutes. That's genuinely awful." },
    { who: 'Algott',  text: "I brought my hat, my lunch tin, and a chisel I have never once used in forty-two years of watchmaking. I forgot my father's pocket watch, which sat on the left shelf behind the third clock." },
    { who: 'Algott',  text: "It's the most important thing I have ever owned. I left it behind in a panic while a man with a ledger stood in my doorway counting my remaining seconds." },
    { who: 'Algott',  text: "I walked until I couldn't. I made it as far as this field. Mrs. Hen planted a stick next to me in the ground when she found me, which I believe was meant as kindness." },
    { who: 'Pindus',  text: "She does that. Very supportive of vertical things." },
    { who: 'Algott',  text: "I've been standing here for three winters. The crows don't bother me anymore. We've reached an understanding." },
    { who: 'Fetsson', text: "What happened to your workshop?" },
    { who: 'Algott',  text: "A sausage merchant named Torsten moved in. He hung cured meats over my workbench. My clocks are still there — he uses them as decoration. He has no idea what any of them are worth, nor what I left hidden behind them." },
  ],
  scarecrow_quest: [
    { who: 'Algott',  text: "I would ask one favour, if you're traveling further." },
    { who: 'Fetsson', text: "We might be. What do you need?" },
    { who: 'Algott',  text: "My father's watch. Behind the third clock on the left shelf in my old workshop. Torsten hasn't found it — the shelf is bolted to the wall and he's never had reason to look behind the clocks." },
    { who: 'Algott',  text: "The shelf has a hidden panel I designed myself. I was very proud of that. It opens when all three clocks are set to the right times." },
    { who: 'Pindus',  text: "What are the correct times?" },
    { who: 'Algott',  text: "I left notes all over that workshop. I documented everything. The times were part of my daily routine — opening, midday, closing. The notes will tell you everything." },
    { who: 'Algott',  text: "The city is about two hours south by road. The gate should give you no trouble. It rarely does. Guard quality has been declining steadily since the market started shrinking." },
    { who: 'Fetsson', text: "We'll find your watch, Algott." },
    { who: 'Algott',  text: "I know you will. I've watched you two fix that bridge, balance a counterweight, and cross a cave in pitch darkness. I've been waiting for exactly this kind of capable company." },
    { who: 'Pindus',  text: "We are, in retrospect, remarkably useful." },
  ],
  scarecrow_reminder: [
    { who: 'Algott', text: "The third clock on the left shelf. The notes in the workshop will tell you the times." },
    { who: 'Algott', text: "My old apprentice Birger still has a stall in the market square. He knew the shop well. He may be of help." },
  ],
  algott_return: [
    { who: 'Fetsson', text: "Algott — we found your watch." },
    { who: 'Algott',  text: "…" },
    { who: 'Algott',  text: "I can hear it ticking from here. It still works." },
    { who: 'Fetsson', text: "We wound it. Seemed like the right thing to do." },
    { who: 'Algott',  text: "My father's watch. Three winters in a dark workshop and it just needed winding." },
    { who: 'Pindus',  text: "A good mechanism outlasts almost everything." },
    { who: 'Algott',  text: "I can't hold it, of course. No pockets. My hands are currently stuffed with straw." },
    { who: 'Fetsson', text: "We could hang it from your post. There's a nail near your left shoulder." },
    { who: 'Algott',  text: "Yes. Do that. I'll be able to hear it when the east wind is right." },
    { who: 'Algott',  text: "Thank you, Fetsson. And Pindus. I've been standing in this field for three years with nothing but my thoughts and the occasional crow. This helps considerably." },
    { who: 'Pindus',  text: "You gave us a reason to go to the city. That turned out to be genuinely worthwhile." },
    { who: 'Algott',  text: "Tell Mrs. Hen I'll stop watching her window. I have something better to listen to now." },
  ],
  algott_done: [
    { who: 'Algott', text: "I can hear it when the east wind is right." },
    { who: 'Algott', text: "Three winters. I thought it might have rusted. It hadn't." },
  ],

  // ── City Gate ──────────────────────────────────────────────────
  citygate_intro: [
    { who: 'Pindus',  text: "The city! Varnholm. I was here as a larva. Considerably smaller. Completely overlooked by everyone." },
    { who: 'Fetsson', text: "The gate is shut." },
    { who: 'Pindus',  text: "Cities enjoy controlling who enters. Historically this has worked poorly for all involved, but they persist." },
  ],
  gate_examine: [
    { who: 'Fetsson', text: "Heavy oak planks, iron straps. The latch bar is on the inside." },
    { who: 'Pindus',  text: "There's a gap between the planks near the latch. Not large, but interesting." },
  ],
  gate_latch_no_stick: [
    { who: 'Fetsson', text: "There's a gap here I could reach through, but my hoof is too wide." },
    { who: 'Pindus',  text: "You'd need something thin and long. Fortunately, that's a category of objects we know well." },
  ],
  gate_latch_success: [
    { who: 'Fetsson', text: "The stick fits through the gap perfectly… I can feel the latch bar… there." },
    { who: 'Fetsson', text: "The gate swings open." },
    { who: 'Pindus',  text: "Elegant. Primitive. Entirely effective. Three of my favourite adjectives." },
  ],
  sleeping_guard: [
    { who: 'Fetsson', text: "The guard is completely asleep. His helmet has slid down over his face." },
    { who: 'Pindus',  text: "He's been at this post for some time. His beard has grown into the booth's woodwork." },
    { who: 'Fetsson', text: "We should probably wake him." },
    { who: 'Pindus',  text: "He appears to be having a dream about sausages, based on the ambient sounds. Let him finish." },
  ],
  gate_notice: [
    { who: 'Fetsson', text: "'City of Varnholm. Population: Declining. Admission: Formerly by toll; currently on the honour system, pending resolution of ongoing guard-quality discussions.'" },
    { who: 'Pindus',  text: "Refreshingly honest, for a city gate." },
  ],

  // ── Marketplace ────────────────────────────────────────────────
  marketplace_intro: [
    { who: 'Pindus',  text: "The market square. Exactly as I remember it from my larval years — except smaller, quieter, and substantially more melancholy." },
    { who: 'Fetsson', text: "Half the stalls are empty." },
    { who: 'Pindus',  text: "The city has been shrinking for a generation. The people who remain sell things to each other in an ever-tightening circle. It's technically an economy." },
    { who: 'Fetsson', text: "We should find Birger's stall." },
  ],
  birger_greeting: [
    { who: 'Birger',  text: "Good afternoon. I have pickled turnips, two repaired pocket watches, a hat that fits most heads, and opinions on most things. What can I do for you?" },
    { who: 'Fetsson', text: "We're looking for help finding an old workshop. We're running an errand for someone named Algott." },
    { who: 'Birger',  text: "…" },
    { who: 'Birger',  text: "Algott? Algott from Gearsmith Street? Old watchmaker Algott?" },
    { who: 'Fetsson', text: "He's technically a scarecrow now." },
    { who: 'Birger',  text: "A— he was my master for twelve years! He taught me everything I know about clockwork! Where has he been?!" },
    { who: 'Pindus',  text: "A field south of here. He seems well, under the circumstances. The crows respect him." },
  ],
  birger_trade: [
    { who: 'Birger',  text: "Three years. I thought he'd just… moved away somewhere without telling anyone. Which would have been very unlike him." },
    { who: 'Fetsson', text: "We need to get into his old workshop. The one Torsten the sausage man runs now. Algott left something valuable there." },
    { who: 'Birger',  text: "The hidden panel in the clock shelf. Yes, I know it — he showed me once, years ago. Never told me the times. Said I'd 'figure it out if I needed to'." },
    { who: 'Birger',  text: "His notes are still in there. Algott documented everything. Opening time, lunch, closing — it's all written down somewhere in that workshop." },
    { who: 'Birger',  text: "Torsten never changed the back door lock — he never does anything he can avoid. Here, take this spare key. I kept it from my apprenticeship." },
    { who: 'Pindus',  text: "We have apples. Would you like some apples?" },
    { who: 'Birger',  text: "…Algott always brought me an apple on my birthday. Every year for twelve years, without fail. Yes. Yes, I would very much like some apples." },
  ],
  birger_no_apples: [
    { who: 'Birger',  text: "Anything that helps Algott, I'll do. But I confess I'd be more forthcoming with a bit of apple." },
    { who: 'Birger',  text: "Algott used to bring me one every year on my birthday. It's been three years since the last one. A small loss, in the grand scheme, but it accumulates." },
  ],
  birger_after_trade: [
    { who: 'Birger',  text: "Third street past the fountain. Gearsmith Street. His sign is still on the door — Torsten was too lazy to take it down." },
    { who: 'Birger',  text: "Give Algott my regards. Tell him Birger still fixes watches the way he taught me — slowly, and correctly." },
  ],
  fountain: [
    { who: 'Fetsson', text: "A stone fountain with a brass clock dial on top. It's showing the wrong time." },
    { who: 'Pindus',  text: "In this city, that may be intentional." },
  ],

  // ── Workshop ───────────────────────────────────────────────────
  workshop_enter: [
    { who: 'Pindus',  text: "Gearsmith Street. Here we are." },
    { who: 'Fetsson', text: "I can see Algott's sign through the paint. They covered it with 'Torsten's Premium Sausages' but the old letters show through." },
    { who: 'Pindus',  text: "A ghost of a clockmaker haunting a sausage shop. That is genuinely, profoundly melancholy." },
    { who: 'Fetsson', text: "Come on. Back door." },
  ],
  workshop_note1: [
    { who: 'Fetsson', text: "A note pinned to the wall in careful handwriting: 'Shop always opened at seven. Father's rule, which became mine. The baker needed his watch fixed before his first loaves were done, and I was always there.'" },
    { who: 'Pindus',  text: "Obsessive documentation. Endearing in hindsight." },
  ],
  workshop_note2: [
    { who: 'Fetsson', text: "Carved directly into the workbench: 'Lunch at noon — not eleven fifty-eight, not twelve past. Father carved this to stop me working through it. It did not work, so he carved it deeper.'" },
    { who: 'Pindus',  text: "The bench confirms the inscription." },
  ],
  workshop_note3: [
    { who: 'Fetsson', text: "A letter, half-written, propped against the wall: 'Closed at five. Not five-past, not four-fifty-nine. Five exactly. My wife set her own clock by me. This is not a joke. She literally used me as a time reference.'" },
    { who: 'Pindus',  text: "A man of remarkable personal consistency." },
  ],
  workshop_clock_shelf: [
    { who: 'Fetsson', text: "The clock shelf. Three clocks, all stopped. And behind them, the wood grain is slightly different — a panel." },
    { who: 'Pindus',  text: "Algott said it opens when set to the correct times. The notes were the key. Literally." },
  ],
  workshop_clock_shelf_no_notes: [
    { who: 'Fetsson', text: "Three stopped clocks on a shelf. There's a panel behind them." },
    { who: 'Pindus',  text: "The notes in this workshop probably contain something useful." },
  ],
  clock_success: [
    { who: 'Fetsson', text: "Something clicks behind the third clock — the panel swings open." },
    { who: 'Fetsson', text: "There, exactly as Algott said: a pocket watch, perfectly maintained." },
    { who: 'Pindus',  text: "Stopped at five thirteen. The day it was left behind." },
    { who: 'Fetsson', text: "Let's wind it up and take it home." },
  ],
  watch_already_found: [
    { who: 'Fetsson', text: "The panel is open. The watch is already in my pocket." },
  ],
  sausages_flavor: [
    { who: 'Fetsson', text: "Torsten has hung sausages over absolutely everything. Including the precision instruments." },
    { who: 'Pindus',  text: "A curious display philosophy. And yet the sausages do look excellent." },
    { who: 'Fetsson', text: "Don't get distracted." },
    { who: 'Pindus',  text: "I'm cataloguing. There's a difference." },
  ],
};
